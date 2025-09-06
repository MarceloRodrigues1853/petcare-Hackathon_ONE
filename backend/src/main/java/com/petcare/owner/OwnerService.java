package com.petcare.owner;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.petcare.user.User.Role;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder;

    // MÉTODO CORRIGIDO / ADICIONADO
    public List<Owner> findAll() {
        return ownerRepository.findAll();
    }

    // MÉTODO CORRIGIDO / ADICIONADO
    public Owner findById(Long id) {
        return ownerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Owner não encontrado com o id: " + id));
    }

    @Transactional
    public Owner save(OwnerRequest request) {
        Owner owner = new Owner();
        owner.setName(request.name());
        owner.setEmail(request.email());
        owner.setRole(Role.OWNER);
        owner.setPasswordHash(passwordEncoder.encode(request.password()));
        return ownerRepository.save(owner);
    }

    @Transactional
    public Owner update(Long id, OwnerRequest request) {
        Owner owner = ownerRepository.getReferenceById(id);
        owner.setName(request.name());
        owner.setEmail(request.email());

        if (request.password() != null && !request.password().isBlank()) {
            owner.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        return owner;
    }

    public void delete(Long id) {
        if (!ownerRepository.existsById(id)) {
            throw new EntityNotFoundException("Owner não encontrado com o id: " + id);
        }
        ownerRepository.deleteById(id);
    }
}

