package com.petcare.auth;

import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.AuthenticationService;
import com.petcare.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationService authn;
    private final JwtService jwt;

    public AuthServiceImpl(AuthenticationService authn, JwtService jwt) {
        this.authn = authn;
        this.jwt = jwt;
    }

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest req) {
        // normaliza role (Owner/owner -> OWNER; default OWNER)
        String normalized = "OWNER";
        if (req.role() != null && !req.role().isBlank()) {
            try {
                normalized = req.role().trim().toUpperCase();
                User.Role.valueOf(normalized); // valida contra o enum
            } catch (IllegalArgumentException ignore) {
                normalized = "OWNER";
            }
        }

        // cria um novo RegisterRequest com a role normalizada
        RegisterRequest fixed = new RegisterRequest(
                req.name(),
                req.email(),
                req.password(),
                normalized
        );

        User u = authn.register(fixed);

        return new RegisterResponse(
                "Usuário registrado com sucesso",
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null
        );
    }

    @Override
    public LoginResponse login(String email, String password) {
        authn.authenticate(email, password);
        User u = authn.loadByEmail(email);
        String token = jwt.generateToken(email);

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(u.getEmail())
                .role(u.getRole() != null ? u.getRole().name() : null)
                .build();
    }
}
