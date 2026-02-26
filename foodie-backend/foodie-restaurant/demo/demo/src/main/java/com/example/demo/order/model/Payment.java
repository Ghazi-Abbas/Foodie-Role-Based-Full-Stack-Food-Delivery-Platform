package com.example.demo.order.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String orderId;
    private String provider;
    private String providerOrderId;
    private double amount;
    private String status;
    private Instant createdAt;
}
