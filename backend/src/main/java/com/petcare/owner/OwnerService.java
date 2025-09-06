package com.petcare.owner;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.petcare.user.User;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;

    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
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
        Owner owner = new Owner(request.getName(), request.getEmail(), User.hash(request.getPassword()));
        ownerRepository.save(owner);
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    public OwnerResponse atualizar(Long id, OwnerRequest request) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        owner.setName(request.getName());
        owner.setEmail(request.getEmail());
        owner.setPasswordHash(User.hash(request.getPassword()));

        ownerRepository.save(owner);
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    public void deletar(Long id) {
        ownerRepository.deleteById(id);
    }
}
