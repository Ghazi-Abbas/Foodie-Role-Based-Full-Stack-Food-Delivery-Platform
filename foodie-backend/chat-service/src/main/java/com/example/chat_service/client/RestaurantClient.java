package com.example.chat_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@FeignClient(
        name = "restaurant-service",
        url = "http://localhost:9092"
)
public interface RestaurantClient {

    // ================= VEG ITEMS =================
    // GET http://localhost:9091/api/guest/restaurants/menu/veg
    @GetMapping("/api/guest/restaurants/menu/veg")
    List<Map<String, Object>> getVegItems();

    // ================= NON-VEG ITEMS =================
    // GET http://localhost:9091/api/guest/restaurants/menu/non-veg
    @GetMapping("/api/guest/restaurants/menu/non-veg")
    List<Map<String, Object>> getNonVegItems();

    // ================= SNACKS =================
    // GET http://localhost:9091/api/guest/restaurants/menu/snacks
    @GetMapping("/api/guest/restaurants/menu/snacks")
    List<Map<String, Object>> getSnacks();

    // ✅ ADD THESE TWO
    @GetMapping("/api/guest/restaurants/menu/beverages")
    List<Map<String, Object>> getBeverages();

    @GetMapping("/api/guest/restaurants/menu/desserts")
    List<Map<String, Object>> getDesserts();
}
