package foodie_auth_service.foodie_auth_service.controller;


import foodie_auth_service.foodie_auth_service.dto.*;
import foodie_auth_service.foodie_auth_service.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private AuthService authService;

    // STEP 1: Request OTP
    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody EmailRequest request) {
        authService.requestOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to email");
    }

    // STEP 2: Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest req) {
        String token = authService.verifyOtp(req.getEmail(), req.getOtp());
        return ResponseEntity.ok(Map.of("signupToken", token));
    }
    // STEP 3: Complete Signup
    @PostMapping("/complete-signup")
    public ResponseEntity<String> completeSignup(
            @RequestBody CompleteSignupRequest request) {
        authService.completeSignup(request);
        return ResponseEntity.ok("Signup completed successfully");
    }

    // STEP 4: Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {

        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        // This returns accessToken + refreshToken + roles
        LoginResult result = authService.login(request, ip, userAgent);

        // 🔥 Store refresh token in HttpOnly cookie
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", result.getRefreshToken())
                .httpOnly(true)
                .secure(false)      // set true only when using HTTPS
                .sameSite("Lax")    // MUST be Lax for localhost
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // Only send accessToken + roles to frontend
        return ResponseEntity.ok(
                new AuthResponse(
                        result.getAccessToken(),
                        result.getRoles()
                )
        );
    }


    // ================= FORGOT PASSWORD =================

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Password reset OTP sent to email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password reset successfully");
    }

    @PostMapping("/assign-role")
    public ResponseEntity<?> assignRole(
            @RequestParam String email,
            @RequestParam String roleName) {

        String newToken = authService.addRoleToUser(email, roleName);

        return ResponseEntity.ok(Map.of(
                "message", "Role assigned successfully",
                "accessToken", newToken
        ));
    }

    @PostMapping("/remove-all-restaurant-roles")
    public ResponseEntity<?> removeRestaurantRoles(@RequestParam String email) {

        authService.removeAllRestaurantRoles(email);

        return ResponseEntity.ok("Restaurant roles removed");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).body("Refresh token missing");
        }

        try {
            Map<String, Object> result = authService.refreshAccessToken(refreshToken);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        UserDTO user = authService.getUserProfile(email);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/remove-role")
    public ResponseEntity<?> removeRole(
            @RequestParam String email,
            @RequestParam String roleName
    ) {
        authService.removeRoleFromUser(email, roleName);
        return ResponseEntity.ok("Role removed");
    }




}

