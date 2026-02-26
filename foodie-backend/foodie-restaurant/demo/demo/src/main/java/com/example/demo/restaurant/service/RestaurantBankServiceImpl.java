package com.example.demo.restaurant.service;

import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.restaurant.model.RestaurantBankDetails;
import com.example.demo.restaurant.model.RestaurantStatus;
import com.example.demo.restaurant.repository.RestaurantBankRepository;
import com.example.demo.restaurant.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class RestaurantBankServiceImpl implements RestaurantBankService {

    private final RestaurantBankRepository bankRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    public RestaurantBankDetails addBankDetails(RestaurantBankDetails bankDetails) {

        // 🔐 Block fake / repeated submissions
        if (bankRepository.existsByRestaurantId(bankDetails.getRestaurantId())) {
            throw new IllegalStateException(
                    "Bank details already submitted for this restaurant"
            );
        }

        // 🔥 Validate mandatory fields
        if (bankDetails.getAccountHolderName() == null ||
                bankDetails.getAccountNumber() == null ||
                bankDetails.getIfscCode() == null) {

            throw new IllegalArgumentException("Incomplete bank details");
        }

        // 🕒 Lock record to avoid race condition
        bankDetails.setVerified(false);
        bankDetails.setCreatedAt(LocalDateTime.now());

        return bankRepository.save(bankDetails);
    }

    @Override
    public RestaurantBankDetails getBankDetailsByRestaurantId(String restaurantId) {

        return bankRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new RuntimeException("Bank details not found"));
    }

//    @Override
//    public RestaurantBankDetails updateBankDetails(RestaurantBankDetails bankDetails) {
//
//        RestaurantBankDetails existing =
//                bankRepository.findByRestaurantId(bankDetails.getRestaurantId())
//                        .orElseThrow(() -> new RuntimeException("Bank details not found"));
//
//        existing.setAccountHolderName(bankDetails.getAccountHolderName());
//        existing.setAccountNumber(bankDetails.getAccountNumber());
//        existing.setIfscCode(bankDetails.getIfscCode());
//        existing.setBranchAddress(bankDetails.getBranchAddress());
//
//        return bankRepository.save(existing);
//    }

    @Override
    public RestaurantBankDetails updateBankDetails(RestaurantBankDetails bank, String userEmail) {

        Restaurant restaurant = restaurantRepository
                .findById(bank.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // 🔐 OWNER CHECK
        if (!restaurant.getOwnerEmail().equals(userEmail))
            throw new RuntimeException("You are not the owner");

        // 🔒 BANK CAN ONLY BE UPDATED BEFORE APPROVAL
        if (restaurant.getStatus() == RestaurantStatus.APPROVED ||
                restaurant.getStatus() == RestaurantStatus.SUSPENDED ||
                restaurant.getStatus() == RestaurantStatus.PERMANENTLY_BLOCKED)
            throw new RuntimeException("Bank details cannot be modified after approval");

        RestaurantBankDetails existing =
                bankRepository.findByRestaurantId(bank.getRestaurantId())
                        .orElseThrow(() -> new RuntimeException("Bank details not found"));

        existing.setAccountHolderName(bank.getAccountHolderName());
        existing.setAccountNumber(bank.getAccountNumber());
        existing.setIfscCode(bank.getIfscCode());
        existing.setBranchAddress(bank.getBranchAddress());

        return bankRepository.save(existing);
    }




}
