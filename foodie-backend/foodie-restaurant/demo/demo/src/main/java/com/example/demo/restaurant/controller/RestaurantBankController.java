package com.example.demo.restaurant.controller;

import com.example.demo.dto.KycReasonRequest;
import com.example.demo.dto.RestaurantKycAudit;
import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.model.RestaurantBankDetails;
import com.example.demo.restaurant.model.RestaurantStatus;
import com.example.demo.restaurant.service.RestaurantBankService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;

@RestController
@RequestMapping("/restaurant-api/bank")
//@CrossOrigin("*")
@AllArgsConstructor
public class RestaurantBankController {

    private final RestaurantBankService bankService;

    // ======================================================
    // METHOD: POST
    // URL: http://localhost:9090/restaurant-api/bank/add
    // PURPOSE: Add bank details for a restaurant
    // ======================================================
    @PostMapping("/add")
    public ResponseEntity<RestaurantBankDetails> addBankDetails(
            @RequestBody RestaurantBankDetails bankDetails) {

        RestaurantBankDetails saved =
                bankService.addBankDetails(bankDetails);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // ======================================================
    // METHOD: GET
    // URL: http://localhost:9090/restaurant-api/bank/{restaurantId}
    // PURPOSE: Get bank details using restaurantId
    // ======================================================
    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantBankDetails> getBankDetails(
            @PathVariable String restaurantId) {

        RestaurantBankDetails details =
                bankService.getBankDetailsByRestaurantId(restaurantId);

        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    // ======================================================
    // METHOD: PUT
    // URL: http://localhost:9090/restaurant-api/bank/update
    // PURPOSE: Update existing bank details
    // ======================================================
//    @PutMapping("/update")
//    public ResponseEntity<RestaurantBankDetails> updateBankDetails(
//            @RequestBody RestaurantBankDetails bankDetails) {
//
//        RestaurantBankDetails updated =
//                bankService.updateBankDetails(bankDetails);
//
//        return new ResponseEntity<>(updated, HttpStatus.OK);
//    }

    @PutMapping("/restaurants/{id}/bank")
    public ResponseEntity<?> updateBank(
            @PathVariable String id,
            @RequestBody RestaurantBankDetails bankDetails,
            Principal principal
    ) {
        try {
            bankDetails.setRestaurantId(id);
            RestaurantBankDetails updated =
                    bankService.updateBankDetails(bankDetails, principal.getName());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
