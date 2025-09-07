package com.petcare.sitter;

// Este record é usado para receber os dados de atualização do perfil do Sitter.
// Inclua aqui todos os campos que o Sitter pode editar no seu perfil.
public record SitterProfileRequest(
        String name,
        String email
        // Adicione outros campos como bio, phone, etc., se necessário.
) {
}
