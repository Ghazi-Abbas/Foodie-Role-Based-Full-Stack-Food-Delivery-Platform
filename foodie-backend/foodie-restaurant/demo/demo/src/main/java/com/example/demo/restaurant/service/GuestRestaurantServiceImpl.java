package com.example.demo.restaurant.service;



import com.example.demo.dto.GuestRestaurantDTO;
import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GuestRestaurantServiceImpl implements GuestRestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Override
    public List<GuestRestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public GuestRestaurantDTO getRestaurantById(String restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    // ================= DTO MAPPER =================

    private GuestRestaurantDTO toDTO(Restaurant r) {
        GuestRestaurantDTO dto = new GuestRestaurantDTO();

        dto.setId(r.getId());
        dto.setName(r.getRestaurantName());
        dto.setImageUrl(r.getRestaurantImageUrl());

        // Location
        dto.setCity(r.getCity());
        dto.setAddress(r.getAddress());

        // Status
        dto.setActive(r.isActive());
        dto.setStatus(r.getStatus().name());

        // Timings
        dto.setOpeningTime(r.getOpeningTime());
        dto.setClosingTime(r.getClosingTime());
        dto.setOpen(isRestaurantOpenNow(r.getOpeningTime(), r.getClosingTime()));

        return dto;
    }

    // ================= BUSINESS LOGIC =================

    private boolean isRestaurantOpenNow(LocalTime open, LocalTime close) {
        if (open == null || close == null) return false;

        LocalTime now = LocalTime.now();

        // Normal same-day timing
        if (open.isBefore(close)) {
            return !now.isBefore(open) && !now.isAfter(close);
        }

        // Overnight timing (e.g. 7 PM – 2 AM)
        return !now.isBefore(open) || !now.isAfter(close);
    }
}
