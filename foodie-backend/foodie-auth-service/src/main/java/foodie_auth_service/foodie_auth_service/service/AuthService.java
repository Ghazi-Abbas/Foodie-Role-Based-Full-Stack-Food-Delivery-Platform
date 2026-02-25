package foodie_auth_service.foodie_auth_service.service;

import foodie_auth_service.foodie_auth_service.dto.*;

import java.util.Map;

public interface AuthService {

    // STEP 1: Request OTP
    void requestOtp(String email);

    // STEP 2: Verify OTP
    String verifyOtp(String email, String otp);

    // STEP 3: Complete Signup
    void completeSignup(CompleteSignupRequest request);

    // STEP 4: Login ✅ (FIXED)
    LoginResult login(LoginRequest req, String ip, String userAgent);

    // STEP 5: Forgot Password
    void forgotPassword(String email);

    // STEP 6: Reset Password
    void resetPassword(String email, String otp, String newPassword);
    String addRoleToUser(String email, String roleName);
    void removeAllRestaurantRoles(String email);
    Map<String, Object> refreshAccessToken(String refreshToken);
    UserDTO getUserProfile(String email);
    void removeRoleFromUser(String email, String roleName);

}
