package com.example.demo.dto;

import lombok.Data;

@Data
public class SeedRestaurantRequest {
    private String restaurantName;
    private String ownerEmail;
    private String city;
    private String address;
    private String phone;
    private String panCard;
    private String fssaiLicence;
    private String restaurantImageUrl;
    private String openingTime;
    private String closingTime;

    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;
    private String branchAddress;
}

