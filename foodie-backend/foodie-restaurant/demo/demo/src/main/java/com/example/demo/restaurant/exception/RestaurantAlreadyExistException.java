package com.example.demo.restaurant.exception;

public class RestaurantAlreadyExistException extends Exception {
    public RestaurantAlreadyExistException(String message) {
        super(message);
    }
}
