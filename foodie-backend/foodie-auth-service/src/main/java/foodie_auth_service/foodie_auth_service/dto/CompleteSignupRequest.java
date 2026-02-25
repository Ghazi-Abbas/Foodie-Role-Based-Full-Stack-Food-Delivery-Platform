package foodie_auth_service.foodie_auth_service.dto;

import lombok.Data;

@Data
public class CompleteSignupRequest {
    private String email;
    private String name;
    private String password;
    // 🔐 This is sent after OTP verification
    private String signupToken;
}
