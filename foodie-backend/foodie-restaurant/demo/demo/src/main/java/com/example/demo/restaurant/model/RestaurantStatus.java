package com.example.demo.restaurant.model;
// By Ghazi
public enum RestaurantStatus {
    PENDING,               // Applied, waiting for admin
    ON_HOLD,               // Needs correction
    APPROVED,              // KYC approved
    SUSPENDED,             // Temporarily blocked
    REJECTED,              // Failed but can reapply
    PERMANENTLY_BLOCKED    // Banned forever ❌
}
