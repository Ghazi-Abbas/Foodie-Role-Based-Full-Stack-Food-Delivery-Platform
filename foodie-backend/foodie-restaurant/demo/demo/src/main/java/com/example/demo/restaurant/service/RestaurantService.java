package com.example.demo.restaurant.service;

import com.example.demo.restaurant.exception.RestaurantAlreadyExistException;
import com.example.demo.restaurant.exception.RestaurantNotExistException;
import com.example.demo.restaurant.model.Restaurant;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RestaurantService {

    List<Restaurant> findByOwnerEmailId(String emailId) throws RestaurantNotExistException;

    Restaurant addNewRestaurant(Restaurant restaurant, MultipartFile image) throws RestaurantAlreadyExistException;

    void deleteRestaurantById(String id) throws RestaurantNotExistException;

    Restaurant updateRestaurant(Restaurant restaurant, String userEmail);

// by ghazi

    // ===== Admin KYC Flow =====

    Restaurant approveRestaurant(String id) throws RestaurantNotExistException;

    Restaurant activateRestaurant(String id) throws RestaurantNotExistException;

    Restaurant rejectRestaurantByAdmin(String id, String adminEmail, String reason) throws RestaurantNotExistException;

    Restaurant suspendRestaurant(String id, String adminEmail, String reason) throws RestaurantNotExistException;
    Restaurant reinstateRestaurant(String id, String adminEmail);
    Restaurant holdRestaurantByAdmin(String restaurantId, String adminEmail, String reason);


    Restaurant permanentlyBlockRestaurant(
            String restaurantId,
            String adminEmail,
            String reason
    );



}
