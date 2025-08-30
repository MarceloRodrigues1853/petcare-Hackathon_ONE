package com.petcare.auth;

import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.AuthenticationService;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final AuthenticationService authn;
    private final JwtService jwt;

    public AuthService(UserRepository users, AuthenticationService authn, JwtService jwt) {
        this.users = users;
        this.authn = authn;
        this.jwt = jwt;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest req) {
        // cria usuário (AuthenticationService lida com hash/salto/role etc)
        User u = authn.register(req);
        // apenas mensagem, pois RegisterResponse(String message)
        return new RegisterResponse("Usuário registrado com sucesso: " + u.getEmail());
    }

    public LoginResponse login(String email, String password) {
        User u = authn.authenticate(email, password);
        String token = jwt.generateToken(u.getEmail());
        return new LoginResponse(token);
    }
}
