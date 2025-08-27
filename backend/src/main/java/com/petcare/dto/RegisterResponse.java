package com.petcare.dto;

public record RegisterResponse(
        Long id,
        String name,
        String email,
        String role
) {
}

//DTO que retorna dados do usuário recém cadastrado