package com.petcare.pet;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;


@Service
public class PetService {

    private final PetRepository petRepository;
    private final OwnerRepository ownerRepository;


    public PetService(PetRepository petRepository, OwnerRepository ownerRepository) {
        this.petRepository = petRepository;
        this.ownerRepository = ownerRepository;
    }

    public List<PetResponse> listarTodos() {
        return petRepository.findAll().stream()
                .map(p -> new PetResponse(p.getId(), p.getNome(), p.getEspecie(), p.getIdade(), p.getOwner().getId()))
                .collect(Collectors.toList());
    }

    public PetResponse buscarPorId(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        return new PetResponse(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade(), pet.getOwner().getId());
    }

    @Transactional
    public PetResponse criar(PetRequest request) {
        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        Pet pet = new Pet(request.getNome(), request.getEspecie(), request.getIdade(), owner);
        petRepository.save(pet);

        return new PetResponse(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade(), owner.getId());
    }

    @Transactional
    public PetResponse atualizar(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));

        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        pet.setNome(request.getNome());
        pet.setEspecie(request.getEspecie());
        pet.setIdade(request.getIdade());
        pet.setOwner(owner);

        petRepository.save(pet);

        return new PetResponse(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade(), owner.getId());
    }

    public void deletar(Long id) {
        petRepository.deleteById(id);
    }
}
