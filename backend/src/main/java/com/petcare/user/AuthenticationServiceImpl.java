package com.petcare.user;

import com.petcare.dto.RegisterRequest;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(UserRepository userRepository,
                                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public User register(RegisterRequest req) {
        // valida e-mail único
        userRepository.findByEmail(req.email()).ifPresent(u -> {
            throw new IllegalArgumentException("E-mail já cadastrado");
        });

        // normaliza role vinda do JSON (default OWNER)
        User.Role roleEnum = User.Role.OWNER;
        String r = req.role();
        if (r != null && !r.isBlank()) {
            try {
                roleEnum = User.Role.valueOf(r.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                roleEnum = User.Role.OWNER;
            }
        }

        // monta entidade
        User u = new User();
        u.setName(req.name());
        u.setEmail(req.email());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setRole(roleEnum);

        return userRepository.save(u);
    }

    @Override
    public void authenticate(String email, String rawPassword) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        if (!passwordEncoder.matches(rawPassword, u.getPasswordHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
    }

    @Override
    public User loadByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
}
