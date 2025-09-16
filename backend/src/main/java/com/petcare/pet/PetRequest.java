package com.petcare.pet;

// Usamos um record para um DTO simples
public record PetRequest(
    String nome,
    String especie,
    Integer idade,
    Long ownerId
) {}