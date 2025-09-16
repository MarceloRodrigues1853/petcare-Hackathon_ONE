package com.petcare.pet;

public record PetResponse(
    Long id,
    String nome,
    String especie,
    Integer idade,
    Long ownerId
) {}