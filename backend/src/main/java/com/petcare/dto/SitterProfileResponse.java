package com.petcare.sitter.dto;

public record SitterProfileResponse(
        Long id,
        String name,
        String email,
        String phone,   // pode vir null se não existir no entity
        String bio      // pode vir null se não existir no entity
) {}
