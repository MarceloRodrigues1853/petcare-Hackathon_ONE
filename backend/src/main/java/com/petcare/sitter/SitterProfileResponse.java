package com.petcare.sitter;

// Este record é usado para enviar os dados do perfil do Sitter para o frontend.
// Retorne apenas os dados que são seguros e necessários para a visualização.
public record SitterProfileResponse(
        Long id,
        String name,
        String email
) {
}
