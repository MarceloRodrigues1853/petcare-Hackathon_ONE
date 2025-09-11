package com.petcare.owner;

import com.petcare.user.User.Role;

public record OwnerResponse(
    Long id,
    String name,
    String email,
    Role role
) {
    // Construtor adicional para facilitar a conversão da entidade Owner para a resposta
    public OwnerResponse(Owner owner) {
        this(owner.getId(), owner.getName(), owner.getEmail(), owner.getRole());
    }
}
