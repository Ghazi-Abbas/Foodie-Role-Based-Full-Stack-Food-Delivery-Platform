package com.example.User.controller;

import com.example.User.mode.UserProfile;
import com.example.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/internal")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserService userService;

    // 🔐 CLEAR CART (called by Order Service)
    @DeleteMapping("/cart/clear/{email}")
    public void clearCart(@PathVariable String email) {
        userService.clearCart(email);
    }

    // 🔐 ADD ACTIVE ORDER
    @PostMapping("/orders/active/{email}/{orderId}")
    public void addActiveOrder(
            @PathVariable String email,
            @PathVariable String orderId
    ) {
        userService.addActiveOrder(email, orderId);
    }

    // 🔐 ADD ORDER HISTORY
    @PostMapping("/orders/history/{email}/{orderId}")
    public void addOrderHistory(
            @PathVariable String email,
            @PathVariable String orderId
    ) {
        userService.addOrderHistory(email, orderId);
    }

    // 🔐 PROFILE SNAPSHOT (read-only)
    @GetMapping("/profile/{email}")
    public UserProfile getProfile(@PathVariable String email) {
        return userService.getMyProfile(email);
    }


}
