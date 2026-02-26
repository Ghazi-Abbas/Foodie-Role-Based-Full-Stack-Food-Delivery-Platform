package com.example.demo.order.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    private String foodItemId;
    private String itemName;
    private String imageUrl;
    private double price;
    private int quantity;
}
