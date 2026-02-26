package com.example.demo.restaurant.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.Objects;

@Document(collection = "restaurant_bank_details")
public class RestaurantBankDetails {

    @Id
    private String id;

    private String restaurantId;   // FK reference
    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;
    private String branchAddress;
    // 🔐 KYC fields
    private Boolean verified;
    private LocalDateTime createdAt;

    public RestaurantBankDetails() {
    }

    public RestaurantBankDetails(String id, String restaurantId, String accountHolderName, String accountNumber, String ifscCode, String branchAddress) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.accountHolderName = accountHolderName;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.branchAddress = branchAddress;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getBranchAddress() {
        return branchAddress;
    }

    public void setBranchAddress(String branchAddress) {
        this.branchAddress = branchAddress;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        RestaurantBankDetails that = (RestaurantBankDetails) o;
        return Objects.equals(id, that.id) && Objects.equals(restaurantId, that.restaurantId) && Objects.equals(accountHolderName, that.accountHolderName) && Objects.equals(accountNumber, that.accountNumber) && Objects.equals(ifscCode, that.ifscCode) && Objects.equals(branchAddress, that.branchAddress);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, restaurantId, accountHolderName, accountNumber, ifscCode, branchAddress);
    }

    @Override
    public String toString() {
        return "RestaurantBankDetails{" +
                "id='" + id + '\'' +
                ", restaurantId='" + restaurantId + '\'' +
                ", accountHolderName='" + accountHolderName + '\'' +
                ", accountNumber='" + accountNumber + '\'' +
                ", ifscCode='" + ifscCode + '\'' +
                ", branchAddress='" + branchAddress + '\'' +
                '}';
    }
}

