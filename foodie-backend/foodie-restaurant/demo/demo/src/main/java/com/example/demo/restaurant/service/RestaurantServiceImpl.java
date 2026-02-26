package com.example.demo.restaurant.service;


import com.example.demo.aws.service.S3Service;
import com.example.demo.restaurant.model.RestaurantKycAudit;
import com.example.demo.menu.model.Menu;
import com.example.demo.menu.repository.MenuRepository;
import com.example.demo.restaurant.exception.RestaurantAlreadyExistException;
import com.example.demo.restaurant.exception.RestaurantNotExistException;
import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.model.RestaurantStatus;
import com.example.demo.restaurant.repository.RestaurantKycAuditRepository;
import com.example.demo.restaurant.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantKycAuditRepository auditRepo;
    private final MenuRepository menuRepository;
    private final S3Service s3Service;

    @Override
    public List<Restaurant> findByOwnerEmailId(String emailId) throws RestaurantNotExistException {
        List<Restaurant> restaurants = restaurantRepository.findByOwnerEmail(emailId);

        if (restaurants.isEmpty()) {
            throw new RestaurantNotExistException("No restaurants found for owner: " + emailId);
        }
        return restaurants;
    }
    @Override
    public Restaurant addNewRestaurant(
            Restaurant restaurant,
            MultipartFile image
    ) throws RestaurantAlreadyExistException {

        // 1️⃣ Check if this user already has this restaurant
        boolean exists = restaurantRepository.existsByOwnerEmailAndRestaurantName(
                restaurant.getOwnerEmail(),
                restaurant.getRestaurantName()
        );

        if (exists) {
            throw new RestaurantAlreadyExistException(
                    "Restaurant already exists for this user"
            );
        }

        // 2️⃣ Upload Image to S3
        if (image != null && !image.isEmpty()) {
            String imageUrl = s3Service.uploadImage(image);
            restaurant.setRestaurantImageUrl(imageUrl);
        }

        // 3️⃣ Onboarding state
        restaurant.setStatus(RestaurantStatus.PENDING); // waiting for admin
        restaurant.setActive(false);                    // not live yet

        // 4️⃣ Assign RESTAURANT_PARTNER role (SECURE INTERNAL CALL)
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-INTERNAL-KEY", "FOODIE_INTERNAL_SECRET");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            restTemplate.postForObject(
                    "http://localhost:9090/auth/internal/assign-partner"
                            + "?email=" + restaurant.getOwnerEmail(),
                    entity,
                    String.class
            );

            System.out.println(
                    "✅ Role RESTAURANT_PARTNER assigned to "
                            + restaurant.getOwnerEmail()
            );

        } catch (Exception e) {
            System.out.println("❌ Failed to assign RESTAURANT_PARTNER role");
            e.printStackTrace();
            // ❗ intentionally NOT failing restaurant creation
        }

        // 5️⃣ Save Restaurant
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        // 6️⃣ Create Menu for restaurant
        Menu menu = new Menu();
        menu.setRestaurantId(savedRestaurant.getId());
        menu.setCategories(new ArrayList<>());
        menuRepository.save(menu);

        return savedRestaurant;
    }



