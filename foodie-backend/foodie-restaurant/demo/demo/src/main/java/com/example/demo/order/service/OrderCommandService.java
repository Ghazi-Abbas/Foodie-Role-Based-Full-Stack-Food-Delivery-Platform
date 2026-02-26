package com.example.demo.order.service;

import com.example.demo.order.dto.OrderResponse;
import com.example.demo.order.dto.OrderStatusUpdateRequest;
import com.example.demo.order.dto.PlaceOrderRequest;

import java.util.List;

public interface OrderCommandService {
    List<OrderResponse> placeOrder(String userEmail, PlaceOrderRequest request);

    // 🔥 NEW: Update order status by restaurant
    void updateOrderStatus(
            String orderId,

            OrderStatusUpdateRequest request
    );

}

