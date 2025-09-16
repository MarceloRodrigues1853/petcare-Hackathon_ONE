package com.petcare.auth;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.user.AuthenticationService;
import com.petcare.user.JwtService;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationService authn;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void register(RegisterRequest req) { // Corrigido para retornar void
        authn.register(req);
    }

    public LoginResponse login(LoginRequest req) {
        authenticationManager.authenticate(
            // Corrigido para usar getters: getEmail() e getPassword()
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado após autenticação"));

        String token = jwtService.generateToken(user);
        String role = user.getRole() != null ? user.getRole().name() : null;

        // O seu DTO LoginResponse precisa ter o campo `user` para funcionar com o AuthContext
        // Vamos assumir que ele está assim: new LoginResponse(token, user)
        // Se não, precisamos de um LoginResponseDTO que inclua o UserDTO
        return new LoginResponse(user.getId(), token, role, user.getName(), user.getEmail());
    }
}