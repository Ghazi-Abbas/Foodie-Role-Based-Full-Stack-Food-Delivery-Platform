package com.example.demo.dto;



import lombok.Data;

import java.time.LocalTime;

@Data
public class GuestRestaurantDTO {

    private String id;
    private String name;
    private String imageUrl;

    // Location
    private String city;
    private String address;

    // Status
    private boolean active;
    private String status; // RestaurantStatus as String

    // Timings
    private LocalTime openingTime;
    private LocalTime closingTime;
    private boolean open; // calculated (OPEN / CLOSED)
}

