package com.petcare.owner.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OwnerAppointmentResponse(
        Long id,
        String sitterName,
        String petName,
        String service,
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        String status,
        Double valor
) {}