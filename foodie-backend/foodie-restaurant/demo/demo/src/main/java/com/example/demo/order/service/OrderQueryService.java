package com.example.demo.order.service;

import com.example.demo.order.model.Order;

import java.util.List;

public interface OrderQueryService {

    List<Order> getOrdersForRestaurant(String restaurantId);

    List<Order> getActiveOrders(String restaurantId);

    List<Order> getCompletedOrders(String restaurantId);

    List<Order> getOrdersByStatus(String restaurantId, String status);

    List<Order> getActiveOrdersForUser(String userEmail);

    List<Order> getOrderHistoryForUser(String userEmail);
}
