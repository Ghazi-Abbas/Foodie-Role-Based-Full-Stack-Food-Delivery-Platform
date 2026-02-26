package com.example.demo.menu.service;

import com.example.demo.menu.dto.AddReviewRequest;
import com.example.demo.menu.model.MenuItemReview;

import java.util.List;

public interface ReviewService {

    void addOrUpdateReview(
            AddReviewRequest request,
            String userId,
            String userName
    );

    // 🔥 ADD THIS
    List<MenuItemReview> getReviewsForRestaurant(String restaurantId);
}
