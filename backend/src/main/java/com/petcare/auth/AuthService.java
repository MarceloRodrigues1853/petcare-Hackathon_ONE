package com.petcare.auth;

import com.petcare.user.User;
import com.petcare.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public Object register(Object reqObj) {
        // espera RegisterRequest, mas usa reflection simples pra evitar dependência direta
        com.petcare.dto.RegisterRequest req = (com.petcare.dto.RegisterRequest) reqObj;

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        User u = new User();
        u.setEmail(req.getEmail());
        u.setName(req.getName());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        // se houver campo role no User, defina o padrão aqui (ex: USER)
        userRepository.save(u);
        String token = jwtService.generateToken(u.getEmail());
        return java.util.Map.of("token", token);
    }

    public Object login(String email, String rawPassword) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));
        if (!passwordEncoder.matches(rawPassword, u.getPassword())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        String token = jwtService.generateToken(u.getEmail());
        return java.util.Map.of("token", token);
    }
}
