//package com.example.demo.restaurant.security;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.*;
//
//import java.util.List;
//
//@Configuration
//@RequiredArgsConstructor
//@EnableMethodSecurity(jsr250Enabled = true) // ✅ THIS WAS MISSING
//public class SecurityConfig {
//
//    private final JwtFilter jwtFilter;
//
//    @Bean
//    public SecurityFilterChain security(HttpSecurity http) throws Exception {
//
//        http
//                // ✅ Enable CORS inside Spring Security
//                .cors(Customizer.withDefaults())
//
//                // ✅ Disable CSRF for APIs
//                .csrf(csrf -> csrf.disable())
//
//                .authorizeHttpRequests(auth -> auth
//
//                        // ✅ Allow browser preflight
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//
//                        // 🌍 PUBLIC / GUEST APIs (NO TOKEN)
//                        .requestMatchers(
//                                "/api/guest/**",
//                                "/restaurant-api/public/**"
//                        ).permitAll()
//                        // 👤 USER ORDER + PAYMENT APIs  ✅ ADD THIS
//                        .requestMatchers(
//                                "/orders/**",
//                                "/payments/**"
//                        ).hasAuthority("USER")
//
//                        // 🔓 Partner onboarding & status (TOKEN REQUIRED)
//                        .requestMatchers(
//                                "/restaurant-api/partner/**",
//                                "/restaurant-api/owner/**",
//                                "/restaurant-api/public/live/**"
//                        ).authenticated()
//
//                        // 📝 Restaurant + Bank APIs
//                        .requestMatchers(
//                                "/restaurant-api/restaurants/**",
//                                "/restaurant-api/bank/**"
//                        ).hasAnyAuthority("USER", "RESTAURANT_OWNER", "ADMIN")
//
//                        // 🔐 ADMIN APIs
//                        .requestMatchers("/restaurant-api/admin/**")
//                        .hasAuthority("ADMIN")
//
//                        // 👤 USER APIs
//                        .requestMatchers("/restaurant-api/user/**")
//                        .hasAnyAuthority("USER", "ADMIN")
//
//                        // 🔒 Everything else
//                        .anyRequest().authenticated()
//                );
//
//        // ✅ JWT filter
//        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    // ------------------ GLOBAL CORS ------------------
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(List.of("http://localhost:3000"));
//        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        config.setAllowedHeaders(List.of("*"));
//        config.setAllowCredentials(false);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//
//        return source;
//    }
//}
//package com.example.demo.restaurant.security;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.*;
//
//import java.util.List;
//
//@Configuration
//@RequiredArgsConstructor
//@EnableMethodSecurity(jsr250Enabled = true)
//public class SecurityConfig {
//
//    private final JwtFilter jwtFilter;
//
//    @Bean
//    public SecurityFilterChain security(HttpSecurity http) throws Exception {
//
//        http
//                // ✅ Enable CORS
//                .cors(Customizer.withDefaults())
//
//                // ✅ Stateless API → disable CSRF
//                .csrf(csrf -> csrf.disable())
//
//                .authorizeHttpRequests(auth -> auth
//
//                        // ✅ Preflight
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//
//                        // 🌍 PUBLIC APIs
//                        .requestMatchers(
//                                "/api/guest/**",
//                                "/restaurant-api/public/**"
//                        ).permitAll()
//
//                        // 🧾 USER ORDER + PAYMENT (🔥 THIS WAS MISSING)
//                        .requestMatchers(
//                                "/orders/**",
//                                "/payments/**"
//                        ).hasAuthority("USER")
//
//                        .requestMatchers(
//                                "/user/orders/**"
//                        ).hasAuthority("USER")
//
//                        // 👤 USER APIs
//                        .requestMatchers("/restaurant-api/user/**")
//                        .hasAnyAuthority("USER", "ADMIN")
//
//
//                        .requestMatchers(HttpMethod.GET, "/api/reviews/restaurant/**")
//                        .hasAnyAuthority("RESTAURANT_OWNER", "ADMIN")
//
//                        // 🏪 RESTAURANT OWNER APIs
//                        .requestMatchers(
//                                "/restaurant-api/partner/**",
//                                "/restaurant-api/owner/**"
//                        ).hasAuthority("RESTAURANT_OWNER")
//
//
//                        .requestMatchers("/restaurant/dashboard/**")
//                        .hasAnyAuthority("RESTAURANT_OWNER", "ADMIN")
//
//
//
//                        // 🏦 RESTAURANT + BANK
//                        .requestMatchers(
//                                "/restaurant-api/restaurants/**",
//                                "/restaurant-api/bank/**"
//                        ).hasAnyAuthority("RESTAURANT_OWNER", "ADMIN")
//
//
//
//                        // 🔐 ADMIN APIs
//                        .requestMatchers("/restaurant-api/admin/**")
//                        .hasAuthority("ADMIN")
//                        // 🔒 Everything else
//                        .anyRequest().authenticated()
//                )
//
//                // ✅ JWT filter
//                .addFilterBefore(
//                        jwtFilter,
//                        UsernamePasswordAuthenticationFilter.class
//                );
//
//        return http.build();
//    }
//
//    // ---------------- CORS ----------------
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(List.of("http://localhost:3000"));
//        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
//        config.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source =
//                new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//
//        return source;
//    }
//}

