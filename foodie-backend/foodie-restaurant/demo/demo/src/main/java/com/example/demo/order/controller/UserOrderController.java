package com.example.demo.order.controller;

import com.example.demo.order.dto.OrderResponse;
import com.example.demo.order.model.Order;
import com.example.demo.order.service.OrderQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

//@RestController
//@RequestMapping("/user/orders")
//@RequiredArgsConstructor
//public class UserOrderController {
//
//    private final OrderQueryService orderQueryService;
//
//    // 🟡 ACTIVE ORDERS
//    @GetMapping("/active")
//    public List<Order> activeOrders(Authentication auth) {
//        return orderQueryService.getActiveOrdersForUser(auth.getName());
//    }
//
//    // 🟢 ORDER HISTORY
//    @GetMapping("/history")
//    public List<Order> orderHistory(Authentication auth) {
//        return orderQueryService.getOrderHistoryForUser(auth.getName());
//    }
//}
@RestController
@RequestMapping("/user/orders")
@RequiredArgsConstructor
public class UserOrderController {

    private final OrderQueryService orderQueryService;

    @GetMapping("/active")
    public List<OrderResponse> activeOrders(Authentication auth) {
        return orderQueryService.getActiveOrdersForUser(auth.getName())
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    @GetMapping("/history")
    public List<OrderResponse> orderHistory(Authentication auth) {
        return orderQueryService.getOrderHistoryForUser(auth.getName())
                .stream()
                .map(OrderResponse::from)
                .toList();
    }
}
