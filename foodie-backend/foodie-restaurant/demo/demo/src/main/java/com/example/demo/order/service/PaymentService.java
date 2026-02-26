package com.example.demo.order.service;

public interface PaymentService {
    // future: refunds, retries, settlements

    public void verifyPaypal(String orderId, String paypalOrderId);
}
