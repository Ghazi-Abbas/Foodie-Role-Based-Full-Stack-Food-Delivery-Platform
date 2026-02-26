package com.example.demo.restaurant.repository;

import com.example.demo.restaurant.model.RestaurantBankDetails;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RestaurantBankRepository
        extends MongoRepository<RestaurantBankDetails, String> {

    Optional<RestaurantBankDetails> findByRestaurantId(String restaurantId);
    boolean existsByRestaurantId(String restaurantId);
}
