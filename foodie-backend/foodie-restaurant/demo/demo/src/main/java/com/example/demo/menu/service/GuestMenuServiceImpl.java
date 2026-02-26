//package com.example.demo.menu.service;
//
//import com.example.demo.menu.dto.GuestMenuCategoryDTO;
//import com.example.demo.menu.dto.GuestMenuItemDTO;
//import com.example.demo.menu.dto.GuestRestaurantMenuDTO;
//import com.example.demo.menu.model.Menu;
//import com.example.demo.menu.model.MenuCategory;
//import com.example.demo.menu.model.MenuItem;
//import com.example.demo.menu.model.MenuItemReview;
//import com.example.demo.menu.repository.MenuItemReviewRepository;
//import com.example.demo.menu.repository.MenuRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class GuestMenuServiceImpl implements GuestMenuService {
//
//    private final MenuRepository menuRepository;
//    private final MenuItemReviewRepository reviewRepository;
//
//    // ================= FULL MENU =================
//    @Override
//    public GuestRestaurantMenuDTO getFullMenu(String restaurantId) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new RuntimeException("Menu not found"));
//
//        Map<String, List<MenuItemReview>> reviewMap = fetchReviews(menu);
//
//        List<GuestMenuCategoryDTO> categories = new ArrayList<>();
//
//        for (MenuCategory category : menu.getCategories()) {
//
//            List<GuestMenuItemDTO> items = category.getItems().stream()
//                    .map(item -> toDTO(
//                            item,
//                            category.getCategoryType().name(),
//                            reviewMap.get(item.getItemId())
//                    ))
//                    .toList();
//
//            GuestMenuCategoryDTO catDTO = new GuestMenuCategoryDTO();
//            catDTO.setCategory(category.getCategoryType().name());
//            catDTO.setItems(items);
//
//            categories.add(catDTO);
//        }
//
//        GuestRestaurantMenuDTO dto = new GuestRestaurantMenuDTO();
//        dto.setRestaurantId(restaurantId);
//        dto.setCategories(categories);
//        return dto;
//    }
//
//    // ================= RECOMMENDED =================
//    @Override
//    public List<GuestMenuItemDTO> getRecommendedItems(String restaurantId) {
//        return flattenItems(restaurantId).stream()
//                .sorted((a, b) -> Double.compare(score(b), score(a)))
//                .limit(10)
//                .toList();
//    }
//
//    // ================= TOP RATED =================
//    @Override
//    public List<GuestMenuItemDTO> getTopRatedItems(String restaurantId) {
//        return flattenItems(restaurantId).stream()
//                .filter(i -> i.getAverageRating() >= 4.2 && i.getTotalRatings() >= 5)
//                .sorted(Comparator.comparingDouble(GuestMenuItemDTO::getAverageRating).reversed())
//                .limit(10)
//                .toList();
//    }
//
//    // ================= CATEGORY =================
//    @Override
//    public List<GuestMenuItemDTO> getItemsByCategory(String restaurantId, String category) {
//        return flattenItems(restaurantId).stream()
//                .filter(i -> i.getCategory().equalsIgnoreCase(category))
//                .toList();
//    }
//
//    // ================= BUDGET =================
//    @Override
//    public List<GuestMenuItemDTO> getBudgetItems(String restaurantId, double maxPrice) {
//        return flattenItems(restaurantId).stream()
//                .filter(i -> i.getPrice() <= maxPrice)
//                .sorted(Comparator.comparingDouble(GuestMenuItemDTO::getPrice))
//                .toList();
//    }
//
//    // ================= SEARCH =================
//    @Override
//    public List<GuestMenuItemDTO> searchItems(String restaurantId, String query) {
//        return flattenItems(restaurantId).stream()
//                .filter(i -> i.getName().toLowerCase().contains(query.toLowerCase()))
//                .toList();
//    }
//
//    // ================= ITEM DETAILS =================
//    @Override
//    public GuestMenuItemDTO getItemDetails(String itemId) {
//
//        List<MenuItemReview> reviews = reviewRepository.findByItemId(itemId);
//
//        if (reviews.isEmpty()) {
//            throw new RuntimeException("Item not found");
//        }
//
//        double avg = reviews.stream()
//                .mapToInt(MenuItemReview::getRating)
//                .average()
//                .orElse(0);
//
//        GuestMenuItemDTO dto = new GuestMenuItemDTO();
//        dto.setItemId(itemId);
//        dto.setAverageRating(avg);
//        dto.setTotalRatings(reviews.size());
//
//        return dto;
//    }
//
//    // ================= PAGINATION / INFINITE SCROLL =================
//    @Override
//    public List<GuestMenuItemDTO> getItemsPaginated(
//            String restaurantId,
//            int page,
//            int size,
//            String category,
//            Boolean veg,
//            String sort,
//            String order
//    ) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow();
//
//        Map<String, List<MenuItemReview>> reviewMap = fetchReviews(menu);
//
//        List<GuestMenuItemDTO> allItems = new ArrayList<>();
//
//        // 1️⃣ Filter + Flatten
//        for (MenuCategory c : menu.getCategories()) {
//            for (MenuItem i : c.getItems()) {
//
//                if (category != null &&
//                        !c.getCategoryType().name().equalsIgnoreCase(category))
//                    continue;
//
//                if (veg != null && i.isVeg() != veg)
//                    continue;
//
//                allItems.add(
//                        toDTO(
//                                i,
//                                c.getCategoryType().name(),
//                                reviewMap.get(i.getItemId())
//                        )
//                );
//            }
//        }
//
//        // 2️⃣ Sorting
//        if ("price".equalsIgnoreCase(sort)) {
//            allItems.sort(order.equalsIgnoreCase("desc")
//                    ? Comparator.comparingDouble(GuestMenuItemDTO::getPrice).reversed()
//                    : Comparator.comparingDouble(GuestMenuItemDTO::getPrice));
//        }
//
//        if ("rating".equalsIgnoreCase(sort)) {
//            allItems.sort(order.equalsIgnoreCase("desc")
//                    ? Comparator.comparingDouble(GuestMenuItemDTO::getAverageRating).reversed()
//                    : Comparator.comparingDouble(GuestMenuItemDTO::getAverageRating));
//        }
//
//        // 3️⃣ Pagination
//        int from = page * size;
//        int to = Math.min(from + size, allItems.size());
//
//        if (from >= allItems.size()) return List.of();
//
//        return allItems.subList(from, to);
//    }
//
//    // ================= HELPERS =================
//
//    private List<GuestMenuItemDTO> flattenItems(String restaurantId) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow();
//
//        Map<String, List<MenuItemReview>> reviewMap = fetchReviews(menu);
//
//        List<GuestMenuItemDTO> items = new ArrayList<>();
//
//        for (MenuCategory c : menu.getCategories()) {
//            for (MenuItem i : c.getItems()) {
//                items.add(
//                        toDTO(
//                                i,
//                                c.getCategoryType().name(),
//                                reviewMap.get(i.getItemId())
//                        )
//                );
//            }
//        }
//        return items;
//    }
//
//    private Map<String, List<MenuItemReview>> fetchReviews(Menu menu) {
//
//        List<String> itemIds = menu.getCategories().stream()
//                .flatMap(c -> c.getItems().stream())
//                .map(MenuItem::getItemId)
//                .toList();
//
//        if (itemIds.isEmpty()) return Map.of();
//
//        return reviewRepository.findByItemIdIn(itemIds)
//                .stream()
//                .collect(Collectors.groupingBy(MenuItemReview::getItemId));
//    }
//
//    private GuestMenuItemDTO toDTO(
//            MenuItem item,
//            String category,
//            List<MenuItemReview> reviews
//    ) {
//
//        double avg = (reviews == null || reviews.isEmpty())
//                ? 0
//                : reviews.stream()
//                .mapToInt(MenuItemReview::getRating)
//                .average()
//                .orElse(0);
//
//        GuestMenuItemDTO dto = new GuestMenuItemDTO();
//        dto.setItemId(item.getItemId());
//        dto.setName(item.getItemName());
//        dto.setPrice(item.getPrice());
//        dto.setVeg(item.isVeg());
//        dto.setCategory(category);
//        dto.setImageUrl(item.getImageUrl());
//        dto.setAverageRating(avg);
//        dto.setTotalRatings(reviews == null ? 0 : reviews.size());
//
//        return dto;
//    }
//
//    private double score(GuestMenuItemDTO i) {
//        return (i.getAverageRating() * 2) + Math.log(i.getTotalRatings() + 1);
//    }
//}
package com.example.demo.menu.service;

