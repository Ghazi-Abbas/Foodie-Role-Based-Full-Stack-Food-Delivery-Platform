package com.example.demo.restaurant.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.Objects;

@Document(collection = "restaurants")
public class Restaurant {

    @Id
    private String id;

    private String restaurantName;
    private String ownerEmail;
    private String city;
    private String address;
    private String phone;
    private String panCard;//by ghazi
    private String fssaiLicence; // by ghazi

    private String restaurantImageUrl;   // S3 URL

    private LocalTime openingTime;
    private LocalTime closingTime;
    private RestaurantStatus status;  // by Ghazi
    private boolean active; // admin approval

    public Restaurant() {
    }

    public Restaurant(boolean active, RestaurantStatus status, LocalTime closingTime, LocalTime openingTime, String restaurantImageUrl, String fssaiLicence, String panCard, String phone, String address, String city, String ownerEmail, String restaurantName, String id) {
        this.active = active;
        this.status = status;
        this.closingTime = closingTime;
        this.openingTime = openingTime;
        this.restaurantImageUrl = restaurantImageUrl;
        this.fssaiLicence = fssaiLicence;// by ghzai
        this.panCard = panCard;//by ghazi
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.ownerEmail = ownerEmail;
        this.restaurantName = restaurantName;
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPanCard() {
        return panCard;
    }

    public void setPanCard(String panCard) {
        this.panCard = panCard;
    }

    public String getFssaiLicence() {
        return fssaiLicence;
    }

    public void setFssaiLicence(String fssaiLicence) {
        this.fssaiLicence = fssaiLicence;
    }

    public String getRestaurantImageUrl() {
        return restaurantImageUrl;
    }

    public void setRestaurantImageUrl(String restaurantImageUrl) {
        this.restaurantImageUrl = restaurantImageUrl;
    }

    public LocalTime getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(LocalTime openingTime) {
        this.openingTime = openingTime;
    }

    public LocalTime getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(LocalTime closingTime) {
        this.closingTime = closingTime;
    }

    public RestaurantStatus getStatus() {
        return status;
    }

    public void setStatus(RestaurantStatus status) {
        this.status = status;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "Restaurant{" +
                "id='" + id + '\'' +
                ", restaurantName='" + restaurantName + '\'' +
                ", ownerEmail='" + ownerEmail + '\'' +
                ", city='" + city + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", panCard='" + panCard + '\'' +
                ", fssaiLicence='" + fssaiLicence + '\'' +
                ", restaurantImageUrl='" + restaurantImageUrl + '\'' +
                ", openingTime=" + openingTime +
                ", closingTime=" + closingTime +
                ", status=" + status +
                ", active=" + active +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Restaurant that = (Restaurant) o;
        return active == that.active && Objects.equals(id, that.id) && Objects.equals(restaurantName, that.restaurantName) && Objects.equals(ownerEmail, that.ownerEmail) && Objects.equals(city, that.city) && Objects.equals(address, that.address) && Objects.equals(phone, that.phone) && Objects.equals(panCard, that.panCard) && Objects.equals(fssaiLicence, that.fssaiLicence) && Objects.equals(restaurantImageUrl, that.restaurantImageUrl) && Objects.equals(openingTime, that.openingTime) && Objects.equals(closingTime, that.closingTime) && status == that.status;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, restaurantName, ownerEmail, city, address, phone, panCard, fssaiLicence, restaurantImageUrl, openingTime, closingTime, status, active);
    }
}
