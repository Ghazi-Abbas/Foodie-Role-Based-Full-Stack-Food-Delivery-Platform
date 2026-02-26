//package com.example.demo.order.service;
//
//import com.example.demo.order.client.UserServiceClient;
//import com.example.demo.order.dto.*;
//import com.example.demo.order.model.*;
//import com.example.demo.order.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.Instant;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class OrderCommandServiceImpl implements OrderCommandService {
//
//    private final UserServiceClient userClient;
//    private final OrderRepository orderRepository;
//    private final PaymentRepository paymentRepository;
//
//    @Override
//    public OrderResponse placeOrder(
//            String userEmail,
//            PlaceOrderRequest request
//    ) {
//
//        UserDTO user = userClient.getUserByEmail(userEmail);
//
//        if (user.getCart().isEmpty()) {
//            throw new RuntimeException("Cart is empty");
//        }
//
//        var firstItem = user.getCart().get(0);
//
//        List<OrderItem> items = user.getCart().stream()
//                .map(c -> OrderItem.builder()
//                        .foodItemId(c.getFoodItemId())
//                        .itemName(c.getItemName())
//                        .imageUrl(c.getImageUrl())
//                        .price(c.getPrice())
//                        .quantity(c.getQuantity())
//                        .build())
//                .toList();
//
//        double subtotal = items.stream()
//                .mapToDouble(i -> i.getPrice() * i.getQuantity())
//                .sum();
//
//        double tax = subtotal * 0.05;
//        double deliveryFee = 40;
//
//        Order order = Order.builder()
//                .userEmail(userEmail)
//                .restaurantId(firstItem.getRestaurantId())
//                .restaurantName(firstItem.getRestaurantName())
//                .restaurantAddress(firstItem.getRestaurantAddress())
//                .restaurantCity(firstItem.getRestaurantCity())
//                .items(items)
//                .subtotal(subtotal)
//                .tax(tax)
//                .deliveryFee(deliveryFee)
//                .totalAmount(subtotal + tax + deliveryFee)
//                .orderStatus("CREATED")
//                .paymentStatus("PAID")
//                .createdAt(Instant.now())
//                .build();
//
//        Order savedOrder = orderRepository.save(order);
//
//        paymentRepository.save(
//                Payment.builder()
//                        .orderId(savedOrder.getId())
//                        .provider("PAYPAL")
//                        .providerOrderId(request.getPaypalOrderId())
//                        .amount(savedOrder.getTotalAmount())
//                        .status("SUCCESS")
//                        .createdAt(Instant.now())
//                        .build()
//        );
//
//        userClient.clearUserCart(userEmail);
//        userClient.addActiveOrder(userEmail, savedOrder.getId());
//
//        return OrderResponse.builder()
//                .orderId(savedOrder.getId())
//                .status("SUCCESS")
//                .totalAmount(savedOrder.getTotalAmount())
//                .build();
//    }
//}
//package com.example.demo.order.service;
//
//import com.example.demo.order.client.UserServiceClient;
//import com.example.demo.order.dto.*;
//import com.example.demo.order.model.*;
//import com.example.demo.order.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.Instant;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class OrderCommandServiceImpl implements OrderCommandService {
//
//    private final UserServiceClient userClient;
//    private final OrderRepository orderRepository;
//    private final PaymentRepository paymentRepository;
//
//    @Override
//    public List<OrderResponse> placeOrder(
//            String userEmail,
//            PlaceOrderRequest request
//    ) {
//
//        // 🔹 1. FETCH USER + CART
//        UserDTO user = userClient.getUserByEmail(userEmail);
//
//        if (user.getCart() == null || user.getCart().isEmpty()) {
//            throw new RuntimeException("Cart is empty");
//        }
//
//        // 🔹 2. GROUP CART ITEMS BY RESTAURANT
//        Map<String, List<UserCartDTO>> cartByRestaurant =
//                user.getCart()
//                        .stream()
//                        .collect(Collectors.groupingBy(
//                                UserCartDTO::getRestaurantId
//                        ));
//
//        List<OrderResponse> responses = new ArrayList<>();
//
//        // 🔹 3. CREATE ONE ORDER PER RESTAURANT
//        for (Map.Entry<String, List<UserCartDTO>> entry : cartByRestaurant.entrySet()) {
//
//            List<UserCartDTO> restaurantCart = entry.getValue();
//            UserCartDTO firstItem = restaurantCart.get(0);
//
//            // 🔹 Convert cart → order items
//            List<OrderItem> items = restaurantCart.stream()
//                    .map(c -> OrderItem.builder()
//                            .foodItemId(c.getFoodItemId())
//                            .itemName(c.getItemName())
//                            .imageUrl(c.getImageUrl())
//                            .price(c.getPrice())
//                            .quantity(c.getQuantity())
//                            .build())
//                    .toList();
//
//            // 🔹 Calculate pricing
//            double subtotal = items.stream()
//                    .mapToDouble(i -> i.getPrice() * i.getQuantity())
//                    .sum();
//
//            double tax = subtotal * 0.05;
//            double deliveryFee = 40;
//            double total = subtotal + tax + deliveryFee;
//
//            // 🔹 Create order
//            Order order = Order.builder()
//                    .userEmail(userEmail)
//                    .restaurantId(firstItem.getRestaurantId())
//                    .restaurantName(firstItem.getRestaurantName())
//                    .restaurantAddress(firstItem.getRestaurantAddress())
//                    .restaurantCity(firstItem.getRestaurantCity())
//                    .items(items)
//                    .subtotal(subtotal)
//                    .tax(tax)
//                    .deliveryFee(deliveryFee)
//                    .totalAmount(total)
//                    .orderStatus("CREATED")
//                    .paymentStatus("PAID")
//                    .createdAt(Instant.now())
//                    .build();
//
//            Order savedOrder = orderRepository.save(order);
//
//            // 🔹 Save payment per restaurant order
//            paymentRepository.save(
//                    Payment.builder()
//                            .orderId(savedOrder.getId())
//                            .provider("PAYPAL")
//                            .providerOrderId(request.getPaypalOrderId())
//                            .amount(total)
//                            .status("SUCCESS")
//                            .createdAt(Instant.now())
//                            .build()
//            );
//
//            // 🔹 Notify user-service
//            userClient.addActiveOrder(userEmail, savedOrder.getId());
//
//            // 🔹 Response
//            responses.add(
//                    OrderResponse.builder()
//                            .orderId(savedOrder.getId())
//                            .restaurantName(firstItem.getRestaurantName())
//                            .totalAmount(total)
//                            .status("SUCCESS")
//                            .build()
//            );
//        }
//
//        // 🔹 4. CLEAR CART ONCE (VERY IMPORTANT)
//        userClient.clearUserCart(userEmail);
//
//        return responses;
//    }
//}
//package com.example.demo.order.service;
//
//import com.example.demo.order.client.UserServiceClient;
//import com.example.demo.order.dto.*;
//import com.example.demo.order.model.*;
//import com.example.demo.order.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.Instant;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class OrderCommandServiceImpl implements OrderCommandService {
//
//    private final UserServiceClient userClient;
//    private final OrderRepository orderRepository;
//    private final PaymentRepository paymentRepository;
//
//    // ================= PLACE ORDER =================
//    @Override
//    public List<OrderResponse> placeOrder(
//            String userEmail,
//            PlaceOrderRequest request
//    ) {
//
//        UserDTO user = userClient.getUserByEmail(userEmail);
//
//        if (user.getCart() == null || user.getCart().isEmpty()) {
//            throw new RuntimeException("Cart is empty");
//        }
//
//        Map<String, List<UserCartDTO>> cartByRestaurant =
//                user.getCart()
//                        .stream()
//                        .collect(Collectors.groupingBy(UserCartDTO::getRestaurantId));
//
//        List<OrderResponse> responses = new ArrayList<>();
//
//        for (Map.Entry<String, List<UserCartDTO>> entry : cartByRestaurant.entrySet()) {
//
//            List<UserCartDTO> restaurantCart = entry.getValue();
//            UserCartDTO firstItem = restaurantCart.get(0);
//
//            List<OrderItem> items = restaurantCart.stream()
//                    .map(c -> OrderItem.builder()
//                            .foodItemId(c.getFoodItemId())
//                            .itemName(c.getItemName())
//                            .imageUrl(c.getImageUrl())
//                            .price(c.getPrice())
//                            .quantity(c.getQuantity())
//                            .build())
//                    .toList();
//
//            double subtotal = items.stream()
//                    .mapToDouble(i -> i.getPrice() * i.getQuantity())
//                    .sum();
//
//            double tax = subtotal * 0.05;
//            double deliveryFee = 40;
//            double total = subtotal + tax + deliveryFee;
//
//            Order order = Order.builder()
//                    .userEmail(userEmail)
//                    .restaurantId(firstItem.getRestaurantId())
//                    .restaurantName(firstItem.getRestaurantName())
//                    .restaurantAddress(firstItem.getRestaurantAddress())
//                    .restaurantCity(firstItem.getRestaurantCity())
//                    .items(items)
//                    .subtotal(subtotal)
//                    .tax(tax)
//                    .deliveryFee(deliveryFee)
//                    .totalAmount(total)
//                    .orderStatus(OrderStatus.PLACED) // ✅ FIXED
//                    .paymentStatus("PAID")
//                    .createdAt(Instant.now())
//                    .build();
//
//            Order savedOrder = orderRepository.save(order);
//
//            paymentRepository.save(
//                    Payment.builder()
//                            .orderId(savedOrder.getId())
//                            .provider("PAYPAL")
//                            .providerOrderId(request.getPaypalOrderId())
//                            .amount(total)
//                            .status("SUCCESS")
//                            .createdAt(Instant.now())
//                            .build()
//            );
//
//            userClient.addActiveOrder(userEmail, savedOrder.getId());
//
//            responses.add(
//                    OrderResponse.builder()
//                            .orderId(savedOrder.getId())
//                            .restaurantName(firstItem.getRestaurantName())
//                            .totalAmount(total)
//                            .status("SUCCESS")
//                            .build()
//            );
//        }
//
//        userClient.clearUserCart(userEmail);
//        return responses;
//    }
//
//    // ================= UPDATE ORDER STATUS =================
//    @Override
//    public void updateOrderStatus(
//            String orderId,
//            OrderStatusUpdateRequest request
//    ) {
//
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//
//        OrderStatus newStatus;
//        try {
//            newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
//        } catch (Exception e) {
//            throw new RuntimeException("Invalid order status");
//        }
//
//        OrderStatus currentStatus = order.getOrderStatus();
//
//        // 🔒 VALID TRANSITIONS
//        if (!isValidTransition(currentStatus, newStatus)) {
//            throw new RuntimeException(
//                    "Invalid status transition: " + currentStatus + " → " + newStatus
//            );
//        }
//
//        order.setOrderStatus(newStatus);
//        orderRepository.save(order);
//    }
//
//
//    // ================= STATUS RULES =================
//    private boolean isValidTransition(
//            OrderStatus current,
//            OrderStatus next
//    ) {
//        return switch (current) {
//            case PLACED -> next == OrderStatus.ACCEPTED;
//            case ACCEPTED -> next == OrderStatus.PREPARING;
//            case PREPARING -> next == OrderStatus.READY;
//            default -> false;
//        };
//    }
//}
package com.example.demo.order.service;