import com.example.demo.menu.dto.GuestMenuCategoryDTO;
import com.example.demo.menu.dto.GuestMenuItemDTO;
import com.example.demo.menu.dto.GuestRestaurantMenuDTO;
import com.example.demo.menu.dto.ItemDetailsResponse;
import com.example.demo.menu.model.Menu;
import com.example.demo.menu.model.MenuCategory;
import com.example.demo.menu.model.MenuItem;
import com.example.demo.menu.model.MenuItemReview;
import com.example.demo.menu.repository.MenuItemRepository;
import com.example.demo.menu.repository.MenuItemReviewRepository;
import com.example.demo.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestMenuServiceImpl implements GuestMenuService {

    private final MenuRepository menuRepository;
    private final MenuItemReviewRepository reviewRepository;


    // ================= FULL MENU =================
    @Override
    public GuestRestaurantMenuDTO getFullMenu(String restaurantId) {

        Optional<Menu> optionalMenu = menuRepository.findByRestaurantId(restaurantId);

        // ✅ FIX: If menu not found, return EMPTY menu instead of crashing
        if (optionalMenu.isEmpty()) {
            GuestRestaurantMenuDTO empty = new GuestRestaurantMenuDTO();
            empty.setRestaurantId(restaurantId);
            empty.setCategories(List.of());
            return empty;
        }

        Menu menu = optionalMenu.get();

        Map<String, List<MenuItemReview>> reviewMap = fetchReviews(menu);

        List<GuestMenuCategoryDTO> categories = new ArrayList<>();

        for (MenuCategory category : menu.getCategories()) {

            List<GuestMenuItemDTO> items = category.getItems().stream()
                    .map(item -> toDTO(
                            item,
                            category.getCategoryType().name(),
                            reviewMap.get(item.getItemId())
                    ))
                    .toList();

            GuestMenuCategoryDTO catDTO = new GuestMenuCategoryDTO();
            catDTO.setCategory(category.getCategoryType().name());
            catDTO.setItems(items);

            categories.add(catDTO);
        }

        GuestRestaurantMenuDTO dto = new GuestRestaurantMenuDTO();
        dto.setRestaurantId(restaurantId);
        dto.setCategories(categories);
        return dto;
    }

    // ================= RECOMMENDED =================
    @Override
    public List<GuestMenuItemDTO> getRecommendedItems(String restaurantId) {
        return flattenItems(restaurantId).stream()
                .sorted((a, b) -> Double.compare(score(b), score(a)))
                .limit(10)
                .toList();
    }

    // ================= TOP RATED =================
    @Override
    public List<GuestMenuItemDTO> getTopRatedItems(String restaurantId) {
        return flattenItems(restaurantId).stream()
                .filter(i -> i.getAverageRating() >= 4.2 && i.getTotalRatings() >= 5)
                .sorted(Comparator.comparingDouble(GuestMenuItemDTO::getAverageRating).reversed())
                .limit(10)
                .toList();
    }

    // ================= CATEGORY =================
    @Override
    public List<GuestMenuItemDTO> getItemsByCategory(String restaurantId, String category) {
        return flattenItems(restaurantId).stream()
                .filter(i -> i.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    // ================= BUDGET =================
    @Override
    public List<GuestMenuItemDTO> getBudgetItems(String restaurantId, double maxPrice) {
        return flattenItems(restaurantId).stream()
                .filter(i -> i.getPrice() <= maxPrice)
                .sorted(Comparator.comparingDouble(GuestMenuItemDTO::getPrice))
                .toList();
    }

    // ================= SEARCH =================
    @Override
    public List<GuestMenuItemDTO> searchItems(String restaurantId, String query) {
        return flattenItems(restaurantId).stream()
                .filter(i -> i.getName().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }

    // ================= ITEM DETAILS =================
    @Override
    public GuestMenuItemDTO getItemDetails(String itemId) {

        List<MenuItemReview> reviews = reviewRepository.findByItemId(itemId);

        if (reviews.isEmpty()) {
            return null; // ✅ FIX: avoid runtime exception for guest
        }

        double avg = reviews.stream()
                .mapToInt(MenuItemReview::getRating)
                .average()
                .orElse(0);

        GuestMenuItemDTO dto = new GuestMenuItemDTO();
        dto.setItemId(itemId);
        dto.setAverageRating(avg);
        dto.setTotalRatings(reviews.size());

        return dto;
    }

    // ================= PAGINATION =================
    @Override
    public List<GuestMenuItemDTO> getItemsPaginated(
            String restaurantId,
            int page,
            int size,
            String category,
            Boolean veg,
            String sort,
            String order
    ) {

        Optional<Menu> optionalMenu = menuRepository.findByRestaurantId(restaurantId);
        if (optionalMenu.isEmpty()) return List.of(); // ✅ FIX

        Menu menu = optionalMenu.get();
        Map<String, List<MenuItemReview>> reviewMap = fetchReviews(menu);

        List<GuestMenuItemDTO> allItems = new ArrayList<>();

        for (MenuCategory c : menu.getCategories()) {
            for (MenuItem i : c.getItems()) {

                if (category != null &&
                        !c.getCategoryType().name().equalsIgnoreCase(category))
                    continue;

                if (veg != null && i.isVeg() != veg)
                    continue;

                allItems.add(
                        toDTO(
                                i,
                                c.getCategoryType().name(),
                                reviewMap.get(i.getItemId())
                        )
                );
            }
        }

        if ("price".equalsIgnoreCase(sort)) {
            allItems.sort(order.equalsIgnoreCase("desc")
                    ? Comparator.comparingDouble(GuestMenuItemDTO::getPrice).reversed()
                    : Comparator.comparingDouble(GuestMenuItemDTO::getPrice));
        }

        if ("rating".equalsIgnoreCase(sort)) {
            allItems.sort(order.equalsIgnoreCase("desc")
                    ? Comparator.comparingDouble(GuestMenuItemDTO::getAverageRating).reversed()
                    : Comparator.comparingDouble(GuestMenuItemDTO::getAverageRating));
        }

        int from = page * size;
        int to = Math.min(from + size, allItems.size());

        if (from >= allItems.size()) return List.of();
        return allItems.subList(from, to);
    }

    // ================= HELPERS =================

    private List<GuestMenuItemDTO> flattenItems(String restaurantId) {

        Optional<Menu> optionalMenu = menuRepository.findByRestaurantId(restaurantId);
        if (optionalMenu.isEmpty()) return List.of(); // ✅ FIX

        Menu menu = optionalMenu.get();
        Map<String, List<MenuItemReview>> reviewMap = fetchReviews(menu);

        List<GuestMenuItemDTO> items = new ArrayList<>();

        for (MenuCategory c : menu.getCategories()) {
            for (MenuItem i : c.getItems()) {
                items.add(
                        toDTO(
                                i,
                                c.getCategoryType().name(),
                                reviewMap.get(i.getItemId())
                        )
                );
            }
        }
        return items;
    }

    private Map<String, List<MenuItemReview>> fetchReviews(Menu menu) {

        List<String> itemIds = menu.getCategories().stream()
                .flatMap(c -> c.getItems().stream())
                .map(MenuItem::getItemId)
                .toList();

        if (itemIds.isEmpty()) return Map.of();

        return reviewRepository.findByItemIdIn(itemIds)
                .stream()
                .collect(Collectors.groupingBy(MenuItemReview::getItemId));
    }

    private GuestMenuItemDTO toDTO(
            MenuItem item,
            String category,
            List<MenuItemReview> reviews
    ) {

        double avg = (reviews == null || reviews.isEmpty())
                ? 0
                : reviews.stream()
                .mapToInt(MenuItemReview::getRating)
                .average()
                .orElse(0);

        GuestMenuItemDTO dto = new GuestMenuItemDTO();
        dto.setItemId(item.getItemId());
        dto.setName(item.getItemName());
        dto.setPrice(item.getPrice());
        dto.setVeg(item.isVeg());
        dto.setCategory(category);
        dto.setImageUrl(item.getImageUrl());
        dto.setAverageRating(avg);
        dto.setTotalRatings(reviews == null ? 0 : reviews.size());

        return dto;
    }

    private double score(GuestMenuItemDTO i) {
        return (i.getAverageRating() * 2) + Math.log(i.getTotalRatings() + 1);
    }

    @Override
    public List<GuestMenuItemDTO> getItemsByCategoryAcrossRestaurants(String category) {

        return menuRepository.findAll()
                .stream()
                .flatMap(menu -> menu.getCategories().stream())
                .filter(cat ->
                        cat.getCategoryType().name().equalsIgnoreCase(category)
                )
                .flatMap(cat -> cat.getItems().stream())
                .map(item -> toDTO(item, category, List.of()))
                .limit(20) // 🔥 important: limit for performance
                .toList();
    }

    @Override
    public List<GuestMenuItemDTO> getVegItemsAcrossRestaurants() {

        return menuRepository.findAll()
                .stream()
                .flatMap(menu -> menu.getCategories().stream())
                .flatMap(cat -> cat.getItems().stream())
                .filter(MenuItem::isVeg)
                .map(item -> toDTO(item, "VEG", List.of()))
                .limit(20)
                .toList();
    }

    @Override
    public List<GuestMenuItemDTO> getNonVegItemsAcrossRestaurants() {

        return menuRepository.findAll()
                .stream()
                .flatMap(menu -> menu.getCategories().stream())
                .flatMap(cat -> cat.getItems().stream())
                .filter(item -> !item.isVeg())
                .map(item -> toDTO(item, "NON_VEG", List.of()))
                .limit(20)
                .toList();
    }
    @Override
    public ItemDetailsResponse getItemDetailsWithReviews(
            String restaurantId,
            String itemId
    ) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() ->
                        new RuntimeException("Menu not found for restaurant"));

        MenuItem foundItem = null;

        for (MenuCategory category : menu.getCategories()) {
            for (MenuItem item : category.getItems()) {
                if (item.getItemId().equals(itemId)) {
                    foundItem = item;
                    break;
                }
            }
        }

        if (foundItem == null) {
            throw new RuntimeException("Item not found for this restaurant");
        }

        List<MenuItemReview> reviews =
                reviewRepository.findByItemId(itemId);

        double avgRating = reviews.stream()
                .mapToInt(MenuItemReview::getRating)
                .average()
                .orElse(0.0);

        return new ItemDetailsResponse(
                foundItem,
                avgRating,
                reviews.size(),
                reviews
        );
    }





}


