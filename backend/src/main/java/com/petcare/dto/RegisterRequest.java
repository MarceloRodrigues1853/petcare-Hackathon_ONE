package com.petcare.dto;

public record RegisterRequest(
        String name,
        String email,
        String password,
        String role
) {
}

//DTO para receber dados de registro do novo usuário