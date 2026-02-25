package foodie_auth_service.foodie_auth_service.service;

import foodie_auth_service.foodie_auth_service.dto.*;
import foodie_auth_service.foodie_auth_service.model.OtpVerification;
import foodie_auth_service.foodie_auth_service.model.Role;
import foodie_auth_service.foodie_auth_service.model.User;
import foodie_auth_service.foodie_auth_service.model.UserRole;
import foodie_auth_service.foodie_auth_service.repository.OtpRepository;
import foodie_auth_service.foodie_auth_service.repository.RoleRepository;
import foodie_auth_service.foodie_auth_service.repository.UserRepository;
import foodie_auth_service.foodie_auth_service.repository.UserRoleRepository;
import foodie_auth_service.foodie_auth_service.security.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private GeoLocationService geoLocationService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private RoleRepository roleRepo;
    @Autowired
    private UserRoleRepository userRoleRepo;
    @Autowired
    private OtpRepository otpRepo;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void testHash() {
        System.out.println(passwordEncoder.matches(
                "Abcd@123",
                "$2a$10$WG5UFykesbF0EtXkJSzT9OUS1ex7E.KdUb/pUEchtjnV7bz.CZY76"
        ));
    }

    // ===================== STEP 1: REQUEST OTP =====================

    @Override
    @Transactional
    public void requestOtp(String email) {

        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Delete old OTP
        otpRepo.deleteByEmailAndPurpose(email, "SIGNUP");

        // 🔥 THIS IS THE FIX
        otpRepo.flush();

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        OtpVerification otpEntity = new OtpVerification();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setPurpose("SIGNUP");
        otpEntity.setVerified(false);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(10));

        otpRepo.save(otpEntity);
        emailService.sendOtp(email, otp);
    }


    // ===================== STEP 2: VERIFY OTP =====================
    @Override
    @Transactional
    public String verifyOtp(String email, String otp) {

        OtpVerification otpEntity = otpRepo
                .findByEmailAndPurpose(email, "SIGNUP")
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        // ⏰ Expired?
        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepo.delete(otpEntity);
            throw new RuntimeException("OTP expired");
        }

        // ❌ Wrong OTP?
        if (!otpEntity.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // ✅ OTP is correct → DELETE IT
        otpRepo.delete(otpEntity);

        // 🔐 Create signup token (JWT or UUID)
        return jwtUtil.generateSignupToken(email);
    }


    // ===================== STEP 3: COMPLETE SIGNUP =====================
    @Override
    @Transactional
    public void completeSignup(CompleteSignupRequest req) {

        // 🔐 Validate signup token
        String emailFromToken = jwtUtil.validateSignupToken(req.getSignupToken());

        if (!emailFromToken.equals(req.getEmail())) {
            throw new RuntimeException("Invalid signup token");
        }

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setName(req.getName());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setEmailVerified(true);
        user.setProfileCompleted(true);
        user.setStatus("ACTIVE");

        userRepo.save(user);

        Role userRole = roleRepo.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("USER role not found"));

        UserRole ur = new UserRole();
        ur.setUser(user);
        ur.setRole(userRole);
        userRoleRepo.save(ur);

        emailService.sendSignupSuccessEmail(user.getEmail(), user.getName());
    }


    // ===================== LOGIN =====================
    @Override
    public LoginResult login(LoginRequest req, String ip, String userAgent) {

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email not verified");
        }

        if ("PENDING_APPROVAL".equals(user.getStatus())) {
            throw new RuntimeException("Admin approval pending");
        }

        List<String> roles = userRoleRepo.findByUser(user)
                .stream()
                .map(ur -> ur.getRole().getRoleName())
                .toList();

        String accessToken = jwtUtil.generateAccessToken(
                user.getUserId(),
                user.getEmail(),
                roles
        );

        String refreshToken = jwtUtil.generateRefreshToken(
                user.getUserId(),
                user.getEmail()
        );


        IpLocation location = geoLocationService.getLocation(ip);

        if (location != null) {
            emailService.sendLoginAlert(
                    user.getEmail(),
                    ip,
                    userAgent,
                    location.getLat(),
                    location.getLon(),
                    location.getCity(),
                    location.getCountry(),
                    location.getIsp()
            );
        }



        return new LoginResult(accessToken, refreshToken, roles);


    }

    // ===================== FORGOT PASSWORD =====================
    @Override
    public void forgotPassword(String email) {

        userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        String resetToken = UUID.randomUUID().toString();

        OtpVerification otpEntity = new OtpVerification();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setPurpose("FORGOT_PASSWORD");
        otpEntity.setResetToken(resetToken);
        otpEntity.setVerified(false);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(10));

        otpRepo.save(otpEntity);

        emailService.sendForgotPasswordEmail(
                email,
                otp,
                "http://localhost:3000/reset-password?token=" + resetToken
        );
    }

    // ===================== RESET PASSWORD =====================
    @Override
    public void resetPassword(String email, String otp, String newPassword) {

        OtpVerification otpEntity = otpRepo
                .findByEmailAndOtpAndPurpose(email, otp, "FORGOT_PASSWORD")
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        otpRepo.delete(otpEntity);
    }

    // ===================== ADD ROLE =====================
    @Override
    @Transactional
    public String addRoleToUser(String email, String roleName) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepo.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Prevent duplicate role
        if (!userRoleRepo.existsByUserAndRole(user, role)) {
            UserRole userRole = new UserRole();
            userRole.setUser(user);
            userRole.setRole(role);
            userRoleRepo.save(userRole);
        }

        // If admin approves restaurant
        if ("RESTAURANT_OWNER".equals(roleName)) {
            if ("PENDING_RESTAURANT_APPROVAL".equals(user.getStatus())) {
                user.setStatus("ACTIVE");
            }
            userRepo.save(user);
        }

        // 🔥 Rebuild roles from DB
        List<String> roles = userRoleRepo.findByUser(user)
                .stream()
                .map(ur -> ur.getRole().getRoleName())
                .toList();

        // 🔥 Issue fresh JWT with updated roles
        return jwtUtil.generateAccessToken(
                user.getUserId(),
                user.getEmail(),
                roles
        );
    }

    @Override
    @Transactional
    public void removeAllRestaurantRoles(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow();

        user.getUserRoles().removeIf(ur ->
                ur.getRole().getRoleName().equals("RESTAURANT_PARTNER") ||
                        ur.getRole().getRoleName().equals("RESTAURANT_OWNER")
        );

        userRepo.save(user);
    }

    @Override
    public Map<String, Object> refreshAccessToken(String refreshToken) {

        // 1️⃣ Validate refresh token
        Claims claims = jwtUtil.extractClaims(refreshToken);

        String email = claims.getSubject();
        Long userId = claims.get("userId", Long.class);

        // 2️⃣ Load user from DB
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Get LATEST roles from DB
        List<String> roles = userRoleRepo.findByUser(user)
                .stream()
                .map(ur -> ur.getRole().getRoleName())
                .toList();

        // 4️⃣ Issue NEW access token
        String newAccessToken =
                jwtUtil.generateAccessToken(user.getUserId(), user.getEmail(), roles);

        return Map.of(
                "accessToken", newAccessToken,
                "roles", roles
        );
    }

    @Override
    public UserDTO getUserProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                user.getUserRoles()
                        .stream()
                        .map(ur -> ur.getRole().getRoleName())
                        .toList()
        );
    }
    @Override
    @Transactional
    public void removeRoleFromUser(String email, String roleName) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getUserRoles().removeIf(ur ->
                ur.getRole().getRoleName().equals(roleName)
        );

        userRepo.save(user);
    }





}
