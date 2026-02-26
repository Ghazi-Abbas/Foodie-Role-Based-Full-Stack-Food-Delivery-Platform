package com.example.demo.restaurant.repository;

import com.example.demo.restaurant.model.RestaurantKycAudit;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RestaurantKycAuditRepository
        extends MongoRepository<RestaurantKycAudit, String> {

    List<RestaurantKycAudit> findByRestaurantId(String restaurantId);

    // Must match: private LocalDateTime timestamp;
    List<RestaurantKycAudit> findTop20ByOrderByTimestampDesc();
    List<RestaurantKycAudit> findTop50ByOrderByTimestampDesc();
    RestaurantKycAudit findTop1ByRestaurantIdOrderByTimestampDesc(String restaurantId);

}
