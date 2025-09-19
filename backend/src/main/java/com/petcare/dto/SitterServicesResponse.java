package com.petcare.sitter.dto;

import java.util.List;

/** Resposta agregada para popular a tela de “Meus Serviços”. */
public record SitterServicesResponse(
        List<ServiceWithPrice> items
) {
    public record ServiceWithPrice(
            Long servicoPrecoId,   // null se não estiver ativo
            Long servicoId,
            String servicoNome,
            boolean active,
            Double price           // null se inativo
    ) {}
}
