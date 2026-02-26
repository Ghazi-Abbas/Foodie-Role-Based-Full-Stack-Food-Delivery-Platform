package com.example.demo.restaurant.service;

import com.example.demo.restaurant.model.RestaurantBankDetails;

public interface RestaurantBankService {

    RestaurantBankDetails addBankDetails(RestaurantBankDetails bankDetails);

    RestaurantBankDetails getBankDetailsByRestaurantId(String restaurantId);

    RestaurantBankDetails updateBankDetails(RestaurantBankDetails bank, String userEmail);
}
