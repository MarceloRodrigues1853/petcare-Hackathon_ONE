package com.petcare.auth;

import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.AuthenticationService;
import com.petcare.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationService authn;
    private final JwtService jwt;

    public AuthService(AuthenticationService authn, JwtService jwt) {
        this.authn = authn;
        this.jwt = jwt;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest req) {
        User u = authn.register(req);
        String email;
        try {
            email = (String) u.getClass().getMethod("getEmail").invoke(u);
        } catch (Exception ignore) {
            email = "novo usuário";
        }
        return new RegisterResponse("Usuário registrado com sucesso: " + email);
    }

    public LoginResponse login(String email, String password) {
        authn.authenticate(email, password);
        String token = jwt.generateToken(email);
        return new LoginResponse(token);
    }
}
