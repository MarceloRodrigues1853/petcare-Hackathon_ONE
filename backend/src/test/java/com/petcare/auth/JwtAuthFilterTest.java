/*
package com.petcare.auth;

import com.petcare.user.Role;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthFilterTest {

    @InjectMocks
    private JwtAuthFilter jwtAuthFilter;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepo;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setEmail("tay@example.com");
        mockUser.setRole(Role.ADMIN); // ou qualquer enum que você use

        SecurityContextHolder.clearContext();
    }

    @Test
    void deveAutenticarQuandoTokenValido() throws Exception {
        String token = "valid.jwt.token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.extractEmail(token)).thenReturn(mockUser.getEmail());
        when(userRepo.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        when(jwtService.isTokenValid(token, mockUser)).thenReturn(true);
        when(jwtService.extractClaim(eq(token), any())).thenReturn(mockUser.getRole().name());

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        assertNotNull(auth);
        assertEquals(mockUser, auth.getPrincipal());
        assertTrue(auth.getAuthorities().contains(new SimpleGrantedAuthority(mockUser.getRole().name())));

        verify(filterChain).doFilter(request, response);
    }

    @Test
    void naoDeveAutenticarComTokenInvalido() throws Exception {
        String token = "token.invalido";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.extractEmail(token)).thenReturn("tay@example.com");
        when(userRepo.findByEmail("tay@example.com")).thenReturn(Optional.of(mockUser));
        when(jwtService.isTokenValid(token, mockUser)).thenReturn(false); // simula token inválido

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        assertNull(auth); // não deve autenticar
        verify(filterChain).doFilter(request, response); // ainda deve seguir o fluxo
    }

}
*/