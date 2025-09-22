// src/main/java/com/petcare/owner/dto/OwnerAppointmentCreateRequest.java
package com.petcare.owner.dto;

import java.time.LocalDateTime;

public record OwnerAppointmentCreateRequest(
        Long petId,
        Long sitterId,
        Long sitterServicoPrecoId,
        LocalDateTime startDate,   // obrigatório
        LocalDateTime endDate      // opcional; se null, assumimos +1h
) {}

