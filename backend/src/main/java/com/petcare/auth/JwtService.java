package com.petcare.auth;

import com.petcare.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${JWT_SECRET}")
    private String secretKey;

    // Gera um token JWT contendo o e-mail e a role do usuário. Define validade de 24 horas.
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24h
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrai o e-mail (subject) do token JWT.
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Verifica se o token é válido e não expirado.
    public boolean isTokenValid(String token, User user) {
        return extractEmail(token).equals(user.getEmail()) && !isTokenExpired(token);
    }

    // Verifica se o token já expirou.
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // Extrai qualquer informação (claim) do token.
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
                .setAllowedClockSkewSeconds(10)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    private byte[] getSigningKey() {
    if (secretKey == null || secretKey.isBlank()) {
        throw new IllegalStateException("JWT_SECRET não está definido");
       }
       return secretKey.getBytes(StandardCharsets.UTF_8);
    }

}
