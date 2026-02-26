package com.example.demo.menu.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Objects;

@Document(collection = "menus")
public class Menu {

    @Id
    private String id;

    private String restaurantId;
    private String restaurantName;
    private List<MenuCategory> categories;

    public Menu() {
    }

    public Menu(String id, String restaurantId, List<MenuCategory> categories) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.categories = categories;
    }
// getters & setters


    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public List<MenuCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<MenuCategory> categories) {
        this.categories = categories;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Menu menu = (Menu) o;
        return Objects.equals(id, menu.id) && Objects.equals(restaurantId, menu.restaurantId) && Objects.equals(categories, menu.categories);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, restaurantId, categories);
    }

    @Override
    public String toString() {
        return "Menu{" +
                "id='" + id + '\'' +
                ", restaurantId='" + restaurantId + '\'' +
                ", categories=" + categories +
                '}';
    }
}

