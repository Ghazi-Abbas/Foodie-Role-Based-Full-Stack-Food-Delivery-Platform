package com.example.demo.menu.dto;

import com.example.demo.menu.model.MenuItem;
import com.example.demo.menu.model.MenuItemReview;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ItemDetailsResponse {
    private MenuItem item;
    private double averageRating;
    private int totalRatings;
    private List<MenuItemReview> reviews;
}
