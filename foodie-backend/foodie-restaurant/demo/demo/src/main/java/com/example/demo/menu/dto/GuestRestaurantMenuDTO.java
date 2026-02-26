package com.example.demo.menu.dto;

import lombok.Data;

import java.util.List;

@Data
public class GuestRestaurantMenuDTO {
    private String restaurantId;
    private List<GuestMenuCategoryDTO> categories;

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public List<GuestMenuCategoryDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<GuestMenuCategoryDTO> categories) {
        this.categories = categories;
    }
}
