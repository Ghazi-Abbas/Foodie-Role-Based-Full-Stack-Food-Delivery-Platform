package foodie_auth_service.foodie_auth_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "otp_verification",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"email", "purpose"})
        }
)
@Data
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long otpId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private String purpose; // SIGNUP / FORGOT_PASSWORD

    private boolean verified;

    private String resetToken;

    private LocalDateTime expiryTime;
}

