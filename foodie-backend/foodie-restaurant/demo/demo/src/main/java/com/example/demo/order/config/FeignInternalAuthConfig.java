package com.example.demo.order.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignInternalAuthConfig {

    @Value("${service.internal.token}")
    private String serviceToken;

    @Bean
    public RequestInterceptor serviceAuthInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("X-SERVICE-TOKEN", serviceToken);
        };
    }
}
