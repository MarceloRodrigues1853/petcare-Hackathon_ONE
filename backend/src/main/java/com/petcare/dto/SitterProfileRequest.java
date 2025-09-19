package com.petcare.sitter.dto;

public record SitterProfileRequest(
        String name,
        String email,
        String phone,   // mantenha mesmo que sua entidade não tenha ainda (pode ficar ignorado)
        String bio      // idem
) {}
