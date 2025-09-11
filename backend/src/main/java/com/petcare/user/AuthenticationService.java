package com.petcare.user;

import com.petcare.dto.RegisterRequest;
import com.petcare.owner.Owner;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.petcare.user.User;
import com.petcare.sitter.Sitter;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest req) {
        User.Role role = Optional.ofNullable(req.getRole()).orElse(User.Role.OWNER);
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        //SWITCH para decidir qual objeto criar com base na role
        User newUser = switch (role) {
            case OWNER -> new Owner(req.getName(), req.getEmail(), encodedPassword);
            case SITTER -> new Sitter(req.getName(), req.getEmail(), encodedPassword);
            default -> throw new IllegalArgumentException("Cadastro para a role '" + role + "' não é suportado.");
        }; //apos criar a classe admin, podemos colocar admin aqui
        
        return userRepository.save(newUser);

        /* 
        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRole(role);
        return userRepository.save(u);*/
    }

    public void authenticate(String email, String rawPassword) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        if (!passwordEncoder.matches(rawPassword, u.getPasswordHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
    }
}
