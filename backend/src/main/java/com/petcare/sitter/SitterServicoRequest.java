package com.petcare.sitter;

import java.math.BigDecimal;

// Este record é usado para receber os dados de um novo serviço que o Sitter quer oferecer.
public record SitterServicoRequest(
        Long servicoId, // O ID do tipo de serviço (ex: 1 para "Passeio")
        BigDecimal valor // O preço que o Sitter cobrará por este serviço
) {
}
