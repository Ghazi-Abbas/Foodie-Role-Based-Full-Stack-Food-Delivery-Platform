package foodie_auth_service.foodie_auth_service.repository;

import foodie_auth_service.foodie_auth_service.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByRoleName(String roleName);

}
