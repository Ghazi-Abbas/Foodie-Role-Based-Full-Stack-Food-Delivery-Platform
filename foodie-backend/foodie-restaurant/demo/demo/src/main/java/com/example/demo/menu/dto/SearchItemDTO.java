package com.example.demo.menu.dto;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SearchItemDTO {
    private String itemId;
    private String itemName;
    private double price;
    private boolean veg;
    private String imageUrl;
    private double rating;
    private String restaurantId;
    private String restaurantName;
}

