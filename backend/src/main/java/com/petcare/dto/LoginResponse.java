package com.petcare.dto;

public record LoginResponse(
        String token
) {
}

//DTO para retornar token JWT apos login
//token sera usado para autenticar em futuras requisições