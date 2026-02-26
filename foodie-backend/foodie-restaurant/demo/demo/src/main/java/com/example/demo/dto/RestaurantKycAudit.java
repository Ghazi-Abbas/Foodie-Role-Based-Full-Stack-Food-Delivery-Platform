package com.example.demo.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class RestaurantKycAudit {


    @Id
    @GeneratedValue
    private Long id;

    private String restaurantId;
    private String action; // APPROVED, REJECTED, RESUBMITTED
    private String adminEmail;
    private String reason;
    private LocalDateTime time;

    public RestaurantKycAudit(Object o, String id, String rejected, String adminEmail, String reason, LocalDateTime now) {
    }
}

