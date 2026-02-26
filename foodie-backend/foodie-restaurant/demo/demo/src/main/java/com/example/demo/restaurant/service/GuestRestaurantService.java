package com.example.demo.restaurant.service;


import com.example.demo.dto.GuestRestaurantDTO;

import java.util.List;

public interface GuestRestaurantService {

    List<GuestRestaurantDTO> getAllRestaurants();

    GuestRestaurantDTO getRestaurantById(String restaurantId);
}

