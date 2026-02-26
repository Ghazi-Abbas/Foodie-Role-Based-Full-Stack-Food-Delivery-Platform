package com.example.demo.restaurant.controller;



import com.example.demo.restaurant.service.GuestRestaurantService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guest/restaurants")
@RequiredArgsConstructor
@PermitAll
public class GuestRestaurantController {

    private final GuestRestaurantService service;

    // =====================================================
    // 1️⃣ LIST ALL RESTAURANTS (FOR HOME / DINING OUT)
    // GET /api/guest/restaurants
    // =====================================================
    @GetMapping
    public ResponseEntity<?> getAllRestaurants() {
        return ResponseEntity.ok(service.getAllRestaurants());
    }

    // =====================================================
    // 2️⃣ SINGLE RESTAURANT DETAILS
    // GET /api/guest/restaurants/{id}
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {
        return ResponseEntity.ok(service.getRestaurantById(id));
    }
}
