package com.petcare.sitter;

import java.math.BigDecimal;

// Este record é usado para enviar a lista de serviços que um Sitter oferece para o frontend.
public record SitterServicoResponse(
        Long id, // O ID da relação Sitter-Serviço-Preço (não do serviço em si)
        String descricao, // A descrição do serviço (ex: "Passeio", "Hospedagem")
        BigDecimal valor
) {
}
