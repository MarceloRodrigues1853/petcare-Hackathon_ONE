package com.petcare.owner.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OwnerAppointmentSummary(
        Long id,
        String petName,
        String serviceName,
        LocalDateTime startDate,
        BigDecimal price
) {}