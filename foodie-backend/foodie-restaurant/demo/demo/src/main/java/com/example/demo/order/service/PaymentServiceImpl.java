package com.example.demo.order.service;

import com.example.demo.order.client.UserServiceClient;
import com.example.demo.order.model.Order;
import com.example.demo.order.model.OrderStatus;
import com.example.demo.order.model.Payment;
import com.example.demo.order.repository.OrderRepository;
import com.example.demo.order.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;
    private final UserServiceClient userClient;

    @Override
    public void verifyPaypal(String orderId, String paypalOrderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ✅ Payment confirmed
        order.setPaymentStatus("PAID");

        // ✅ FIX: orderStatus is ENUM, not String
        order.setOrderStatus(OrderStatus.ACCEPTED);

        orderRepo.save(order);

        paymentRepo.save(
                Payment.builder()
                        .orderId(orderId)
                        .provider("PAYPAL")
                        .providerOrderId(paypalOrderId)
                        .amount(order.getTotalAmount())
                        .status("SUCCESS")
                        .createdAt(Instant.now())
                        .build()
        );

        // 🔥 Notify user-service
        userClient.addActiveOrder(order.getUserEmail(), orderId);
        userClient.addOrderHistory(order.getUserEmail(), orderId);
    }
}
