package foodie_auth_service.foodie_auth_service.repository;

import foodie_auth_service.foodie_auth_service.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByEmailAndPurpose(String email, String purpose);

    Optional<OtpVerification> findByEmailAndOtpAndPurpose(
            String email, String otp, String purpose
    );

    void deleteByEmailAndPurpose(String email, String purpose);
}
