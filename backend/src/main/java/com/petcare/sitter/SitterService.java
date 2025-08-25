package com.petcare.sitter;

import com.petcare.dto.RegisterResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SitterService {

    private final SitterRepository sitterRepository;

    // Ver perfil do sitter autenticado
    public SitterResponse getProfile(String email) {
        Sitter sitter = sitterRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Sitter não encontrado"));

        return new SitterResponse(
                sitter.getName(),
                sitter.getEmail()
        );
    }

    // Atualizar perfil
    public SitterResponse updateProfile(String email, SitterRequest request) {
        Sitter sitter = sitterRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Sitter não encontrado"));

        sitter.setName(request.name());
        sitter.setEmail(request.email());
        // senha: deixar para depois pois exige logica

        Sitter updated = sitterRepository.save(sitter);

        return new SitterResponse(
                updated.getName(),
                updated.getEmail()
        );
    }

    // Excluir perfil
    public void deleteProfile(String email) {
        Sitter sitter = sitterRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Sitter não encontrado"));
        sitterRepository.delete(sitter);
    }
}

