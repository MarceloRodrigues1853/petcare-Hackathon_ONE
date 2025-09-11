package com.petcare.owner;

import java.util.ArrayList;
import java.util.List;

import com.petcare.pet.Pet;
import com.petcare.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("OWNER") // Este valor será salvo na coluna 'user_type' para identificar um Owner
public class Owner extends User {

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true) //add para ao excluir o owner, os seus pets tbm sejam excluidos juntos
    List<Pet> pets = new ArrayList<>();

    // Construtor vazio é necessário para o JPA
    public Owner() {
        super(); // Chama o construtor da classe pai
        this.setRole(Role.OWNER); // Define a role padrão para esta classe
    }

    // Construtor para criar um novo Owner com dados
    public Owner(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.OWNER); // Passa os dados para o construtor da classe pai
    }

    //Getters e Setters
    public List<Pet> getPets() {
        return pets;   
    }

    public void setPets(List<Pet> pets) {
        this.pets = pets;
    }
}