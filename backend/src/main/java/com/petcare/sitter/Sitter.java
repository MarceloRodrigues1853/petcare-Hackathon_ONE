package com.petcare.sitter;

import com.petcare.user.User;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SITTER") // Este valor será salvo na coluna 'user_type' para identificar um Sitter
public class Sitter extends User {

    // Construtor vazio é necessário para o JPA
    public Sitter() {
        super(); // Chama o construtor da classe pai
        this.setRole(Role.SITTER); // Define a role padrão para esta classe
    }

    // Construtor para criar um novo Sitter com dados
    public Sitter(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.SITTER); // Passa os dados para o construtor da classe pai
    }

    // Aqui você pode adicionar campos e métodos específicos apenas para Sitters
    // Ex: private String bio;
}