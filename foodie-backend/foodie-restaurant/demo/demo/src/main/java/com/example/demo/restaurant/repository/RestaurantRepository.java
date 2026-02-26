package com.example.demo.restaurant.repository;

import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.model.RestaurantStatus;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Map;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {

    List<Restaurant> findByOwnerEmail(String email);

    boolean existsByOwnerEmail(String ownerEmail);

    boolean existsByOwnerEmailAndRestaurantName(String email, String restaurantName);

    List<Restaurant> findByOwnerEmailAndStatus(String email, RestaurantStatus status);

    List<Restaurant> findByOwnerEmailAndActiveTrue(String email);

    List<Restaurant> findByStatus(RestaurantStatus status);

    long countByStatus(RestaurantStatus status);

    long countByActiveTrue();

    // 🔥 Mongo search (LIKE)
    @Query("{ $or: [ " +
            "{ restaurantName: { $regex: ?0, $options: 'i' } }, " +
            "{ city: { $regex: ?0, $options: 'i' } }, " +
            "{ ownerEmail: { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Restaurant> search(String q);

    // 🔥 City analytics
    @Aggregation(pipeline = {
            "{ $group: { _id: '$city', total: { $sum: 1 } } }",
            "{ $project: { _id: 0, city: '$_id', total: 1 } }"
    })
    List<Map<String, Object>> countByCity();

    boolean existsByOwnerEmailAndStatus(
            String ownerEmail,
            RestaurantStatus status
    );

    List<Restaurant> findByOwnerEmailAndActiveFalseAndStatusIn(
            String ownerEmail,
            List<RestaurantStatus> statuses
    );

    List<Restaurant> findByOwnerEmailAndStatusIn(
            String ownerEmail,
            List<RestaurantStatus> statuses
    );

}
