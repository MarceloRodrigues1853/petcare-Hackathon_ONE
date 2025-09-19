package com.petcare.owner.dto;

import java.math.BigDecimal;
import java.util.List;

public record OwnerDashboardResponse(
        long totalPets,
        long totalAgendamentos,
        BigDecimal valorAPagar,
        List<OwnerAppointmentSummary> proximosAgendamentos
) {}