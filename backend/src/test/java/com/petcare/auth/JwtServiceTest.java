/*
package com.petcare.auth;

import com.petcare.user.Role;
import com.petcare.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.function.Function;
import io.jsonwebtoken.Claims;


import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;

    private final String secretKey = "minha-chave-super-secreta-12345678901234567890"; // pelo menos 32 bytes

    private User mockUser;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);

        mockUser = new User();
        mockUser.setEmail("tay@example.com");
        mockUser.setRole(Role.ADMIN); // ou qualquer enum que você use
    }

    @Test
    void deveGerarTokenComEmailECargo() {
        String token = jwtService.generateToken(mockUser);

        assertNotNull(token);
        assertTrue(token.startsWith("ey")); // tokens JWT geralmente começam com "ey"
    }

    @Test
    void deveExtrairEmailCorretamente() {
        String token = jwtService.generateToken(mockUser);

        String emailExtraido = jwtService.extractEmail(token);

        assertEquals(mockUser.getEmail(), emailExtraido);
    }

    @Test
    void deveValidarTokenCorreto() {
        String token = jwtService.generateToken(mockUser);

        boolean valido = jwtService.isTokenValid(token, mockUser);

        assertTrue(valido);
    }

    @Test
    void deveDetectarTokenExpirado() {
        // Gera um token com expiração no passado
        String tokenExpirado = Jwts.builder()
                .setSubject(mockUser.getEmail())
                .setExpiration(new Date(System.currentTimeMillis() - 1000)) // já expirado
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();

        boolean valido = jwtService.isTokenValid(tokenExpirado, mockUser);

        assertFalse(valido);
    }

    @Test
    void deveExtrairRoleDoToken() {
        // Gera um token usando o método oficial da classe
        String token = jwtService.generateToken(mockUser);

        // Extrai a role usando o método genérico extractClaim
        String roleExtraida = jwtService.extractClaim(token, claims -> claims.get("role", String.class));

        // Verifica se a role extraída é igual à role do usuário
        assertEquals(mockUser.getRole().name(), roleExtraida);
    }


}
*/