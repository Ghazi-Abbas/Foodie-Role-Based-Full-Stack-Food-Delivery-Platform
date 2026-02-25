package foodie_auth_service.foodie_auth_service.config;

import foodie_auth_service.foodie_auth_service.model.Role;
import foodie_auth_service.foodie_auth_service.model.User;
import foodie_auth_service.foodie_auth_service.model.UserRole;
import foodie_auth_service.foodie_auth_service.repository.RoleRepository;
import foodie_auth_service.foodie_auth_service.repository.UserRepository;
import foodie_auth_service.foodie_auth_service.repository.UserRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepo,
            RoleRepository roleRepo,
            UserRoleRepository userRoleRepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            String adminEmail = "ghazi@Admin.com";

            // 🔎 Check if admin exists
            User admin = userRepo.findByEmail(adminEmail).orElse(null);

            if (admin == null) {
                System.out.println("⚠️ Admin user not found — creating...");

                admin = new User();
                admin.setEmail(adminEmail);
                admin.setName("Ghazi");
                admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
                admin.setEmailVerified(true);
                admin.setProfileCompleted(true);
                admin.setStatus("ACTIVE");

                admin = userRepo.save(admin);
            } else {
                System.out.println("ℹ️ Admin user already exists — skipping creation");
            }

            // 🛡 Ensure ADMIN role exists
            Role adminRole = roleRepo.findByRoleName("ADMIN")
                    .orElseGet(() -> {
                        System.out.println("⚠️ ADMIN role not found — creating...");
                        Role role = new Role();
                        role.setRoleName("ADMIN");
                        return roleRepo.save(role);
                    });

            // 🔗 Ensure mapping exists
            if (!userRoleRepo.existsByUserAndRole(admin, adminRole)) {
                System.out.println("🔗 Mapping admin → ADMIN role");
                UserRole userRole = new UserRole();
                userRole.setUser(admin);
                userRole.setRole(adminRole);
                userRoleRepo.save(userRole);
            } else {
                System.out.println("✔️ Admin already has ADMIN role");
            }

            System.out.println("✅ Admin initialization complete");
        };
    }

}
