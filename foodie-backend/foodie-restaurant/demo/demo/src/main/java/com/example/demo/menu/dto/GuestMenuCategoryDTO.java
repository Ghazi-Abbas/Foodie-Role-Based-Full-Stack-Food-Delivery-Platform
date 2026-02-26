package com.example.demo.menu.dto;

import lombok.Data;

import java.util.List;

@Data
public class GuestMenuCategoryDTO {
    private String category;
    private List<GuestMenuItemDTO> items;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<GuestMenuItemDTO> getItems() {
        return items;
    }

    public void setItems(List<GuestMenuItemDTO> items) {
        this.items = items;
    }
}

