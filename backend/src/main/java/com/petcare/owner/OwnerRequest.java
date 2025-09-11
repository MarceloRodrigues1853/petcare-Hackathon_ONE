package com.petcare.owner;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Usar 'record' é a forma moderna no Java para criar DTOs.
// Ele automaticamente cria os campos, construtor, getters (ex: name()), equals, etc.
public record OwnerRequest(
    @NotBlank
    String name,

    @NotBlank
    @Email
    String email,

    @Size(min = 6)
    String password
) {}
