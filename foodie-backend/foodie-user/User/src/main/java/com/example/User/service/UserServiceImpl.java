package com.example.User.service;

import com.example.User.mode.CartItem;
import com.example.User.mode.FavouriteItem;

import com.example.User.mode.UserProfile;

import com.example.User.repository.UserProfileRepository;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Override
    public UserProfile createUserAccount(UserProfile userProfile) {
        if (userProfileRepository.existsByEmail(userProfile.getEmail())) {
            throw new RuntimeException("User already exists");
        }
        return userProfileRepository.save(userProfile);
    }

    @Override
    public UserProfile getMyProfile(String email) {
        return userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ================= CART =================

    @Override
    public UserProfile addToCart(String email, CartItem newItem) {
        UserProfile user = getMyProfile(email);

        user.getCart().stream()
                .filter(i -> i.getFoodItemId().equals(newItem.getFoodItemId()))
                .findFirst()
                .ifPresentOrElse(
                        existing -> {
                            existing.setQuantity(existing.getQuantity() + newItem.getQuantity());

                            // 🔥 ENSURE SNAPSHOT DATA
                            existing.setPrice(newItem.getPrice());
                            existing.setItemName(newItem.getItemName());
                            existing.setImageUrl(newItem.getImageUrl());

                            existing.setRestaurantId(newItem.getRestaurantId());
                            existing.setRestaurantName(newItem.getRestaurantName());
                            existing.setRestaurantAddress(newItem.getRestaurantAddress());
                            existing.setRestaurantCity(newItem.getRestaurantCity());
                        },
                        () -> user.getCart().add(newItem)
                );

        return userProfileRepository.save(user);
    }



    @Override
    public UserProfile decreaseCartItem(String email, String foodItemId) {
        UserProfile user = getMyProfile(email);

        user.getCart().removeIf(item -> {
            if (item.getFoodItemId().equals(foodItemId)) {
                item.setQuantity(item.getQuantity() - 1);
                return item.getQuantity() <= 0;
            }
            return false;
        });

        return userProfileRepository.save(user);
    }

    @Override
    public UserProfile removeFromCart(String email, String foodItemId) {
        UserProfile user = getMyProfile(email);
        user.getCart().removeIf(i -> i.getFoodItemId().equals(foodItemId));
        return userProfileRepository.save(user);
    }

    // ================= FAVOURITES =================

    @Override
    public UserProfile addFavourite(String email, FavouriteItem item) {
        UserProfile user = getMyProfile(email);

        boolean exists = user.getFavourites().stream()
                .anyMatch(f -> f.getFoodItemId().equals(item.getFoodItemId()));

        if (!exists) {
            user.getFavourites().add(item);
        }

        return userProfileRepository.save(user);
    }

    @Override
    public UserProfile removeFavourite(String email, String foodItemId) {
        UserProfile user = getMyProfile(email);
        user.getFavourites().removeIf(
                f -> f.getFoodItemId().equals(foodItemId)
        );
        return userProfileRepository.save(user);
    }

    @Override
    public boolean isFavourite(String email, String foodItemId) {
        UserProfile user = getMyProfile(email);
        return user.getFavourites().stream()
                .anyMatch(f -> f.getFoodItemId().equals(foodItemId));
    }


    @Override
    public void clearCart(String email) {
        UserProfile user = getMyProfile(email);
        user.getCart().clear();
        userProfileRepository.save(user);
    }

    @Override
    public void addActiveOrder(String email, String orderId) {
        UserProfile user = getMyProfile(email);
        user.getActiveOrders().add(orderId);
        userProfileRepository.save(user);
    }

    @Override
    public void addOrderHistory(String email, String orderId) {
        UserProfile user = getMyProfile(email);

        user.getActiveOrders().remove(orderId);
        user.getOrderHistory().add(orderId);

        userProfileRepository.save(user);
    }

    @Override
    public UserProfile getByEmail(String email) {
        return userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}






