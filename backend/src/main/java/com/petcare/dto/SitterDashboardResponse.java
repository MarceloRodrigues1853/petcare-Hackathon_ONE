package com.petcare.sitter.dto;

// Este record representa os 3 cards principais do painel do Sitter
public record SitterDashboardResponse(
    long totalAgendamentos,
    double receitaDoMes,
    double suaAvaliacao // Usaremos um valor fixo por enquanto
) {}