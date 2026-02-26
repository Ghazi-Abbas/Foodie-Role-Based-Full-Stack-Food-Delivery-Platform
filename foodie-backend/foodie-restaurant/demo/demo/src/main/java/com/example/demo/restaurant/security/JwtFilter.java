package com.example.demo.restaurant.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// by Ghazi
//@Component
//@RequiredArgsConstructor
//public class JwtFilter extends OncePerRequestFilter {
//
//    private final JwtUtil jwtUtil;
//
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        String path = request.getRequestURI();
//        return path.contains("/api/guest/")
//                || path.contains("/restaurant-api/public/")
//                || path.contains("/restaurant-api/public/live/");
//    }
//
//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain
//    ) throws IOException, ServletException {
//
//        String header = request.getHeader("Authorization");
//
//        if (header == null || !header.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        String token = header.substring(7);
//
//        try {
//            Claims claims = jwtUtil.extractClaims(token);
//
//            String email = claims.getSubject();
//
//            // ✅ FIXED LINE
//            List<String> roles = claims.get("authorities", List.class);
//
//            if (roles == null || roles.isEmpty()) {
//                System.out.println("❌ No authorities found in JWT");
//                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//                return;
//            }
//
//            var authorities = roles.stream()
//                    .map(SimpleGrantedAuthority::new)
//                    .toList();
//
//            UsernamePasswordAuthenticationToken auth =
//                    new UsernamePasswordAuthenticationToken(email, null, authorities);
//
//            SecurityContextHolder.getContext().setAuthentication(auth);
//
//        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
//            System.out.println("⏰ JWT Expired");
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//
//        } catch (Exception e) {
//            System.out.println("❌ JWT FAILED");
//            e.printStackTrace();
//            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//            return;
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.contains("/api/guest/")
                || path.contains("/restaurant-api/public/")
                || path.contains("/restaurant-api/public/live/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws IOException, ServletException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Claims claims = jwtUtil.extractClaims(token);

            String email = claims.getSubject();

            // ✅ CORRECT KEY
            List<String> roles = claims.get("roles", List.class);

            if (roles == null || roles.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }

            var authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList();

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        filterChain.doFilter(request, response);
    }
}

