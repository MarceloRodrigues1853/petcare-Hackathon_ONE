package com.petcare.owner;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;

    // Ver perfil do owner autenticado
    public OwnerResponse getProfile(String email) {
        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Owner não encontrado"));

        return new OwnerResponse(
                owner.getName(),
                owner.getEmail()
        );
    }

    // Atualizar perfil
    public OwnerResponse updateProfile(String email, OwnerRequest request) {
        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Owner não encontrado"));

        owner.setName(request.name());
        owner.setEmail(request.email());
        // senha 

        Owner updated = ownerRepository.save(owner);

        return new OwnerResponse(
                updated.getName(),
                updated.getEmail()
        );
    }

    // Excluir perfil
    public void deleteProfile(String email) {
        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Owner não encontrado"));

        ownerRepository.delete(owner);
    }
}
