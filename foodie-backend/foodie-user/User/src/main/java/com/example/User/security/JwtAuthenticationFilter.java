//package com.example.User.security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//
//import javax.crypto.SecretKey;
//import java.io.IOException;
//import java.nio.charset.StandardCharsets;
//import java.util.List;
//
////@Component
////public class JwtAuthenticationFilter extends OncePerRequestFilter {
////
////    private final SecretKey key;
////
////    public JwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
////
////        System.out.println(
////                "USER SECRET BYTES = " +
////                        java.util.Arrays.toString(secret.getBytes(StandardCharsets.UTF_8))
////        );
////        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
////    }
////
////    @Override
////    protected void doFilterInternal(
////            HttpServletRequest request,
////            HttpServletResponse response,
////            FilterChain filterChain
////    ) throws ServletException, IOException {
////
////        String authHeader = request.getHeader("Authorization");
////
////        if (authHeader != null && authHeader.startsWith("Bearer ")) {
////            try {
////                String token = authHeader.substring(7).trim();
////
////                // ✅ THIS IS THE FIX
////                Claims claims = Jwts.parserBuilder()
////                        .setSigningKey(key)
////                        .build()
////                        .parseClaimsJws(token)
////                        .getBody();
////
////                String email = claims.getSubject();
////
////                UsernamePasswordAuthenticationToken authentication =
////                        new UsernamePasswordAuthenticationToken(email, null, List.of());
////
////                SecurityContextHolder.getContext().setAuthentication(authentication);
////
////                System.out.println("✅ JWT AUTH SET FOR: " + email);
////
////            } catch (Exception e) {
////                System.out.println("❌ JWT ERROR: " + e.getMessage());
////            }
////        }
////
////        filterChain.doFilter(request, response);
////    }
////}

package com.example.User.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecretKey key;

    public JwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);

                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String email = claims.getSubject();
                List<String> roles = claims.get("roles", List.class);

                // ✅ IMPORTANT FIX (NO var, NO wildcard)
                List<SimpleGrantedAuthority> authorities =
                        roles == null
                                ? List.of()
                                : roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .toList();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                authorities
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
