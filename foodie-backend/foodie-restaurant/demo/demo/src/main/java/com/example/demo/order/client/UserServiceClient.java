package com.example.demo.order.client;

import com.example.demo.order.config.FeignInternalAuthConfig;
import com.example.demo.order.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "user-service",
        url = "http://localhost:9091",
        configuration = FeignInternalAuthConfig.class
)
public interface UserServiceClient {

    // ✅ PROFILE SNAPSHOT (cart + user info)
    @GetMapping("/users/internal/profile/{email}")
    UserDTO getUserByEmail(@PathVariable("email") String email);

    // ✅ CLEAR CART AFTER ORDER
    @DeleteMapping("/users/internal/cart/clear/{email}")
    void clearUserCart(@PathVariable("email") String email);

    // ✅ ADD ACTIVE ORDER
    @PostMapping("/users/internal/orders/active/{email}/{orderId}")
    void addActiveOrder(
            @PathVariable("email") String email,
            @PathVariable("orderId") String orderId
    );

    // ✅ MOVE TO ORDER HISTORY
    @PostMapping("/users/internal/orders/history/{email}/{orderId}")
    void addOrderHistory(
            @PathVariable("email") String email,
            @PathVariable("orderId") String orderId
    );
}
