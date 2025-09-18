// backend/src/main/java/com/petcare/pet/PetRepository.java
package com.petcare.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    // Este método buscará todos os pets que pertencem a um ownerId específico
    List<Pet> findByOwnerId(Long ownerId);
}