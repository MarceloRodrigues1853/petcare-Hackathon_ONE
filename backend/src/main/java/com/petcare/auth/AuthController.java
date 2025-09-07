package com.petcare.auth;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            RegisterResponse resp = auth.register(request);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            // exemplo: e-mail já em uso, payload inválido do ponto de vista de negócio, etc.
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse resp = auth.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            // usuário não encontrado ou senha inválida
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
