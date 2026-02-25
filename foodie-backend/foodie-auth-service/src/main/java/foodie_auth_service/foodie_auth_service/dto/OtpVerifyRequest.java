package foodie_auth_service.foodie_auth_service.dto;



import lombok.Data;

@Data
public class OtpVerifyRequest {
    private String email;
    private String otp;


    // from verifyOtp()



}

