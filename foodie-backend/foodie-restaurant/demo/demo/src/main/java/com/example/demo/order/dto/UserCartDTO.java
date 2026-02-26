package com.example.demo.order.dto;

import lombok.Data;

@Data
public class UserCartDTO {

    private String foodItemId;
    private String itemName;
    private String imageUrl;

    private double price;
    private int quantity;

    private String restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantCity;
}
