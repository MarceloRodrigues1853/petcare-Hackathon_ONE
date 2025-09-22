// src/main/java/com/petcare/owner/dto/OwnerProfileResponse.java
package com.petcare.owner.dto;

import com.petcare.user.User;

public record OwnerProfileResponse(
        String name,
        String email,
        String phone,
        String bio
) {
    public static OwnerProfileResponse from(User u) {
        return new OwnerProfileResponse(
                u.getName(),
                u.getEmail(),
                u.getPhone(),
                u.getBio()
        );
    }
}
