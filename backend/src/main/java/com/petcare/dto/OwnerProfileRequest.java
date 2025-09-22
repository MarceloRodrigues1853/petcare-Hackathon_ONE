// src/main/java/com/petcare/owner/dto/OwnerProfileRequest.java
package com.petcare.owner.dto;

public record OwnerProfileRequest(
        String name,
        String phone,
        String bio
) {}