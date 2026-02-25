package foodie_auth_service.foodie_auth_service.repository;

import foodie_auth_service.foodie_auth_service.model.Role;
import foodie_auth_service.foodie_auth_service.model.User;
import foodie_auth_service.foodie_auth_service.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUser(User user);
    boolean existsByUserAndRole(User user, Role role);
}

