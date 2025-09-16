package com.petcare.financeiro;

import java.math.BigDecimal;

public record AdminFaturamentoResponse(
    BigDecimal faturamentoTotalNoMes, //faturamento total no mês do site
    BigDecimal comissaoPlataformaNoMes, // faturamento que fica para o site (20%)
    int totalAgendamentosConcluidos
) {

}
