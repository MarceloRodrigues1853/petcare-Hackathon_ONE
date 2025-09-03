package com.petcare.auth;

import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.AuthenticationService;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationService authn;   // ainda usamos no register
    private final JwtService jwt;
    private final UserRepository userRepository;     // busca direta no JPA
    private final PasswordEncoder passwordEncoder;   // confere com BCrypt

    @Transactional
    public RegisterResponse register(RegisterRequest req) {
        User u = authn.register(req);
        return new RegisterResponse("Usuário registrado com sucesso: " + u.getEmail());
    }

    public LoginResponse login(String email, String rawPassword) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        String token = jwt.generateToken(user.getEmail());
        String role = user.getRole() != null ? user.getRole().name() : null;

        return new LoginResponse(token, role, user.getName(), user.getEmail());
    }
}
