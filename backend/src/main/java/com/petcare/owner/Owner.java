package com.petcare.owner;

import com.petcare.user.User;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("OWNER") // Este valor será salvo na coluna 'user_type' para identificar um Owner
public class Owner extends User {

    // Construtor vazio é necessário para o JPA
    public Owner() {
        super(); // Chama o construtor da classe pai
        this.setRole(Role.OWNER); // Define a role padrão para esta classe
    }

    // Construtor para criar um novo Owner com dados
    public Owner(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.OWNER); // Passa os dados para o construtor da classe pai
    }

    // Aqui você pode adicionar campos e métodos específicos apenas para Owners
    // Ex: @OneToMany List<Pet> pets;
}