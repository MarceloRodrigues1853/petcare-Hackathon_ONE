package com.petcare.sitter.dto;

import java.time.LocalDateTime;

public record SitterAppointmentResponse(
        Long id,
        String clientName,
        String petName,
        String service,
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        String status,
        Double valor
) {
}
