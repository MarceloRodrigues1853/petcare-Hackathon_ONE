// backend/src/main/java/com/petcare/dto/PetDTO.java
package com.petcare.dto;

public record PetDTO(
    Long id,
    String nome,
    String especie,
    Integer idade
) {}