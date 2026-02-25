package com.example.User.service;

import com.example.User.mode.CartItem;
import com.example.User.mode.FavouriteItem;
import com.example.User.mode.UserProfile;

public interface UserService {

    UserProfile createUserAccount(UserProfile user);

    UserProfile getMyProfile(String email);

    // CART
    UserProfile addToCart(String email, CartItem item);
    UserProfile decreaseCartItem(String email, String foodItemId);
    UserProfile removeFromCart(String email, String foodItemId);

    // FAVOURITES
    UserProfile addFavourite(String email, FavouriteItem item);
    UserProfile removeFavourite(String email, String foodItemId);
    boolean isFavourite(String email, String foodItemId);

    /**
     * Clear user cart after order placement
     */
    void clearCart(String email);

    /**
     * Add active order reference (orderId only)
     */
    void addActiveOrder(String email, String orderId);

    /**
     * Move order from active → history
     */
    void addOrderHistory(String email, String orderId);

    /**
     * Used by internal services (Feign)
     */
    UserProfile getByEmail(String email);
}
