package com.petcare.owner.dto;

import java.time.LocalDateTime;

public record OwnerAppointmentResponse(
        Long id,
        String sitterName,
        String petName,
        String service,            // vindo do SitterServicoPreco (ex.: "BABA", "PASSEIO", etc.)
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        String status,
        Double valor
) {}
