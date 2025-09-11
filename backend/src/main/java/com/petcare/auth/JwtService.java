package com.petcare.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final Key key;
    private final long expirationMs;

    public JwtService() {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.isBlank()) {
            // Este erro era o que estava acontecendo
            throw new IllegalStateException("Variável de ambiente JWT_SECRET não definida");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        // Vamos usar a variável de ambiente para a expiração também
        String expirationEnv = System.getenv("JWT_EXPIRATION_MS");
        this.expirationMs = expirationEnv != null ? Long.parseLong(expirationEnv) : 86400000L; // 24 horas como padrão
    }

    public String generateToken(Long userId, String email) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .claim("userId", userId)
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ... resto do seu código ...
    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.getSubject());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return email != null && email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date exp = extractClaim(token, claims -> claims.getExpiration());
        return exp.before(new Date());
    }

    private <T> T extractClaim(String token, Function<io.jsonwebtoken.Claims, T> resolver) {
        var claims = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
        return resolver.apply(claims);
    }
}