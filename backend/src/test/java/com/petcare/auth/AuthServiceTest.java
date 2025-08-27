package com.petcare.auth;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.mockito.ArgumentMatchers.any;


import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void deveRegistrarUsuarioComDadosValidos() {
        RegisterRequest req = new RegisterRequest("Tay", "tay@email.com", "123456", "OWNER");

        when(userRepository.findByEmail(req.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(req.password())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        RegisterResponse res = authService.register(req);

        assertEquals("Tay", res.name());
        assertEquals("tay@email.com", res.email());
        assertEquals("OWNER", res.role());
        assertEquals(1L, res.id());
    }

    @Test
    void deveFalharAoRegistrarEmailJaExistente() {
        RegisterRequest req = new RegisterRequest("Tay", "tay@email.com", "123456", "OWNER");

        when(userRepository.findByEmail(req.email())).thenReturn(Optional.of(new User()));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(req));
        assertEquals("Email já cadastrado", ex.getMessage());
    }

    @Test
    void deveFalharAoRegistrarComRoleInvalida() {
        RegisterRequest req = new RegisterRequest("Tay", "tay@email.com", "123456", "INVALID");

        when(userRepository.findByEmail(req.email())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(req));
        assertEquals("Papel de usuário inválido", ex.getMessage());
    }

    @Test
    void deveLogarComCredenciaisValidas() {
        LoginRequest req = new LoginRequest("tay@email.com", "123456");
        User user = new User();
        user.setPasswordHash("hashed");

        when(userRepository.findByEmail(req.email())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(req.password(), user.getPasswordHash())).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("token");

        LoginResponse res = authService.login(req);

        assertEquals("token", res.token());
    }

    @Test
    void deveFalharAoLogarComEmailInexistente() {
        LoginRequest req = new LoginRequest("tay@email.com", "123456");

        when(userRepository.findByEmail(req.email())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(req));
        assertEquals("Email ou senha inválidos", ex.getMessage());
    }

    @Test
    void deveFalharAoLogarComSenhaInvalida() {
        LoginRequest req = new LoginRequest("tay@email.com", "wrong");
        User user = new User();
        user.setPasswordHash("hashed");

        when(userRepository.findByEmail(req.email())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(req.password(), user.getPasswordHash())).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(req));
        assertEquals("Email ou senha inválidos", ex.getMessage());
    }
}
