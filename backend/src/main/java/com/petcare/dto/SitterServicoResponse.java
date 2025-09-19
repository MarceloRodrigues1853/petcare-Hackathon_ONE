package com.petcare.sitter.dto;

public record SitterServicoResponse(
        Long id,
        String servicoNome,
        Double valor
) {}
