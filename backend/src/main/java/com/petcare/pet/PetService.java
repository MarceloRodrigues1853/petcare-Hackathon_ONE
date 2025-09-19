package com.petcare.pet;

import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import com.petcare.config.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final OwnerRepository ownerRepository;

    /* Utilitário: pega o e-mail do usuário logado e resolve o Owner */
    private Owner currentOwner() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        if (email == null) {
            throw new ResourceNotFoundException("Usuário autenticado não encontrado.");
        }
        return ownerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Owner não encontrado para e-mail: " + email));
    }

    /* Lista apenas os pets do usuário logado */
    @Transactional(readOnly = true)
    public List<PetResponse> listarPetsDoUsuarioLogado() {
        Owner owner = currentOwner();
        return petRepository.findByOwnerId(owner.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PetResponse buscarPorId(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + id));
        return toResponse(pet);
    }

    @Transactional
    public PetResponse criar(PetRequest req) {
        Owner owner = (req.getOwnerId() != null)
                ? ownerRepository.findById(req.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner não encontrado: " + req.getOwnerId()))
                : currentOwner();

        Pet pet = new Pet();
        pet.setName(req.getNome());          // entidade usa "name"
        pet.setEspecie(req.getEspecie());
        pet.setIdade(req.getIdade());
        pet.setOwner(owner);

        pet = petRepository.save(pet);
        return toResponse(pet);
    }

    @Transactional
    public PetResponse atualizar(Long id, PetRequest req) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + id));

        if (req.getNome() != null)    pet.setName(req.getNome());       // nome (DTO) -> name (entidade)
        if (req.getEspecie() != null) pet.setEspecie(req.getEspecie());
        if (req.getIdade() != null)   pet.setIdade(req.getIdade());

        if (req.getOwnerId() != null) {
            Owner owner = ownerRepository.findById(req.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner não encontrado: " + req.getOwnerId()));
            pet.setOwner(owner);
        }

        pet = petRepository.save(pet);
        return toResponse(pet);
    }

    @Transactional
    public void deletar(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + id));
        petRepository.delete(pet);
    }

    /* ==== DTO mappers ==== */
    private PetResponse toResponse(Pet p) {
        return new PetResponse(
                p.getId(),
                p.getName(),           // entidade -> DTO.nome
                p.getEspecie(),
                p.getIdade(),
                p.getOwner() != null ? p.getOwner().getId() : null
        );
    }
}
