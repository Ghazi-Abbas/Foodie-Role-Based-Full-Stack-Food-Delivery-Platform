package com.example.demo.menu.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MenuItemReviewDTO {
    private String userName;
    private int rating;
    private String review;
    private LocalDateTime createdAt;
}
