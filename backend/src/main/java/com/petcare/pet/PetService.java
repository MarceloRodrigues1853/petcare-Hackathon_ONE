package com.petcare.pet;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import lombok.RequiredArgsConstructor; // Usando Lombok para o construtor

@Service
@RequiredArgsConstructor // Anotação do Lombok que cria o construtor para nós
public class PetService {

    private final PetRepository petRepository;
    private final OwnerRepository ownerRepository;
    // O UserRepository não era necessário aqui

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

    public PetResponse criar(PetRequest request) {
        Owner owner = ownerRepository.findById(request.ownerId()) // Usando getter do record
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        // =======================================================
        // A CORREÇÃO FINAL ESTÁ AQUI
        // Usando o construtor vazio e setters, que é compatível com o Lombok
        // =======================================================
        Pet pet = new Pet();
        pet.setNome(request.nome());
        pet.setEspecie(request.especie());
        pet.setIdade(request.idade());
        pet.setOwner(owner);
        
        petRepository.save(pet);

        return new PetResponse(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade(), owner.getId());
    }

    public PetResponse atualizar(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));

        Owner owner = ownerRepository.findById(request.ownerId())
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        pet.setNome(request.nome());
        pet.setEspecie(request.especie());
        pet.setIdade(request.idade());
        pet.setOwner(owner);

        petRepository.save(pet);

        return new PetResponse(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade(), owner.getId());
    }

    public void deletar(Long id) {
        petRepository.deleteById(id);
    }
}