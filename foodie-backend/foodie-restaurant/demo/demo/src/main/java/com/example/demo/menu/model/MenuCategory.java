package com.example.demo.menu.model;

import java.util.List;

public class MenuCategory {

    private String categoryId;
    private MenuCategoryType categoryType;
    private String categoryName;           // "Veg", "Snacks"

    private Integer displayOrder;           // 1, 2, 3...

    private List<MenuItem> items;


    public MenuCategory() {}

    public String getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public MenuCategoryType getCategoryType() {
        return categoryType;
    }

    public void setCategoryType(MenuCategoryType categoryType) {
        this.categoryType = categoryType;
    }

    public List<MenuItem> getItems() {
        return items;
    }

    public void setItems(List<MenuItem> items) {
        this.items = items;
    }
}
