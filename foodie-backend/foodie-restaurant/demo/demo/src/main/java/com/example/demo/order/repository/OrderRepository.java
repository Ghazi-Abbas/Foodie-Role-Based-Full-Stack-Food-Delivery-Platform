package com.example.demo.order.repository;

import com.example.demo.order.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByRestaurantId(String restaurantId);



    List<Order> findByRestaurantIdOrderByCreatedAtDesc(String restaurantId);

    List<Order> findByRestaurantIdAndOrderStatusOrderByCreatedAtDesc(
            String restaurantId,
            String orderStatus
    );

    List<Order> findByRestaurantIdAndOrderStatusInOrderByCreatedAtDesc(
            String restaurantId,
            List<String> statuses
    );

    List<Order> findByRestaurantIdAndOrderStatus(
            String restaurantId,
            String orderStatus
    );

    // ✅ THIS IS REQUIRED
    List<Order> findByRestaurantIdAndOrderStatusIn(
            String restaurantId,
            List<String> statuses
    );

    // USER
    List<Order> findByUserEmailAndOrderStatusIn(
            String userEmail,
            List<String> statuses
    );


}
