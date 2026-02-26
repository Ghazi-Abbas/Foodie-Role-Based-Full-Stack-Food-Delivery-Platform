package com.example.chat_service.service;

import com.example.chat_service.model.ChatIntent;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class IntentResolver {

    public ChatIntent resolve(String message) {
        if (message == null || message.isBlank()) {
            return ChatIntent.GREETING;
        }

        String msg = message.toLowerCase().trim();

        // 🔥 ORDER MATTERS (non-veg BEFORE veg)
        if (msg.contains("non veg") || msg.contains("nonveg")) {
            return ChatIntent.NON_VEG_ITEMS;
        }

        if (msg.equals("veg") || msg.contains("veg items")) {
            return ChatIntent.VEG_ITEMS;
        }

        if (msg.contains("snack")) {
            return ChatIntent.SNACKS;
        }

        if (msg.contains("beverage") || msg.contains("drink")) {
            return ChatIntent.BEVERAGES;
        }

        if (msg.contains("dessert") || msg.contains("sweet")) {
            return ChatIntent.DESSERTS;
        }

        if (msg.contains("cart")) {
            return ChatIntent.VIEW_CART;
        }

        if (msg.contains("order")) {
            return ChatIntent.VIEW_ORDERS;
        }

        if (msg.contains("support") || msg.contains("help")) {
            return ChatIntent.SUPPORT;
        }

        if (msg.contains("hi") || msg.contains("hello")) {
            return ChatIntent.GREETING;
        }

        return ChatIntent.UNKNOWN;
    }
}
