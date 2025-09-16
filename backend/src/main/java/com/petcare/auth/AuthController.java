package com.petcare.auth;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request); // Corrigido para não esperar um retorno
        return ResponseEntity.ok("Usuário registrado com sucesso.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Corrigido para passar o objeto LoginRequest completo
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}