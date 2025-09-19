package com.petcare.sitter.dto;

public record SitterServiceItem(
        Long id,            // id da tabela sitter_servicos_precos (pode ser null quando criar)
        Long servicoId,     // id da tabela servicos
        String servicoDescricao,
        Double valor        // preço praticado pelo sitter
) {}
