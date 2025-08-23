package com.petcare.user;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registra um novo usuário no sistema.
     * Valida se o email já existe, aplica hash na senha e salva no banco.
     */
    public RegisterResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));

        try {
            if (req.role() != null) {
                user.setRole(User.Role.valueOf(req.role().toUpperCase()));
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Papel de usuário inválido");
        }

        userRepository.save(user);

        return new RegisterResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    /**
     * Autentica o usuário com email e senha.
     * Gera e retorna o token JWT se as credenciais forem válidas.
     */
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
