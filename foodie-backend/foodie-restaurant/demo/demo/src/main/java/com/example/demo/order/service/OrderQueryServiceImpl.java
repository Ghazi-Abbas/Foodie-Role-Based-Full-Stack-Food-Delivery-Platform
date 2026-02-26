//package com.example.demo.order.service;
//
//import com.example.demo.order.model.Order;
//import com.example.demo.order.model.OrderStatus;
//import com.example.demo.order.repository.OrderRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class OrderQueryServiceImpl implements OrderQueryService {
//
//    private final OrderRepository orderRepository;
//
//    // ================= RESTAURANT =================
//
//    @Override
//    public List<Order> getOrdersForRestaurant(String restaurantId) {
//        return orderRepository.findByRestaurantId(restaurantId);
//    }
//
//    @Override
//    public List<Order> getActiveOrders(String restaurantId) {
//        return orderRepository.findByRestaurantIdAndOrderStatusIn(
//                restaurantId,
//                List.of("CREATED", "ACCEPTED", "PREPARING", "ON_THE_WAY")
//        );
//    }
//
//    @Override
//    public List<Order> getCompletedOrders(String restaurantId) {
//        return orderRepository.findByRestaurantIdAndOrderStatusIn(
//                restaurantId,
//                List.of("DELIVERED", "CANCELLED")
//        );
//    }
//
//    @Override
//    public List<Order> getOrdersByStatus(String restaurantId, String status) {
//        return orderRepository.findByRestaurantIdAndOrderStatus(
//                restaurantId, status
//        );
//    }
//
//    // ================= USER =================
////
////    @Override
////    public List<Order> getActiveOrdersForUser(String userEmail) {
////        return orderRepository.findByUserEmailAndOrderStatusIn(
////                userEmail,
////                List.of("CREATED", "ACCEPTED", "PREPARING", "ON_THE_WAY")
////        );
////    }
////
////    @Override
////    public List<Order> getOrderHistoryForUser(String userEmail) {
////        return orderRepository.findByUserEmailAndOrderStatusIn(
////                userEmail,
////                List.of("DELIVERED", "CANCELLED")
////        );
////    }
//
//    // 🟡 ACTIVE (USER)
//    public List<Order> getActiveOrdersForUser(String email) {
//        return orderRepository.findByUserEmailAndStatusIn(
//                email,
//                List.of(
//                        OrderStatus.PLACED,
//                        OrderStatus.ACCEPTED,
//                        OrderStatus.PREPARING,
//                        OrderStatus.READY,
//                        OrderStatus.OUT_FOR_DELIVERY
//                )
//        );
//    }
//
//    // 🟢 HISTORY (USER)
//    public List<Order> getOrderHistoryForUser(String email) {
//        return orderRepository.findByUserEmailAndStatusIn(
//                email,
//                List.of(
//                        OrderStatus.DELIVERED,
//                        OrderStatus.CANCELLED
//                )
//        );
//    }
//
//}
//
package com.example.demo.order.service;

import com.example.demo.order.model.Order;
import com.example.demo.order.model.OrderStatus;
import com.example.demo.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderQueryServiceImpl implements OrderQueryService {

    private final OrderRepository orderRepository;

    // ================= RESTAURANT =================

    @Override
    public List<Order> getOrdersForRestaurant(String restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Order> getActiveOrders(String restaurantId) {
        return orderRepository.findByRestaurantIdAndOrderStatusIn(
                restaurantId,
                List.of(
                        OrderStatus.PLACED.name(),
                        OrderStatus.ACCEPTED.name(),
                        OrderStatus.PREPARING.name(),
                        OrderStatus.READY.name(),
                        OrderStatus.PICKED_UP.name()
                )
        );
    }

    @Override
    public List<Order> getCompletedOrders(String restaurantId) {
        return orderRepository.findByRestaurantIdAndOrderStatusIn(
                restaurantId,
                List.of(
                        OrderStatus.DELIVERED.name(),
                        OrderStatus.CANCELLED.name()
                )
        );
    }

    @Override
    public List<Order> getOrdersByStatus(String restaurantId, String status) {
        return orderRepository.findByRestaurantIdAndOrderStatus(
                restaurantId,
                status.toUpperCase()
        );
    }

    // ================= USER =================

    // (kept commented – not removed)
//
//    @Override
//    public List<Order> getActiveOrdersForUser(String userEmail) {
//        return orderRepository.findByUserEmailAndOrderStatusIn(
//                userEmail,
//                List.of("CREATED", "ACCEPTED", "PREPARING", "ON_THE_WAY")
//        );
//    }
//
//    @Override
//    public List<Order> getOrderHistoryForUser(String userEmail) {
//        return orderRepository.findByUserEmailAndOrderStatusIn(
//                userEmail,
//                List.of("DELIVERED", "CANCELLED")
//        );
//    }

    // 🟡 ACTIVE (USER)
    @Override
    public List<Order> getActiveOrdersForUser(String email) {
        return orderRepository.findByUserEmailAndOrderStatusIn(
                email,
                List.of(
                        OrderStatus.PLACED.name(),
                        OrderStatus.ACCEPTED.name(),
                        OrderStatus.PREPARING.name(),
                        OrderStatus.READY.name(),
                        OrderStatus.PICKED_UP.name()
                )
        );
    }

    // 🟢 HISTORY (USER)
    @Override
    public List<Order> getOrderHistoryForUser(String email) {
        return orderRepository.findByUserEmailAndOrderStatusIn(
                email,
                List.of(
                        OrderStatus.DELIVERED.name(),
                        OrderStatus.CANCELLED.name()
                )
        );
    }
}
