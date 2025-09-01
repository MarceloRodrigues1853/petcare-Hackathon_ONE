package com.petcare.pet;

import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final OwnerRepository ownerRepository;

    public PetResponse createPet(PetRequest request) {
        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

        Pet pet = new Pet(request.getNome(), request.getEspecie(), request.getRaca(), request.getIdade(), owner);
        Pet saved = petRepository.save(pet);

        return new PetResponse(
                saved.getId(),
                saved.getNome(),
                saved.getEspecie(),
                saved.getRaca(),
                saved.getIdade(),
                owner.getId()
        );
    }

    public PetResponse updatePet(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));

        pet.setNome(request.getNome());
        pet.setEspecie(request.getEspecie());
        pet.setRaca(request.getRaca());
        pet.setIdade(request.getIdade());

        if (request.getOwnerId() != null) {
            Owner owner = ownerRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner não encontrado"));
            pet.setOwner(owner);
        }

        Pet updated = petRepository.save(pet);
        return new PetResponse(
                updated.getId(),
                updated.getNome(),
                updated.getEspecie(),
                updated.getRaca(),
                updated.getIdade(),
                updated.getOwner().getId()
        );
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }

    public List<PetResponse> listPetsByOwner(Long ownerId) {
        return petRepository.findByOwnerId(ownerId)
                .stream()
                .map(p -> new PetResponse(
                        p.getId(),
                        p.getNome(),
                        p.getEspecie(),
                        p.getRaca(),
                        p.getIdade(),
                        p.getOwner().getId()
                ))
                .collect(Collectors.toList());
    }
}
