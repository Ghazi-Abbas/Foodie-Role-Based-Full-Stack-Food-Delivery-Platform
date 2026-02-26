package com.example.demo.order.controller;

import com.example.demo.order.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/paypal/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {

        paymentService.verifyPaypal(
                body.get("orderId"),
                body.get("paypalOrderId")
        );

        return ResponseEntity.ok("Payment successful");
    }
}

