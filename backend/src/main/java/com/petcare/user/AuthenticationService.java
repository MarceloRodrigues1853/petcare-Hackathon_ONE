package com.petcare.user;

import com.petcare.dto.RegisterRequest;
import com.petcare.owner.Owner;
import com.petcare.sitter.Sitter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new IllegalArgumentException("O e-mail informado já está em uso.");
        }

        User.Role role = req.getRole();
        String hashedPassword = passwordEncoder.encode(req.getPassword());

        User newUser;
        if (role == User.Role.OWNER) {
            newUser = new Owner(req.getName(), req.getEmail(), hashedPassword);
        } else if (role == User.Role.SITTER) {
            newUser = new Sitter(req.getName(), req.getEmail(), hashedPassword);
            // Novos sitters devem começar como pendentes para aprovação do admin
            newUser.setStatus(User.Status.PENDING); 
        } else {
            // Registo de Admin ou outros tipos
            newUser = new User(req.getName(), req.getEmail(), hashedPassword, role);
        }

        return userRepository.save(newUser);
    }
}