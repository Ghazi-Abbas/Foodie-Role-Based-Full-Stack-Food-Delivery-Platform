package com.example.User.controller;

import com.example.User.mode.CartItem;
import com.example.User.mode.FavouriteItem;
import com.example.User.mode.UserProfile;
import com.example.User.repository.UserProfileRepository;
import com.example.User.service.UserService;

import org.apache.catalina.User;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")

public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserProfileRepository userProfileRepository;

    /**
     * 🔹 Called AFTER LOGIN
     * Creates profile if not exists
     */
    //http://localhost:9091/users/create-user-account
    @PostMapping("/create-user-account")

    public ResponseEntity createAccount(@RequestBody UserProfile user){
        return new ResponseEntity(userService.createUserAccount(user), HttpStatus.CREATED);
    }


    /**
     * 🔹 Get logged-in user's profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfile> getMyProfile(Authentication auth) {
        System.out.println("🎯 CONTROLLER HIT, auth = " + auth);
        return ResponseEntity.ok(userService.getMyProfile(auth.getName()));
    }

    // ================= CART =================

    @PostMapping("/cart/add")
    public ResponseEntity<?> addToCart(
            @RequestBody CartItem item,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                userService.addToCart(auth.getName(), item)
        );
    }

    @PostMapping("/cart/decrease/{foodItemId}")
    public ResponseEntity<?> decreaseCart(
            @PathVariable String foodItemId,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                userService.decreaseCartItem(auth.getName(), foodItemId)
        );
    }

    @DeleteMapping("/cart/remove/{foodItemId}")
    public ResponseEntity<?> removeCart(
            @PathVariable String foodItemId,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                userService.removeFromCart(auth.getName(), foodItemId)
        );
    }

    // ================= FAVOURITES =================

    @PostMapping("/favourites/add")
    public ResponseEntity<?> addFavourite(
            @RequestBody FavouriteItem item,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                userService.addFavourite(auth.getName(), item)
        );
    }

    @DeleteMapping("/favourites/remove/{foodItemId}")
    public ResponseEntity<?> removeFavourite(
            @PathVariable String foodItemId,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                userService.removeFavourite(auth.getName(), foodItemId)
        );
    }

    @GetMapping("/favourites/check/{foodItemId}")
    public ResponseEntity<?> isFavourite(
            @PathVariable String foodItemId,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                userService.isFavourite(auth.getName(), foodItemId)
        );
    }
    // ================= ALL FAVOURITES =================
    @GetMapping("/favourites")
    public ResponseEntity<?> getAllFavourites(Authentication auth) {

        UserProfile user = userProfileRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                user.getFavourites() == null ? List.of() : user.getFavourites()
        );
    }
    @GetMapping("/cart/count")
    public ResponseEntity<Integer> getCartCount(
            Authentication authentication
    ) {
        String email = authentication.getName();

        UserProfile user = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getCart() == null || user.getCart().isEmpty()) {
            return ResponseEntity.ok(0);
        }

        int count = user.getCart()
                .stream()
                .mapToInt(item -> item.getQuantity())
                .sum();

        return ResponseEntity.ok(count);
    }
    // ================= FULL CART =================
    @GetMapping("/cart")
    public ResponseEntity<?> getFullCart(Authentication authentication) {

        String email = authentication.getName();

        UserProfile user = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getCart());
    }


}
