package com.petcare.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pet")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @PostMapping
    public ResponseEntity<PetResponse> createPet(@RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.createPet(request));
    }

    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> updatePet(@PathVariable Long id, @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.updatePet(id, request));
    }

    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PetResponse>> listPets(@PathVariable Long ownerId) {
        return ResponseEntity.ok(petService.listPetsByOwner(ownerId));
    }
}
