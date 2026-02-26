package com.example.demo.order.controller;

import com.example.demo.order.model.Order;


import com.example.demo.order.service.OrderQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurant/dashboard/orders")
@RequiredArgsConstructor
public class OrderQueryController {

    private final OrderQueryService queryService;

    // 🔹 ALL ORDERS
    @GetMapping("/{restaurantId}")
    public List<Order> all(@PathVariable String restaurantId) {
        return queryService.getOrdersForRestaurant(restaurantId);
    }

    // 🟡 ACTIVE ORDERS
    @GetMapping("/{restaurantId}/active")
    public List<Order> active(@PathVariable String restaurantId) {
        return queryService.getActiveOrders(restaurantId);
    }

    // 🟢 COMPLETED ORDERS
    @GetMapping("/{restaurantId}/completed")
    public List<Order> completed(@PathVariable String restaurantId) {
        return queryService.getCompletedOrders(restaurantId);
    }

    // 🔹 SINGLE STATUS
    @GetMapping("/{restaurantId}/status/{status}")
    public List<Order> byStatus(
            @PathVariable String restaurantId,
            @PathVariable String status
    ) {
        return queryService.getOrdersByStatus(restaurantId, status);
    }
}

