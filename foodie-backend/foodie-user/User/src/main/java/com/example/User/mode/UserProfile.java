package com.example.User.mode;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "user_profiles")
public class UserProfile {

    @Id
    private String id;

    private String email;
    private String name;

    private List<CartItem> cart = new ArrayList<>();

    // 🔥 THIS WAS MISSING OR WRONG
    private List<FavouriteItem> favourites = new ArrayList<>();

    private List<String> activeOrders = new ArrayList<>();
    private List<String> orderHistory = new ArrayList<>();

    private boolean hasMembership = false;

    // ===== GETTERS =====

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public List<CartItem> getCart() {
        return cart;
    }

    public List<FavouriteItem> getFavourites() {
        return favourites;
    }

    public List<String> getActiveOrders() {
        return activeOrders;
    }

    public List<String> getOrderHistory() {
        return orderHistory;
    }

    public boolean isHasMembership() {
        return hasMembership;
    }
}
