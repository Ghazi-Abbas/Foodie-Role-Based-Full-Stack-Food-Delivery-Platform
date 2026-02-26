package com.example.demo.order.dto;

import lombok.Data;

@Data
public class PlaceOrderRequest {
    private String paypalOrderId;
    private double amount;
}
