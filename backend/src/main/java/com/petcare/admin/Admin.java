package com.petcare.admin;

import com.petcare.user.User;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    // Construtor vazio para o JPA
    public Admin() {
        super();
        this.setRole(Role.ADMIN);
    }

    // Construtor para criar um novo Admin com dados
    public Admin(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.ADMIN);
    }
}
