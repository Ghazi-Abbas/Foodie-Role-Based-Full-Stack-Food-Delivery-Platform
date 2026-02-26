package com.example.demo.order.util;

import com.example.demo.order.model.OrderStatus;

import static com.example.demo.order.model.OrderStatus.*;

public class OrderStatusValidator {

    public static boolean isValid(
            OrderStatus current,
            OrderStatus next
    ) {
        return switch (current) {
            case PLACED -> next == ACCEPTED;
            case ACCEPTED -> next == PREPARING;
            case PREPARING -> next == READY;
            case READY -> next == DELIVERED;
            default -> false;
        };
    }
}
