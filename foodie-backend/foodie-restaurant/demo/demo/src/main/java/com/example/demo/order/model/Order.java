//package com.example.demo.order.model;
//
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.time.Instant;
//import java.util.List;
//
//@Document(collection = "orders")
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class Order {
//
//    @Id
//    private String id;
//
//    private String userEmail;
//
//    private String restaurantId;
//    private String restaurantName;
//    private String restaurantAddress;
//    private String restaurantCity;
//
//    private List<OrderItem> items;
//    private double subtotal;
//    private double tax;
//    private double deliveryFee;
//    private double totalAmount;
//
//
//    @Enumerated(EnumType.STRING)
//    private OrderStatus orderStatus;     // CREATED, ACCEPTED, PREPARING, READY, PICKED_UP, DELIVERED
//    private String paymentStatus;   // PENDING, PAID, FAILED
//
//    private Instant createdAt;
//}
//
package com.example.demo.order.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id;

    private String userEmail;

    private String restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantCity;

    private List<OrderItem> items;

    private double subtotal;
    private double tax;
    private double deliveryFee;
    private double totalAmount;

    // MongoDB stores enums as STRING automatically
    private OrderStatus orderStatus;   // CREATED, ACCEPTED, PREPARING, READY, PICKED_UP, DELIVERED

    private String paymentStatus;      // PENDING, PAID, FAILED

    private Instant createdAt;
}
