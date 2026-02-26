package com.example.demo.dto;

import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.model.RestaurantBankDetails;
import lombok.Data;

@Data
public class RestaurantKycDTO {
    private Restaurant restaurant;
    private RestaurantBankDetails bankDetails;
    private boolean kycComplete;


}