//    @Override
//    public Restaurant addNewRestaurant(
//            Restaurant restaurant,
//            MultipartFile image
//    ) throws RestaurantAlreadyExistException {
//
//        // 1️⃣ Check if this user already has this restaurant
//        boolean exists = restaurantRepository.existsByOwnerEmailAndRestaurantName(
//                restaurant.getOwnerEmail(),
//                restaurant.getRestaurantName()
//        );
//
//        if (exists) {
//            throw new RestaurantAlreadyExistException("Restaurant already exists for this user");
//        }
//
//        // 2️⃣ Upload Image to S3
//        if (image != null && !image.isEmpty()) {
//            String imageUrl = s3Service.uploadImage(image);
//            restaurant.setRestaurantImageUrl(imageUrl);
//        }
//
//        // 3️⃣ Set onboarding state
//        restaurant.setStatus(RestaurantStatus.PENDING);   // waiting for admin
//        restaurant.setActive(false);                     // not live yet
//
//        // 4️⃣ Assign RESTAURANT_PARTNER role (NOT OWNER)
//        // by ghzai
//        try {
//            RestTemplate restTemplate = new RestTemplate();
//
//            String url = "http://localhost:9090/auth/assign-role"
//                    + "?email=" + restaurant.getOwnerEmail()
//                    + "&roleName=RESTAURANT_PARTNER";
//
//            restTemplate.postForObject(url, null, String.class);
//
//            System.out.println("✅ Role RESTAURANT_PARTNER assigned to " + restaurant.getOwnerEmail());
//
//        } catch (Exception e) {
//            System.out.println("❌ Failed to assign RESTAURANT_PARTNER role");
//            e.printStackTrace();
//        }
//
//        // 5️⃣ Save Restaurant
//        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
//
//        // 6️⃣ Create Menu for restaurant
//        Menu menu = new Menu();
//        menu.setRestaurantId(savedRestaurant.getId());
//        menu.setCategories(new ArrayList<>());
//        menuRepository.save(menu);
//
//        return savedRestaurant;
//    }


    @Override
    public Restaurant permanentlyBlockRestaurant(String id, String adminEmail, String reason) {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (restaurant.getStatus() == RestaurantStatus.PERMANENTLY_BLOCKED)
            throw new IllegalStateException("Restaurant already permanently blocked");

        restaurant.setStatus(RestaurantStatus.PERMANENTLY_BLOCKED);
        restaurant.setActive(false);

        Restaurant saved = restaurantRepository.save(restaurant);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "PERMANENTLY_BLOCKED",
                adminEmail,
                reason,
                LocalDateTime.now()
        ));

        return saved;
    }



    @Override
    public void deleteRestaurantById(String id) throws RestaurantNotExistException {

        if (!restaurantRepository.existsById(id)) {
            throw new RestaurantNotExistException("Restaurant not found");
        }

        restaurantRepository.deleteById(id);
    }

//    @Override
//    public Restaurant updateRestaurant(Restaurant restaurant) throws RestaurantNotExistException {
//
//        Restaurant existing = restaurantRepository.findById(restaurant.getId())
//                .orElseThrow(() -> new RestaurantNotExistException("Restaurant not found"));
//
//        existing.setRestaurantName(restaurant.getRestaurantName());
//        existing.setCity(restaurant.getCity());
//        existing.setAddress(restaurant.getAddress());
//        existing.setPhone(restaurant.getPhone());
//        existing.setOpeningTime(restaurant.getOpeningTime());
//        existing.setClosingTime(restaurant.getClosingTime());
//
//        //admin should change this it should not there -- By GHAZI
////        existing.setActive(restaurant.isActive());
//
//        return restaurantRepository.save(existing);
//    }

@Override
public Restaurant updateRestaurant(Restaurant restaurant, String userEmail) {

    Restaurant existing = restaurantRepository.findById(restaurant.getId())
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    // 🔐 OWNER CHECK
    if (!existing.getOwnerEmail().equals(userEmail))
        throw new RuntimeException("You are not the owner of this restaurant");

    // 🔒 BLOCK IF NOT EDITABLE
    if (existing.getStatus() == RestaurantStatus.APPROVED ||
            existing.getStatus() == RestaurantStatus.SUSPENDED ||
            existing.getStatus() == RestaurantStatus.PERMANENTLY_BLOCKED)
        throw new RuntimeException("Restaurant cannot be edited in this state");

    // ✅ Allowed fields only
    existing.setRestaurantName(restaurant.getRestaurantName());
    existing.setCity(restaurant.getCity());
    existing.setAddress(restaurant.getAddress());
    existing.setPhone(restaurant.getPhone());
    existing.setOpeningTime(restaurant.getOpeningTime());
    existing.setClosingTime(restaurant.getClosingTime());

    return restaurantRepository.save(existing);
}

//by ghazi

