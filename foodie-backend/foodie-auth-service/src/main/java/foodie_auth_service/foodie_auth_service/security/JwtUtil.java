package foodie_auth_service.foodie_auth_service.security;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private final Key key;

    // ⏱ Access Token = 15 minutes
    private final long ACCESS_TOKEN_EXP = 15 * 60 * 1000;

    // ⏱ Refresh Token = 7 days
    private final long REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60 * 1000;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        System.out.println(
                "AUTH SECRET BYTES = " +
                        java.util.Arrays.toString(secret.getBytes(StandardCharsets.UTF_8))
        );
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    //generateSignupToken
    public String generateSignupToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("type", "SIGNUP")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 10 * 60 * 1000)) // 10 min
                .signWith(key)
                .compact();
    }
        //validateSignupToken
    public String validateSignupToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        if (!"SIGNUP".equals(claims.get("type"))) {
            throw new RuntimeException("Invalid token type");
        }

        return claims.getSubject(); // email
    }
    // ---------------- ACCESS TOKEN ----------------
    public String generateAccessToken(Long userId, String email, List<String> roles) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXP))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ---------------- REFRESH TOKEN ----------------
    public String generateRefreshToken(Long userId, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXP))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract all claims
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Extract email
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // ✅ Extract roles
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractClaims(token).get("roles", List.class);
    }

    // ✅ Validate token
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public String getTokenType(String token) {
        return extractClaims(token).get("type", String.class);
    }
}