import com.example.demo.order.client.UserServiceClient;
import com.example.demo.order.dto.*;
import com.example.demo.order.model.*;
import com.example.demo.order.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderCommandServiceImpl implements OrderCommandService {

    private final UserServiceClient userClient;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    // ================= PLACE ORDER =================
    @Override
    public List<OrderResponse> placeOrder(
            String userEmail,
            PlaceOrderRequest request
    ) {

        UserDTO user = userClient.getUserByEmail(userEmail);

        if (user.getCart() == null || user.getCart().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Map<String, List<UserCartDTO>> cartByRestaurant =
                user.getCart()
                        .stream()
                        .collect(Collectors.groupingBy(UserCartDTO::getRestaurantId));

        List<OrderResponse> responses = new ArrayList<>();

        for (Map.Entry<String, List<UserCartDTO>> entry : cartByRestaurant.entrySet()) {

            List<UserCartDTO> restaurantCart = entry.getValue();
            UserCartDTO firstItem = restaurantCart.get(0);

            List<OrderItem> items = restaurantCart.stream()
                    .map(c -> OrderItem.builder()
                            .foodItemId(c.getFoodItemId())
                            .itemName(c.getItemName())
                            .imageUrl(c.getImageUrl())
                            .price(c.getPrice())
                            .quantity(c.getQuantity())
                            .build())
                    .toList();

            double subtotal = items.stream()
                    .mapToDouble(i -> i.getPrice() * i.getQuantity())
                    .sum();

            double tax = subtotal * 0.05;
            double deliveryFee = 40;
            double total = subtotal + tax + deliveryFee;

            Order order = Order.builder()
                    .userEmail(userEmail)
                    .restaurantId(firstItem.getRestaurantId())
                    .restaurantName(firstItem.getRestaurantName())
                    .restaurantAddress(firstItem.getRestaurantAddress())
                    .restaurantCity(firstItem.getRestaurantCity())
                    .items(items)
                    .subtotal(subtotal)
                    .tax(tax)
                    .deliveryFee(deliveryFee)
                    .totalAmount(total)
                    .orderStatus(OrderStatus.PLACED) // ✅ VALID ENUM
                    .paymentStatus("PAID")
                    .createdAt(Instant.now())
                    .build();

            Order savedOrder = orderRepository.save(order);

            paymentRepository.save(
                    Payment.builder()
                            .orderId(savedOrder.getId())
                            .provider("PAYPAL")
                            .providerOrderId(request.getPaypalOrderId())
                            .amount(total)
                            .status("SUCCESS")
                            .createdAt(Instant.now())
                            .build()
            );

            userClient.addActiveOrder(userEmail, savedOrder.getId());

            responses.add(
                    OrderResponse.builder()
                            .orderId(savedOrder.getId())
                            .restaurantName(firstItem.getRestaurantName())
                            .totalAmount(total)
                            .status("SUCCESS")
                            .build()
            );
        }

        userClient.clearUserCart(userEmail);
        return responses;
    }

//    // ================= UPDATE ORDER STATUS =================
//    @Override
//    public void updateOrderStatus(
//            String orderId,
//            OrderStatusUpdateRequest request
//    ) {
//
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//
//        OrderStatus newStatus;
//        try {
//            newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
//        } catch (Exception e) {
//            throw new RuntimeException("Invalid order status");
//        }
//
//        OrderStatus currentStatus = order.getOrderStatus();
//
//        // 🔒 VALIDATE TRANSITION
//        if (!isValidTransition(currentStatus, newStatus)) {
//            throw new RuntimeException(
//                    "Invalid status transition: " + currentStatus + " → " + newStatus
//            );
//        }
//
//        order.setOrderStatus(newStatus);
//        orderRepository.save(order);
//    }
//
//    // ================= STATUS RULES (FIXED) =================
//    private boolean isValidTransition(
//            OrderStatus current,
//            OrderStatus next
//    ) {
//        return switch (current) {
//
//            case PLACED ->
//                    next == OrderStatus.ACCEPTED;
//
//            case ACCEPTED ->
//                    next == OrderStatus.PREPARING;
//
//            case PREPARING ->
//                    next == OrderStatus.READY;
//
//            case READY ->
//                    next == OrderStatus.PICKED_UP;
//
//            case PICKED_UP ->
//                    next == OrderStatus.DELIVERED;
//
//            case DELIVERED, CANCELLED ->
//                    false;
//
//            default ->
//                    false;
//        };
//    }
//}
// ================= UPDATE ORDER STATUS =================
@Override
public void updateOrderStatus(
        String orderId,
        OrderStatusUpdateRequest request
) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    OrderStatus newStatus;
    try {
        newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
    } catch (Exception e) {
        throw new RuntimeException("Invalid order status");
    }

    OrderStatus currentStatus = order.getOrderStatus();

    if (!isValidTransition(currentStatus, newStatus)) {
        throw new RuntimeException(
                "Invalid status transition: " + currentStatus + " → " + newStatus
        );
    }

    order.setOrderStatus(newStatus);
    orderRepository.save(order);
}

    // ================= STATUS RULES =================
    private boolean isValidTransition(
            OrderStatus current,
            OrderStatus next
    ) {
        return switch (current) {

            case PLACED ->
                    next == OrderStatus.ACCEPTED;

            case ACCEPTED ->
                    next == OrderStatus.PREPARING;

            case PREPARING ->
                    next == OrderStatus.READY;

            // 🔥 TEMPORARY (NO DELIVERY PARTNER)
            case READY ->
                    next == OrderStatus.DELIVERED
                            || next == OrderStatus.PICKED_UP; // future-safe

            case PICKED_UP ->
                    next == OrderStatus.DELIVERED;

            case DELIVERED, CANCELLED ->
                    false;
        };
    }
}