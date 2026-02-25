package foodie_auth_service.foodie_auth_service.config;

//import foodie_auth_service.foodie_auth_service.model.Role;
//import foodie_auth_service.foodie_auth_service.model.User;
//import foodie_auth_service.foodie_auth_service.model.UserRole;
//import foodie_auth_service.foodie_auth_service.repository.RoleRepository;
//import foodie_auth_service.foodie_auth_service.repository.UserRepository;
//import foodie_auth_service.foodie_auth_service.repository.UserRoleRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.util.Map;
//
//
////@Configuration
////public class DemoUserInitializer {
////
////    @Bean
////    CommandLineRunner createDemoUsers(
////            UserRepository userRepo,
////            RoleRepository roleRepo,
////            UserRoleRepository userRoleRepo,
////            PasswordEncoder passwordEncoder,
////            WebClient webClient
////    ) {
////        return args -> {
////
////            System.out.println("🚀 Starting Demo User Seeder");
////
////            // Ensure USER role exists
////            Role userRole = roleRepo.findByRoleName("USER")
////                    .orElseGet(() -> {
////                        Role role = new Role();
////                        role.setRoleName("USER");
////                        System.out.println("⚠️ USER role not found — creating...");
////                        return roleRepo.save(role);
////                    });
////
////            String[] demoNames = {
////                    "Rahul","Ankit","Rohit","Amit","Suman","Vikas","Priya","Neha","Pooja","Ravi",
////                    "Deepak","Sunil","Alok","Manish","Sachin","Ajay","Tarun","Nikhil","Gaurav","Pankaj",
////                    "Kiran","Mohit","Harsh","Yash","Ramesh","Suresh","Mukesh","Arjun","Rahul2","Vijay",
////                    "Anil","Karan","Naveen","Akash","Vinay","Abhishek","Raj","Sanjay","Nitin","Ashok"
////            };
////
////            for (String name : demoNames) {
////                String email = name.toLowerCase() + "@damo.local";
////
////                User user = userRepo.findByEmail(email).orElse(null);
////
////                if (user == null) {
////                    user = new User();
////                    user.setEmail(email);
////                    user.setName(name);
////                    user.setPasswordHash(passwordEncoder.encode("Abcd@123"));
////                    user.setEmailVerified(true);
////                    user.setProfileCompleted(true);
////                    user.setStatus("ACTIVE");
////
////                    user = userRepo.save(user);
////                    System.out.println("👤 MySQL created: " + email);
////
////                    // 🔥 Create MongoDB profile
////                    try {
////                        webClient.post()
////                                .uri("http://localhost:9091/users/create-user-account")
////                                .bodyValue(Map.of(
////                                        "email", email,
////                                        "name", name
////                                ))
////                                .retrieve()
////                                .bodyToMono(String.class)
////                                .block();
////
////                        System.out.println("📦 Mongo profile created: " + email);
////                    } catch (Exception e) {
////                        System.out.println("⚠️ Mongo already exists for: " + email);
////                    }
////                }
////
////                // Assign USER role
////                if (!userRoleRepo.existsByUserAndRole(user, userRole)) {
////                    UserRole ur = new UserRole();
////                    ur.setUser(user);
////                    ur.setRole(userRole);
////                    userRoleRepo.save(ur);
////                    System.out.println("🔗 USER role assigned: " + email);
////                }
////            }
////
////            System.out.println("✅ Demo users fully synced with Mongo + MySQL");
////        };
////    }
//}
//==== start======













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
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Configuration
public class DemoUserInitializer {

//    @Bean
//    CommandLineRunner seed(
//            UserRepository userRepo,
//            RoleRepository roleRepo,
//            UserRoleRepository userRoleRepo,
//            PasswordEncoder encoder,
//            WebClient webClient
//    ) {
//        return args -> {
//
//            System.out.println("🚀 STARTING FULL SYSTEM SEED");
//
//            // ---------------- ADMIN LOGIN ----------------
//            String adminToken = webClient.post()
//                    .uri("http://localhost:9090/auth/login")
//                    .bodyValue(Map.of(
//                            "email", "ghazi@Admin.com",
//                            "password", "Admin@123"
//                    ))
//                    .retrieve()
//                    .bodyToMono(Map.class)
//                    .map(r -> (String) r.get("accessToken"))
//                    .block();
//
//            if (adminToken == null)
//                throw new RuntimeException("❌ Admin login failed");
//
//            System.out.println("🔐 Admin authenticated");
//
//            // ---------------- ROLES ----------------
//            Role userRole = roleRepo.findByRoleName("USER")
//                    .orElseGet(() -> {
//                        Role r = new Role();
//                        r.setRoleName("USER");
//                        return roleRepo.save(r);
//                    });
//
//            Role partnerRole = roleRepo.findByRoleName("RESTAURANT_PARTNER")
//                    .orElseGet(() -> {
//                        Role r = new Role();
//                        r.setRoleName("RESTAURANT_PARTNER");
//                        return roleRepo.save(r);
//                    });
//
//            Role ownerRole = roleRepo.findByRoleName("RESTAURANT_OWNER")
//                    .orElseGet(() -> {
//                        Role r = new Role();
//                        r.setRoleName("RESTAURANT_OWNER");
//                        return roleRepo.save(r);
//                    });
//
//            String[] names = {
//                    "Rahul","Ankit","Rohit","Amit","Suman","Vikas","Priya","Neha","Pooja","Ravi",
//                    "Deepak","Sunil","Alok","Manish","Sachin","Ajay","Tarun","Nikhil","Gaurav","Pankaj",
//                    "Kiran","Mohit","Harsh","Yash","Ramesh","Suresh","Mukesh","Arjun","Rahul2","Vijay",
//                    "Anil","Karan","Naveen","Akash","Vinay","Abhishek","Raj","Sanjay","Nitin","Ashok"
//            };
//
//            for (int i = 0; i < names.length; i++) {
//
//                String name = names[i];
//                String email = name.toLowerCase() + "@damo.local";
//
//                // ---------------- USER ----------------
//                User user = userRepo.findByEmail(email).orElse(null);
//                if (user == null) {
//                    user = new User();
//                    user.setEmail(email);
//                    user.setName(name);
//                    user.setPasswordHash(encoder.encode("Abcd@123"));
//                    user.setEmailVerified(true);
//                    user.setProfileCompleted(true);
//                    user.setStatus("ACTIVE");
//                    user = userRepo.save(user);
//                }
//
//                assign(user, userRoleRepo, userRole);
//                assign(user, userRoleRepo, partnerRole);
//
//                // ---------------- MONGO PROFILE ----------------
//                try {
//                    webClient.post()
//                            .uri("http://localhost:9091/users/create-user-account")
//                            .bodyValue(Map.of("email", email, "name", name))
//                            .retrieve()
//                            .bodyToMono(Void.class)
//                            .block();
//                } catch (Exception ignored) {}
//
//                // ---------------- S3 IMAGE ----------------
//                String image = (i + 1 <= 20)
//                        ? "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/restaurant-images/Restaurant_" + (i + 1) + ".jpg"
//                        : "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/restaurant-images/Restaurant-image-" + (i + 1) + ".jpg";
//
//                // ---------------- RESTAURANT + BANK ----------------
//                webClient.post()
//                        .uri("http://localhost:9092/restaurant-api/admin/seed")
//                        .header("Authorization", "Bearer " + adminToken)
//                        .bodyValue(Map.ofEntries(
//                                Map.entry("restaurantName", name + " Kitchen"),
//                                Map.entry("ownerEmail", email),
//                                Map.entry("city", "Lucknow"),
//                                Map.entry("address", "Chowk Street " + (i + 1)),
//                                Map.entry("phone", "98765" + String.format("%05d", i)),
//                                Map.entry("panCard", "ABCDE" + String.format("%04d", i) + "F"),
//                                Map.entry("fssaiLicence", "12345678" + String.format("%04d", i)),
//                                Map.entry("restaurantImageUrl", image),
//                                Map.entry("openingTime", "09:00"),
//                                Map.entry("closingTime", "23:00"),
//                                Map.entry("accountHolderName", name),
//                                Map.entry("accountNumber", "900000" + String.format("%05d", i)),
//                                Map.entry("ifscCode", "FOOD" + String.format("%04d", i)),
//                                Map.entry("branchAddress", "Lucknow Branch " + i)
//                        ))
//                        .retrieve()
//                        .bodyToMono(Void.class)
//                        .block();
//
//                // ---------------- PROMOTE TO RESTAURANT_OWNER ----------------
//                assign(user, userRoleRepo, ownerRole);
//
//                System.out.println("🏪 Seeded & Activated: " + email);
//            }
//
//            System.out.println("🎯 FULL SYSTEM SEEDED SUCCESSFULLY");
//        };
//    }
//
//    // ---------------- ROLE ASSIGNER ----------------
//    private void assign(User u, UserRoleRepository repo, Role r) {
//        if (!repo.existsByUserAndRole(u, r)) {
//            UserRole ur = new UserRole();
//            ur.setUser(u);
//            ur.setRole(r);
//            repo.save(ur);
//        }
//    }
}



