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
public class AuthServiceImpl implements AuthService {

    private final AuthenticationService authn;
    private final JwtService jwt;
    private final UserRepository users;

    public AuthServiceImpl(AuthenticationService authn, JwtService jwt, UserRepository users) {
        this.authn = authn;
        this.jwt = jwt;
        this.users = users;
    }

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest req) {
        User u = authn.register(req);
        String email = (u != null && u.getEmail() != null) ? u.getEmail() : req.getEmail();
        return new RegisterResponse("Usuário registrado com sucesso", email);
    }

    @Override
    public LoginResponse login(String email, String password) {
        authn.authenticate(email, password);

        String token = jwt.generateToken(email);

        String role = null;
        User u = users.findByEmail(email).orElse(null);
        if (u != null && u.getRole() != null) {
            role = u.getRole().name(); // 👈 enum para String
        }

        return new LoginResponse(token, "Bearer", email, role);
    }
}
