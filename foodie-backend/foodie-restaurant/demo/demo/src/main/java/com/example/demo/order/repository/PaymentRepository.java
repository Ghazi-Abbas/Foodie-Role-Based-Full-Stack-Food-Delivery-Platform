package com.example.demo.order.repository;

import com.example.demo.order.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepository
        extends MongoRepository<Payment, String> {
}
