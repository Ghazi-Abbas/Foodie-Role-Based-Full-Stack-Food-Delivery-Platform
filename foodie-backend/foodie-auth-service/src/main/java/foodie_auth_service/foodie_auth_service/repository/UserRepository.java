package foodie_auth_service.foodie_auth_service.repository;

import foodie_auth_service.foodie_auth_service.model.User;
import foodie_auth_service.foodie_auth_service.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}



