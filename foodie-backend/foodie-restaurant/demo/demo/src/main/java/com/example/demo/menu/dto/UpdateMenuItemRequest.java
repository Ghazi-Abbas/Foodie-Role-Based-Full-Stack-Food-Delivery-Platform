package com.example.demo.menu.dto;

import lombok.Data;

@Data
public class UpdateMenuItemRequest {
    private String itemId;
    private String itemName;
    private double price;
    private boolean available;
    private String description;
}
