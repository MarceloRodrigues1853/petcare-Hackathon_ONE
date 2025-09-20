// src/main/java/com/petcare/user/AuthenticationService.java
package com.petcare.user;

import com.petcare.dto.RegisterRequest;
import com.petcare.owner.Owner;
import com.petcare.sitter.Sitter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest req) {
        Role role = (req.role() != null) ? req.role() : Role.OWNER;
        String encodedPassword = passwordEncoder.encode(req.password());

        User newUser = switch (role) {
            case OWNER -> new Owner(req.name(), req.email(), encodedPassword);
            case SITTER -> new Sitter(req.name(), req.email(), encodedPassword);
            case ADMIN  -> new User(req.name(), req.email(), encodedPassword, Role.ADMIN);
            default     -> throw new IllegalArgumentException("Cadastro para a role '" + role + "' não é suportado.");
        };

        // Opcional: já aprovar OWNER/ADMIN automaticamente
        if (role == Role.OWNER || role == Role.ADMIN) {
            newUser.setStatus(Status.APPROVED);
        }
        return userRepository.save(newUser);
    }

    public void authenticate(String email, String rawPassword) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        if (!passwordEncoder.matches(rawPassword, u.getPasswordHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
    }
}
