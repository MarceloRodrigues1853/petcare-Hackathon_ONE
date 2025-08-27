package com.petcare.auth;

import com.petcare.user.User; // <<< importa User para os overloads
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secretBase64;

  @Value("${jwt.expiration-ms:86400000}") // 24h
  private long expirationMs;

  private Key key() {
    byte[] keyBytes = Decoders.BASE64.decode(secretBase64);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  // ===== API atual (continua igual) =====
  public String generateToken(String subject, Map<String,Object> claims) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationMs);
    return Jwts.builder()
        .setSubject(subject)
        .addClaims(claims)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(key())
        .compact();
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public boolean isTokenValid(String token, String expectedUsername) {
    String username = extractUsername(token);
    return username != null && username.equals(expectedUsername) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    Date exp = extractClaim(token, Claims::getExpiration);
    return exp.before(new Date());
  }

  public <T> T extractClaim(String token, Function<Claims, T> resolver) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key())
        .build()
        .parseClaimsJws(token)
        .getBody();
    return resolver.apply(claims);
  }

  // ======== ALIASES/OVERLOADS p/ casar com os testes ========

  /** Alias para testes que chamam extractEmail(token) */
  public String extractEmail(String token) {
    return extractUsername(token);
  }

  /** Overload para testes que passam o User inteiro */
  public String generateToken(User user) {
    String subject = user.getEmail();
    Map<String,Object> claims = Map.of(
        "role", user.getRole() != null ? user.getRole().name() : "USER",
        "name", user.getName() != null ? user.getName() : ""
    );
    return generateToken(subject, claims);
  }

  /** Overload para isTokenValid(token, user) */
  public boolean isTokenValid(String token, User user) {
    String email = user != null ? user.getEmail() : null;
    return isTokenValid(token, email);
  }
}
