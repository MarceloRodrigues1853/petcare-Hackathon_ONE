package com.petcare.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public AuthenticationService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public User register(com.petcare.dto.RegisterRequest req) {
        User u = new User();
        u.setName(req.name());
        u.setEmail(req.email());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setRole(Role.USER); // <-- usar o enum top-level
        return users.save(u);
    }

    public User authenticate(String email, String rawPassword) {
        User u = users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        if (!encoder.matches(rawPassword, u.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        return u;
    }
}
