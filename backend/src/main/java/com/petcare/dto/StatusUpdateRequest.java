package com.petcare.dto;

public record StatusUpdateRequest(
    String status // Espera receber "APPROVED" ou "REJECTED"
) {}