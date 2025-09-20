// src/main/java/com/petcare/dto/UserResponse.java
package com.petcare.dto;

import com.petcare.user.User;

public record UserResponse(
        Long id,
        String name,
        String email,
        String role
) {
    public static UserResponse from(User u) {
        return new UserResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null
        );
    }
}
