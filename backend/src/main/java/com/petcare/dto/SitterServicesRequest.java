package com.petcare.sitter.dto;

import java.util.List;

public record SitterServicesRequest(
        List<SitterServiceItem> items
) {}
