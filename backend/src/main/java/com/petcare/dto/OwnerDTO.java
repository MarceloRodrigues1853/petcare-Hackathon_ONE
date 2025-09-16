// backend/src/main/java/com/petcare/dto/OwnerDTO.java
package com.petcare.dto;

import java.util.List;

// Usamos um 'record' para uma classe de dados simples e imutável
public record OwnerDTO(
    Long id,
    String name,
    String email,
    List<PetDTO> pets // Também vamos precisar de um PetDTO
) {}