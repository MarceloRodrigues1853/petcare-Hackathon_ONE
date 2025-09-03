package com.petcare.auth;

import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.AuthenticationService;
import com.petcare.user.User;
import lombok.RequiredArgsConstructor;                  // 👈 importa a anotação
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor                                // 👈 gera o construtor p/ os finals
public class AuthService {

    private final AuthenticationService authn;
    private final JwtService jwt;

    @Transactional
    public RegisterResponse register(RegisterRequest req) {
        User u = authn.register(req);
        String email = u.getEmail();                   // 👈 sem reflection
        return new RegisterResponse("Usuário registrado com sucesso: " + email);
    }

    public LoginResponse login(String email, String password) {
        authn.authenticate(email, password);           // 👈 garante que esse método existe
        String token = jwt.generateToken(email);
        return new LoginResponse(token);
    }
}
