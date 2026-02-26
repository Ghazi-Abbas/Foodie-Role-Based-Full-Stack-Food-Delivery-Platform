package com.example.demo.menu.service;

import com.example.demo.menu.dto.GuestMenuItemDTO;
import com.example.demo.menu.dto.GuestRestaurantMenuDTO;
import com.example.demo.menu.dto.ItemDetailsResponse;

import java.util.List;

public interface GuestMenuService {

    GuestRestaurantMenuDTO getFullMenu(String restaurantId);

    List<GuestMenuItemDTO> getRecommendedItems(String restaurantId);

    List<GuestMenuItemDTO> getTopRatedItems(String restaurantId);

    List<GuestMenuItemDTO> getItemsByCategory(String restaurantId, String category);

    List<GuestMenuItemDTO> getBudgetItems(String restaurantId, double maxPrice);

    List<GuestMenuItemDTO> searchItems(String restaurantId, String query);
    GuestMenuItemDTO getItemDetails(String itemId);
    List<GuestMenuItemDTO> getItemsPaginated(
            String restaurantId,
            int page,
            int size,
            String category,
            Boolean veg,
            String sort,
            String order
    );


    // 🔥 Discovery APIs
    List<GuestMenuItemDTO> getItemsByCategoryAcrossRestaurants(String category);

    List<GuestMenuItemDTO> getVegItemsAcrossRestaurants();

    List<GuestMenuItemDTO> getNonVegItemsAcrossRestaurants();
    ItemDetailsResponse getItemDetailsWithReviews(
            String restaurantId,
            String itemId
    );


}
