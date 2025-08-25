package com.petcare.dto;

public record LoginRequest(
        String email,
        String password
) {
}

//DTO para receber credenciais de login