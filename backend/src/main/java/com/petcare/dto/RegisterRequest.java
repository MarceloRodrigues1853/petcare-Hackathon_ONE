// src/main/java/com/petcare/dto/RegisterRequest.java
package com.petcare.dto;

import com.petcare.user.Role;

public record RegisterRequest(
        String name,
        String email,
        String password,
        Role role // OWNER / SITTER / ADMIN
) {}
