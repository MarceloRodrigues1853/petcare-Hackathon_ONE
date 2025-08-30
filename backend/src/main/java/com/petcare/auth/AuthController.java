package com.petcare.auth;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse resp = auth.register(request);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Suporta DTO com getters padrão (getEmail/getPassword)
        String email;
        String password;
        try {
            email = (String) LoginRequest.class.getMethod("getEmail").invoke(request);
            password = (String) LoginRequest.class.getMethod("getPassword").invoke(request);
        } catch (Exception e) {
            throw new IllegalArgumentException("LoginRequest precisa expor getEmail() e getPassword()");
        }
        return ResponseEntity.ok(auth.login(email, password));
    }
}
