package com.petcare.auth;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.Role;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public RegisterResponse register(RegisterRequest req) {
    userRepository.findByEmail(req.email()).ifPresent(u -> {
      throw new RuntimeException("Email já cadastrado");
    });

    User u = new User();
    u.setName(req.name());
    u.setEmail(req.email());
    u.setPasswordHash(User.hash(req.password()));
    try {
      u.setRole(req.role() != null ? Role.valueOf(req.role().toUpperCase()) : Role.USER);
    } catch (Exception ignored) {
      u.setRole(Role.USER);
    }

    userRepository.save(u);
    return new RegisterResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name());
  }

  public LoginResponse login(LoginRequest req) {
    User u = userRepository.findByEmail(req.email())
        .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

    if (!encoder.matches(req.password(), u.getPasswordHash())) {
      throw new RuntimeException("Email ou senha inválidos");
    }

    String token = jwtService.generateToken(
        u.getEmail(),
        Map.of("role", u.getRole() != null ? u.getRole().name() : "USER")
    );
    return new LoginResponse(token);
  }
}
