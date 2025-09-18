package com.petcare.pet;

import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import com.petcare.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final OwnerRepository ownerRepository;

    public List<PetResponse> listarPetsDoUsuarioLogado() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return petRepository.findByOwnerId(user.getId()).stream()
                .map(p -> new PetResponse(p.getId(), p.getNome(), p.getEspecie(), p.getIdade(), p.getOwner().getId()))
                .collect(Collectors.toList());
    }

    public PetResponse buscarPorId(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        // Adicionar verificação de segurança seria ideal aqui
        return new PetResponse(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade(), pet.getOwner().getId());
    }

    @Transactional
    public PetResponse criar(PetRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getId() != request.ownerId()) {
            throw new SecurityException("Um usuário não pode criar pets para outro.");
        }

        Owner owner = ownerRepository.findById(request.ownerId())
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        Pet pet = new Pet();
        pet.setNome(request.nome());
        pet.setEspecie(request.especie());
        pet.setIdade(request.idade());
        pet.setOwner(owner);
        
        Pet savedPet = petRepository.save(pet);

        return new PetResponse(savedPet.getId(), savedPet.getNome(), savedPet.getEspecie(), savedPet.getIdade(), owner.getId());
    }

    @Transactional
    public PetResponse atualizar(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (pet.getOwner().getId() != user.getId()) {
             throw new SecurityException("Um usuário não pode atualizar pets de outro.");
        }

        Owner owner = ownerRepository.findById(request.ownerId())
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        pet.setNome(request.nome());
        pet.setEspecie(request.especie());
        pet.setIdade(request.idade());
        pet.setOwner(owner);

        petRepository.save(pet);

        return new PetResponse(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade(), owner.getId());
    }

    @Transactional
    public void deletar(Long id) {
        petRepository.findById(id).ifPresent(pet -> {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (pet.getOwner().getId() != user.getId()) {
                throw new SecurityException("Um usuário não pode deletar pets de outro.");
            }
            petRepository.deleteById(id);
        });
    }
}