//@Override
//public Restaurant approveRestaurant(String id) throws RestaurantNotExistException {
//
//    Restaurant restaurant = restaurantRepository.findById(id)
//            .orElseThrow(() -> new RestaurantNotExistException("Restaurant not found"));
//
//    // ✅ KYC approval
//    restaurant.setStatus(RestaurantStatus.APPROVED);
//    restaurant.setActive(false);   // 🔥 STILL NOT LIVE
//
//    Restaurant saved = restaurantRepository.save(restaurant);
//
//    String ownerEmail = restaurant.getOwnerEmail();
//
//    try {
//        RestTemplate restTemplate = new RestTemplate();
//
//        // Remove partner
//        restTemplate.postForObject(
//                "http://localhost:9090/auth/remove-role?email=" + ownerEmail + "&roleName=RESTAURANT_PARTNER",
//                null,
//                String.class
//        );
//
//        // Promote to owner
//        restTemplate.postForObject(
//                "http://localhost:9090/auth/assign-role?email=" + ownerEmail + "&roleName=RESTAURANT_OWNER",
//                null,
//                String.class
//        );
//
//        System.out.println("✅ User promoted to RESTAURANT_OWNER");
//
//    } catch (Exception e) {
//        throw new RuntimeException("Auth role sync failed");
//    }
//
//    return saved;
//}

    @Override
    public Restaurant approveRestaurant(String id) {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (restaurant.getStatus() == RestaurantStatus.APPROVED)
            return restaurant;

        if (restaurant.getStatus() == RestaurantStatus.REJECTED)
            throw new RuntimeException("Rejected restaurant cannot be approved");

        restaurant.setStatus(RestaurantStatus.APPROVED);
        restaurant.setActive(false); // NOT LIVE YET

        return restaurantRepository.save(restaurant);
    }

    // by ghazi
    @Override
    public Restaurant rejectRestaurantByAdmin(String id, String adminEmail, String reason) {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (restaurant.getStatus() == RestaurantStatus.REJECTED)
            throw new IllegalStateException("Restaurant already rejected");

        restaurant.setStatus(RestaurantStatus.REJECTED);
        restaurant.setActive(false);

        Restaurant saved = restaurantRepository.save(restaurant);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "REJECTED",
                adminEmail,
                reason,
                LocalDateTime.now()
        ));

        return saved;
    }


    // by Ghazi
    @Override
    public Restaurant suspendRestaurant(String id, String adminEmail, String reason)
            throws RestaurantNotExistException {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotExistException("Restaurant not found"));

        if (restaurant.getStatus() == RestaurantStatus.PERMANENTLY_BLOCKED)
            throw new IllegalStateException("Restaurant is permanently blocked");

        if (restaurant.getStatus() == RestaurantStatus.SUSPENDED)
            throw new IllegalStateException("Restaurant already suspended");

        restaurant.setStatus(RestaurantStatus.SUSPENDED);
        restaurant.setActive(false);

        Restaurant saved = restaurantRepository.save(restaurant);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "SUSPENDED",
                adminEmail,
                reason,
                LocalDateTime.now()
        ));

        return saved;
    }



    @Override
    public Restaurant reinstateRestaurant(String id, String adminEmail) {

        Restaurant r = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (r.getStatus() == RestaurantStatus.PERMANENTLY_BLOCKED)
            throw new IllegalStateException("This restaurant is permanently blocked");

        if (r.getStatus() != RestaurantStatus.SUSPENDED)
            throw new IllegalStateException("Only suspended restaurants can be reinstated");

        r.setStatus(RestaurantStatus.APPROVED);
        r.setActive(false);

        Restaurant saved = restaurantRepository.save(r);

        auditRepo.save(new RestaurantKycAudit(
                null,
                id,
                "REINSTATED",
                adminEmail,
                "Suspension removed",
                LocalDateTime.now()
        ));

        return saved;
    }



    // by Ghazi
//    public Restaurant holdRestaurant(String id) throws RestaurantNotExistException {
//
//        Restaurant restaurant = restaurantRepository.findById(id)
//                .orElseThrow(() -> new RestaurantNotExistException("Restaurant not found"));
//
//        restaurant.setStatus(RestaurantStatus.ON_HOLD);
//        restaurant.setActive(false);
//
//        return restaurantRepository.save(restaurant);
//    }

    @Override
    public Restaurant holdRestaurantByAdmin(String restaurantId, String adminEmail, String reason) {

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (restaurant.getStatus() == RestaurantStatus.PERMANENTLY_BLOCKED)
            throw new IllegalStateException("Restaurant permanently blocked");

        if (restaurant.getStatus() == RestaurantStatus.REJECTED)
            throw new IllegalStateException("Rejected restaurant cannot be put on hold");

        restaurant.setStatus(RestaurantStatus.ON_HOLD);
        restaurant.setActive(false);

        Restaurant saved = restaurantRepository.save(restaurant);

        auditRepo.save(new RestaurantKycAudit(
                null,
                restaurantId,
                "ON_HOLD",
                adminEmail,
                reason,
                LocalDateTime.now()
        ));

        return saved;
    }




    public Restaurant activateRestaurant(String id) throws RestaurantNotExistException {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotExistException("Restaurant not found"));

        if (restaurant.getStatus() != RestaurantStatus.APPROVED) {
            throw new RuntimeException("Restaurant not approved yet");
        }

        restaurant.setActive(true);
        return restaurantRepository.save(restaurant);
    }



}
