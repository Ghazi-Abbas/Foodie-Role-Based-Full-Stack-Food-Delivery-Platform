package com.example.demo.menu.model;



public enum MenuCategoryType {
    VEG("Veg"),
    NON_VEG("Non-Veg"),
    SNACKS("Snacks"),
    BEVERAGES("Beverages"),
    DESSERTS("Desserts");

    private final String label;

    MenuCategoryType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }


}


