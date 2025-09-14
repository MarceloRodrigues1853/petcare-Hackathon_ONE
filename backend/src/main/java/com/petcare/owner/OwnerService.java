package com.petcare.owner;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;


@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder; 

    // Construtor atualizado
    public OwnerService(OwnerRepository ownerRepository, PasswordEncoder passwordEncoder) {
        this.ownerRepository = ownerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<OwnerResponse> listarTodos() {
        return ownerRepository.findAll().stream()
                .map(o -> new OwnerResponse(o.getId(), o.getName(), o.getEmail()))
                .collect(Collectors.toList());
    }

    public OwnerResponse buscarPorId(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    public OwnerResponse criar(OwnerRequest request) {
        // Correção aplicada
        Owner owner = new Owner(request.getName(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
        ownerRepository.save(owner);
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    public OwnerResponse atualizar(Long id, OwnerRequest request) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        owner.setName(request.getName());
        owner.setEmail(request.getEmail());
        // Correção aplicada
        owner.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        ownerRepository.save(owner);
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    public void deletar(Long id) {
        ownerRepository.deleteById(id);
    }
}