package com.example.demo.menu.controller;

import com.example.demo.menu.dto.ItemDetailsResponse;

import com.example.demo.menu.service.GuestMenuService;
import com.example.demo.menu.service.OpenAiFoodService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/guest/restaurants")
@RequiredArgsConstructor
@PermitAll // ✅ Explicitly mark this controller as PUBLIC
public class GuestMenuController {

    private final GuestMenuService service;

    private final OpenAiFoodService openAiFoodService;



    // =====================================================
    // 1️⃣ FULL MENU (Restaurant Page)
    // GET /api/guest/restaurants/{id}/menu
    // =====================================================
    @GetMapping("/{id}/menu")
    public ResponseEntity<?> getFullMenu(@PathVariable String id) {
        return ResponseEntity.ok(service.getFullMenu(id));
    }

    // =====================================================
    // 2️⃣ RECOMMENDED ITEMS
    // =====================================================
    @GetMapping("/{id}/menu/recommended")
    public ResponseEntity<?> getRecommendedItems(@PathVariable String id) {
        return ResponseEntity.ok(service.getRecommendedItems(id));
    }

    // =====================================================
    // 3️⃣ TOP RATED ITEMS
    // =====================================================
    @GetMapping("/{id}/menu/top-rated")
    public ResponseEntity<?> getTopRatedItems(@PathVariable String id) {
        return ResponseEntity.ok(service.getTopRatedItems(id));
    }

    // =====================================================
    // 4️⃣ CATEGORY WISE ITEMS
    // =====================================================
    @GetMapping("/{id}/menu/category/{category}")
    public ResponseEntity<?> getItemsByCategory(
            @PathVariable String id,
            @PathVariable String category
    ) {
        return ResponseEntity.ok(service.getItemsByCategory(id, category));
    }

    // =====================================================
    // 5️⃣ BUDGET ITEMS
    // =====================================================
    @GetMapping("/{id}/menu/under/{price}")
    public ResponseEntity<?> getBudgetItems(
            @PathVariable String id,
            @PathVariable double price
    ) {
        return ResponseEntity.ok(service.getBudgetItems(id, price));
    }

    // =====================================================
    // 6️⃣ SEARCH ITEMS
    // =====================================================
    @GetMapping("/{id}/menu/search")
    public ResponseEntity<?> searchItems(
            @PathVariable String id,
            @RequestParam String q
    ) {
        return ResponseEntity.ok(service.searchItems(id, q));
    }

    // =====================================================
    // 7️⃣ PAGINATION
    // =====================================================
    @GetMapping("/{id}/menu/page")
    public ResponseEntity<?> getPaginatedMenu(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean veg,
            @RequestParam(defaultValue = "rating") String sort,
            @RequestParam(defaultValue = "desc") String order
    ) {
        return ResponseEntity.ok(
                service.getItemsPaginated(
                        id,
                        page,
                        size,
                        category,
                        veg,
                        sort,
                        order
                )
        );
    }

    // =====================================================
// 🔥 DISCOVERY SECTIONS (ACROSS ALL RESTAURANTS)
// =====================================================

    @GetMapping("/menu/snacks")
    public ResponseEntity<?> getSnacks() {
        return ResponseEntity.ok(
                service.getItemsByCategoryAcrossRestaurants("SNACKS")
        );
    }

    @GetMapping("/menu/veg")
    public ResponseEntity<?> getVegItems() {
        return ResponseEntity.ok(
                service.getVegItemsAcrossRestaurants()
        );
    }

    @GetMapping("/menu/non-veg")
    public ResponseEntity<?> getNonVegItems() {
        return ResponseEntity.ok(
                service.getNonVegItemsAcrossRestaurants()
        );
    }

    @GetMapping("/menu/beverages")
    public ResponseEntity<?> getBeverages() {
        return ResponseEntity.ok(
                service.getItemsByCategoryAcrossRestaurants("BEVERAGES")
        );
    }

    @GetMapping("/menu/desserts")
    public ResponseEntity<?> getDesserts() {
        return ResponseEntity.ok(
                service.getItemsByCategoryAcrossRestaurants("DESSERTS")
        );
    }

    @GetMapping("/{restaurantId}/menu/item/{itemId}")
    public ResponseEntity<ItemDetailsResponse> getItemDetails(
            @PathVariable String restaurantId,
            @PathVariable String itemId
    ) {
        return ResponseEntity.ok(
                service.getItemDetailsWithReviews(restaurantId, itemId)
        );
    }

    // ---------------- AI FOOD INFO ----------------
    // ---------------- AI FOOD INFO ----------------
    @GetMapping("/{restaurantId}/menu/item/{itemId}/ai-info")
    public ResponseEntity<?> getAiFoodInfo(
            @PathVariable String restaurantId,
            @PathVariable String itemId
    ) {
        ItemDetailsResponse details =
                service.getItemDetailsWithReviews(restaurantId, itemId);

        String aiInfo =
                openAiFoodService.getFoodInsights(
                        details.getItem().getItemName()
                );

        return ResponseEntity.ok(
                Map.of("aiInfo", aiInfo)
        );
    }





}
