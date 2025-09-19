package com.petcare.user;

/**
 * Enum para representar os diferentes status de um usuário ou agendamento.
 */
public enum Status {
    // Para sitters que ainda não foram avaliados
    PENDING,

    // Para sitters que foram aceitos na plataforma
    APPROVED,

    // Para sitters que foram recusados
    REJECTED,

    // Para usuários ativos em geral
    ACTIVE,

    // Para usuários inativos ou banidos
    INACTIVE,
    
    // Para agendamentos
    SCHEDULED, // Agendado
    COMPLETED, // Concluído
    CANCELLED  // Cancelado
}