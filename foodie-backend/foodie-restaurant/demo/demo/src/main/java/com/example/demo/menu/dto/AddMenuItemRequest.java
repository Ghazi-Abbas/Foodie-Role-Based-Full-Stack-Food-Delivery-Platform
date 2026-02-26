package com.example.demo.menu.dto;

import lombok.Data;

@Data
public class AddMenuItemRequest {
    private String itemName;
    private double price;
    private boolean veg;
    private String description;
    private String imageUrl;
}
