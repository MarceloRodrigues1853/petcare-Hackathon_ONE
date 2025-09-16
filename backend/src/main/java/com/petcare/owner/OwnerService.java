package com.petcare.owner;

import com.petcare.dto.OwnerDTO;
import com.petcare.dto.PetDTO;
import com.petcare.dto.UpdateOwnerRequest;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<OwnerDTO> findAll() {
        return ownerRepository.findAll().stream()
                .map(this::toOwnerDTO)
                .collect(Collectors.toList());
    }

    public OwnerDTO findById(Long id) {
        return ownerRepository.findById(id)
                .map(this::toOwnerDTO)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + id));
    }

    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public OwnerDTO update(Long id, UpdateOwnerRequest request) {
        // Buscamos o User geral, pois Owner pode não ter todos os campos
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setName(request.name());
        user.setEmail(request.email());

        if (request.password() != null && !request.password().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        User updatedUser = userRepository.save(user);
        // Garantimos que estamos a devolver um Owner
        Owner updatedOwner = ownerRepository.findById(updatedUser.getId()).get();
        return toOwnerDTO(updatedOwner);
    }
    
    private OwnerDTO toOwnerDTO(Owner owner) {
        List<PetDTO> petDTOs = owner.getPets().stream()
            .map(pet -> new PetDTO(pet.getId(), pet.getNome(), pet.getEspecie(), pet.getIdade()))
            .collect(Collectors.toList());

        return new OwnerDTO(owner.getId(), owner.getName(), owner.getEmail(), petDTOs);
    }
}