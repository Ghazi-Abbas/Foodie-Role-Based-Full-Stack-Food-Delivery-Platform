////package com.example.demo.order.dto;
////
////import lombok.AllArgsConstructor;
////import lombok.Builder;
////import lombok.Data;
////import lombok.NoArgsConstructor;
////import org.springframework.core.annotation.Order;
////
////import java.time.Instant;
////
//////@Data
//////@Builder
//////public class OrderResponse {
//////
//////    private String orderId;
//////
//////    // 🔥 ADD THESE
//////    private String restaurantId;
//////    private String restaurantName;
//////   private double totalAmount;
//////    private String orderStatus;
//////    private Instant createdAt;
//////    private String status;
//////}
////@Data
////@AllArgsConstructor
////@NoArgsConstructor
////@Builder
////public class OrderResponse {
////
////    private String id;
////    private String restaurantName;
////    private String restaurantCity;
////    private double totalAmount;
////    private String orderStatus;
////    private Instant createdAt;
////
////    public static OrderResponse from(Order o) {
////        return OrderResponse.builder()
////                .id(o.getId())
////                .restaurantName(o.getRestaurantName())
////                .restaurantCity(o.getRestaurantCity())
////                .totalAmount(o.getTotalAmount())
////                .orderStatus(o.getOrderStatus().name())
////                .createdAt(o.getCreatedAt())
////                .build();
////    }
////}
//package com.example.demo.order.dto;
//
//import com.example.demo.order.model.Order;   // ✅ CORRECT IMPORT
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.Instant;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//public class OrderResponse {
//
//    private String id;
//    private String restaurantName;
//    private String restaurantCity;
//    private double totalAmount;
//    private String orderStatus;
//    private Instant createdAt;
//
//    public static OrderResponse from(Order o) {
//        return OrderResponse.builder()
//                .id(o.getId())
//                .restaurantName(o.getRestaurantName())
//                .restaurantCity(o.getRestaurantCity())
//                .totalAmount(o.getTotalAmount())
//                .orderStatus(o.getOrderStatus().name())
//                .createdAt(o.getCreatedAt())
//                .build();
//    }
//}
package com.example.demo.order.dto;

import com.example.demo.order.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {

    // 🔹 OLD (already used elsewhere)
    private String id;
    private String orderStatus;

    // 🔹 NEW (required by placeOrder)
    private String orderId;
    private String status;

    private String restaurantName;
    private String restaurantCity;
    private double totalAmount;
    private Instant createdAt;

    // 🔁 Mapper (used by query controllers)
    public static OrderResponse from(Order o) {
        return OrderResponse.builder()
                .id(o.getId())
                .orderId(o.getId()) // both set
                .restaurantName(o.getRestaurantName())
                .restaurantCity(o.getRestaurantCity())
                .totalAmount(o.getTotalAmount())
                .orderStatus(o.getOrderStatus().name())
                .createdAt(o.getCreatedAt())
                .build();
    }
}
