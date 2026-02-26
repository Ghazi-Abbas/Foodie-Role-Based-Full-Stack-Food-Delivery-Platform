package com.example.chat_service.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class OrderClient {

    private final RestTemplate restTemplate = new RestTemplate();

    // Order Service base URL
    private static final String BASE_URL = "http://localhost:9092";

    /**
     * 🔹 Get ACTIVE orders for logged-in user
     * Endpoint: GET /user/orders/active
     */
    public List<Map<String, Object>> getActiveOrders(String authHeader) {

        if (authHeader == null || authHeader.isBlank()) {
            return Collections.emptyList();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response =
                restTemplate.exchange(
                        BASE_URL + "/user/orders/active",
                        HttpMethod.GET,
                        entity,
                        List.class
                );

        return response.getBody() != null
                ? response.getBody()
                : Collections.emptyList();
    }

    /**
     * 🔹 Get ORDER HISTORY for logged-in user
     * Endpoint: GET /user/orders/history
     */
    public List<Map<String, Object>> getOrderHistory(String authHeader) {

        if (authHeader == null || authHeader.isBlank()) {
            return Collections.emptyList();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response =
                restTemplate.exchange(
                        BASE_URL + "/user/orders/history",
                        HttpMethod.GET,
                        entity,
                        List.class
                );

        return response.getBody() != null
                ? response.getBody()
                : Collections.emptyList();
    }
}
