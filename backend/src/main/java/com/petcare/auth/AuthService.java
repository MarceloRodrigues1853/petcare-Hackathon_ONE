package com.petcare.auth;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.Role;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // Registro de novo usuário
    public RegisterResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));

        if (req.role() != null) {
            Role role = Arrays.stream(Role.values())
                    .filter(r -> r.name().equalsIgnoreCase(req.role()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Papel de usuário inválido"));
            user.setRole(role);
        }

        userRepository.save(user);

        return new RegisterResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    // Autenticação de login
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        String token = jwtService.generateToken(user);
        return new LoginResponse(token);
    }
}
