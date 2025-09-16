package com.petcare.financeiro;

import java.math.BigDecimal;

public record SitterFaturamentoResponse(
    BigDecimal ganhosNoMes, // ganhos do Sitter no mês
    int totalAgendamentosConcluidos
) {

}
