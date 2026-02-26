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
public class UserClient {

    private final RestTemplate restTemplate = new RestTemplate();

    // User Service base URL
    private static final String BASE_URL = "http://localhost:9091";

    /**
     * Get cart item count for logged-in user
     * Calls: GET /users/cart/count
     * Requires Authorization header (JWT)
     */
    public Integer getCartCount(String authHeader) {

        if (authHeader == null || authHeader.isBlank()) {
            return 0;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Integer> response =
                restTemplate.exchange(
                        BASE_URL + "/users/cart/count",
                        HttpMethod.GET,
                        entity,
                        Integer.class
                );

        return response.getBody() != null ? response.getBody() : 0;
    }

    public List<Map<String, Object>> getFullCart(String authHeader) {

        if (authHeader == null || authHeader.isBlank()) {
            return Collections.emptyList();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response =
                restTemplate.exchange(
                        "http://localhost:9091/users/cart",
                        HttpMethod.GET,
                        entity,
                        List.class
                );

        return response.getBody() != null
                ? response.getBody()
                : Collections.emptyList();
    }

}
