package com.example.demo.order.controller;

import com.example.demo.order.dto.OrderStatusUpdateRequest;
import com.example.demo.order.service.OrderCommandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurant/orders")
@RequiredArgsConstructor
public class RestaurantOrderCommandController {

    private final OrderCommandService orderCommandService;

    /**
     * Restaurant updates order status
     * PLACED → ACCEPTED → PREPARING → READY
     */
    @PutMapping("/{orderId}/status")
    public void updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody @Valid OrderStatusUpdateRequest request,
            Authentication auth
    ) {
        // auth.getName() = restaurant owner email (can verify later)
        orderCommandService.updateOrderStatus(orderId, request);
    }
}
