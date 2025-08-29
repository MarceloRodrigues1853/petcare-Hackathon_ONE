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

<<<<<<< HEAD
import java.util.Arrays;

=======
>>>>>>> main
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

<<<<<<< HEAD
    // Registro de novo usuário
=======

    //Registra um novo usuário .
    //Valida se o email já existe, aplica hash na senha e salva no banco.
>>>>>>> main
    public RegisterResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));

<<<<<<< HEAD
        if (req.role() != null) {
            Role role = Arrays.stream(Role.values())
                    .filter(r -> r.name().equalsIgnoreCase(req.role()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Papel de usuário inválido"));
            user.setRole(role);
=======
        try {
            if (req.role() != null) {
                user.setRole(Role.valueOf(req.role().toUpperCase()));
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Papel de usuário inválido");
>>>>>>> main
        }

        userRepository.save(user);

        return new RegisterResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

<<<<<<< HEAD
    // Autenticação de login
=======

     //LOGIN: Autentica o usuário com email e senha.
    //Gera e retorna o token JWT se as credenciais forem válidas.
>>>>>>> main
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
