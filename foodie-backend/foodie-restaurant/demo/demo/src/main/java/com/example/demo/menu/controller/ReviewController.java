package com.example.demo.menu.controller;


import com.example.demo.menu.dto.AddReviewRequest;
import com.example.demo.menu.service.ReviewService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    private static final String JWT_SECRET =
            "foodie-secret-key-foodie-secret-key-foodie";

    @PostMapping("/add")
    public ResponseEntity<?> addReview(
            @RequestBody AddReviewRequest request,
            HttpServletRequest httpRequest
    ) {
        // 🔐 AUTH CHECK (JWT ONLY FOR ACCESS)
        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Unauthorized"));
        }

        String token = authHeader.substring(7);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        // ✅ ONLY TRUST JWT FOR ID
        String userId = claims.getSubject();

        // ✅ ALL OTHER DATA FROM FRONTEND
        reviewService.addOrUpdateReview(
                request,
                userId,
                request.getUserName()   // 👈 FROM FRONTEND
        );

        return ResponseEntity.ok(
                Map.of("message", "Review submitted successfully")
        );
    }

    /* ================= GET REVIEWS FOR RESTAURANT ================= */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getReviewsForRestaurant(
            @PathVariable String restaurantId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsForRestaurant(restaurantId)
        );
    }

}