package com.example.demo.restaurant.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(jsr250Enabled = true)
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain security(HttpSecurity http) throws Exception {

        http
                // =================================================
                // CORS + CSRF
                // =================================================
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // =================================================
                        // PREFLIGHT (DO NOT TOUCH)
                        // =================================================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // =================================================
                        // PUBLIC APIs (DO NOT TOUCH)
                        // =================================================
                        .requestMatchers(
                                "/api/guest/**",
                                "/api/search/**",
                                "/restaurant-api/public/**"
                        ).permitAll()

                        // =================================================
                        // USER (CUSTOMER) APIs (DO NOT TOUCH)
                        // =================================================
                        .requestMatchers(
                                "/orders/**",
                                "/payments/**"
                        ).hasAuthority("USER")

                        .requestMatchers(
                                "/user/orders/**"
                        ).hasAuthority("USER")

                        // =================================================
                        // ✅ NEW: RESTAURANT ORDER STATUS UPDATE (SAFE)
                        // PUT /restaurant/orders/{orderId}/status
                        // =================================================
                        // IMPORTANT:
                        // - Uses single-segment wildcard (*)
                        // - Avoids ** or invalid patterns
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/restaurant/orders/*/status"
                        ).hasAuthority("RESTAURANT_OWNER")

                        // =================================================
                        // RESTAURANT DASHBOARD (ORDER QUERIES)
                        // GET live / active / completed orders
                        // =================================================
                        .requestMatchers(
                                "/restaurant/dashboard/orders/**"
                        ).hasAnyAuthority("RESTAURANT_OWNER", "ADMIN")

                        // =================================================
                        // REVIEWS (READ ONLY)
                        // =================================================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/reviews/restaurant/**"
                        ).hasAnyAuthority("RESTAURANT_OWNER", "ADMIN")

                        // =================================================
                        // RESTAURANT OWNER APIs (DO NOT TOUCH)
                        // =================================================
                        .requestMatchers(
                                "/restaurant-api/partner/**",
                                "/restaurant-api/owner/**"
                        ).hasAuthority("RESTAURANT_OWNER")

                        // =================================================
                        // RESTAURANT + BANK (DO NOT TOUCH)
                        // =================================================
                        // /create/restaurants

                        .requestMatchers(
                                "/restaurant-api/restaurants/**",
                                "/restaurant-api/bank/**"
                        ).hasAnyAuthority("USER", "ADMIN")
                        // =================================================
                        // MENU MANAGEMENT (RESTAURANT OWNER)
                        // =================================================
//                                .requestMatchers(
//                                        "/restaurants/**/menu/**"
//                                ).hasAuthority("RESTAURANT_OWNER")

                                // =================================================
// RESTAURANT OWNER APIs
// =================================================
                                .requestMatchers(
                                        "/restaurant-api/partner/**",
                                        "/restaurant-api/owner/**",
                                        "/restaurants/**"          // ✅ MENU + RESTAURANT APIs
                                ).hasAuthority("RESTAURANT_OWNER")

                        // =================================================
                        // ADMIN APIs (DO NOT TOUCH)
                        // =================================================
                        .requestMatchers(
                                "/restaurant-api/admin/**"
                        ).hasAuthority("ADMIN")

                        // =================================================
                        // EVERYTHING ELSE (DO NOT TOUCH)
                        // =================================================
                        .anyRequest().authenticated()
                )

                // =================================================
                // JWT FILTER (DO NOT TOUCH)
                // =================================================
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =================================================
    // CORS CONFIG (DO NOT TOUCH)
    // =================================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

