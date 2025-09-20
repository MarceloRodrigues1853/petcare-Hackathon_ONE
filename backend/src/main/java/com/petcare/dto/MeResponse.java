// src/main/java/com/petcare/dto/MeResponse.java
package com.petcare.dto;

import com.petcare.user.User;

public record MeResponse(
        Long id,
        String name,
        String email,
        String role,
        String status
) {
    public static MeResponse from(User u) {
        return new MeResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null,
                u.getStatus() != null ? u.getStatus().name() : null
        );
    }
}
