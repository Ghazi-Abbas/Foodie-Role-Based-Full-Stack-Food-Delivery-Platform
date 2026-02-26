package com.example.demo.menu.dto;

import lombok.Data;

@Data
public class AddReviewRequest {

    private String restaurantId;
    private String itemId;
    private int rating;
    private String review;

    private String userName;
}

