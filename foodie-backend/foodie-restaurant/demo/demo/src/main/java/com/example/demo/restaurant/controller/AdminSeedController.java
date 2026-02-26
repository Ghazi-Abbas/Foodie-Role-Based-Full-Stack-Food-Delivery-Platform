package com.example.demo.restaurant.controller;

import com.example.demo.dto.SeedRestaurantRequest;
import com.example.demo.menu.model.Menu;
import com.example.demo.menu.repository.MenuRepository;
import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.model.RestaurantBankDetails;
import com.example.demo.restaurant.model.RestaurantKycAudit;
import com.example.demo.restaurant.model.RestaurantStatus;
import com.example.demo.restaurant.repository.RestaurantBankRepository;
import com.example.demo.restaurant.repository.RestaurantKycAuditRepository;
import com.example.demo.restaurant.repository.RestaurantRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/restaurant-api/admin")
@RequiredArgsConstructor
public class AdminSeedController {

    private final RestaurantRepository restaurantRepo;
    private final RestaurantBankRepository bankRepo;
    private final RestaurantKycAuditRepository auditRepo;
    private final MenuRepository menuRepo;

//    @PostMapping("/seed")
//    public ResponseEntity<?> seedRestaurant(@RequestBody SeedRestaurantRequest req) {
//
//        // ✅ ADMIN EMAIL FROM JWT (your custom JwtFilter)
//        String adminEmail = SecurityContextHolder
//                .getContext()
//                .getAuthentication()
//                .getName();
//
//        // 🚫 Prevent duplicate
//        if (restaurantRepo.existsByOwnerEmail(req.getOwnerEmail())) {
//            return ResponseEntity.badRequest()
//                    .body("Restaurant already exists for this owner");
//        }
//
//        // ================= RESTAURANT =================
//        Restaurant r = new Restaurant();
//        r.setRestaurantName(req.getRestaurantName());
//        r.setOwnerEmail(req.getOwnerEmail());
//        r.setCity(req.getCity());
//        r.setAddress(req.getAddress());
//        r.setPhone(req.getPhone());
//        r.setPanCard(req.getPanCard());
//        r.setFssaiLicence(req.getFssaiLicence());
//        r.setRestaurantImageUrl(req.getRestaurantImageUrl());
//        r.setOpeningTime(LocalTime.parse(req.getOpeningTime()));
//        r.setClosingTime(LocalTime.parse(req.getClosingTime()));
//        r.setStatus(RestaurantStatus.APPROVED);
//        r.setActive(true);
//
//        Restaurant saved = restaurantRepo.save(r);
//
//        // ================= BANK =================
//        RestaurantBankDetails bank = new RestaurantBankDetails();
//        bank.setRestaurantId(saved.getId());
//        bank.setAccountHolderName(req.getAccountHolderName());
//        bank.setAccountNumber(req.getAccountNumber());
//        bank.setIfscCode(req.getIfscCode());
//        bank.setBranchAddress(req.getBranchAddress());
//        bank.setVerified(true);
//        bankRepo.save(bank);
//
//        // ================= MENU =================
//        Menu menu = new Menu();
//        menu.setRestaurantId(saved.getId());
//        menuRepo.save(menu);
//
//        // ================= KYC AUDIT =================
//        RestaurantKycAudit audit = new RestaurantKycAudit();
//        audit.setRestaurantId(saved.getId());
//        audit.setAction("APPROVED");
//        audit.setAdminEmail(adminEmail);
//        audit.setReason(null);
//        audit.setTimestamp(LocalDateTime.now());
//        auditRepo.save(audit);
//
//        return ResponseEntity.ok("Seeded & Live");
//    }
}
