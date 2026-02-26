package com.example.demo.order.controller;

import com.example.demo.order.dto.PlaceOrderRequest;
import com.example.demo.order.dto.OrderResponse;
import com.example.demo.order.service.OrderCommandServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderCommandController {

    private final OrderCommandServiceImpl orderCommandService;
    @PostMapping("/place")
    public List<OrderResponse> placeOrder(
            @RequestBody PlaceOrderRequest request,
            Authentication auth
    ) {
        return orderCommandService.placeOrder(
                auth.getName(),
                request
        );
    }

}
