package com.example.demo.restaurant.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor   // 👈 creates the 6-arg constructor
@NoArgsConstructor    // 👈 keeps default constructor
@Document(collection = "restaurant_kyc_audit")
public class RestaurantKycAudit {

    @Id
    private String id;

    private String restaurantId;

    private String action;   // APPROVED / REJECTED

    private String adminEmail;

    private String reason;   // null for approve

    private LocalDateTime timestamp;




}
