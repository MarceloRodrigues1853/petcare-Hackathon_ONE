package com.petcare.owner;

import com.petcare.user.User;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("OWNER")
@NoArgsConstructor
public class Owner extends User {
    public Owner(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.OWNER);
    }
}