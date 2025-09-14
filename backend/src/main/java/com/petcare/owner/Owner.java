package com.petcare.owner;

import java.util.ArrayList;
import java.util.List;

import com.petcare.agendamento.Agendamento;
import com.petcare.pet.Pet;
import com.petcare.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("OWNER")
public class Owner extends User {

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Pet> pets = new ArrayList<>();
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Agendamento> agendamentos = new ArrayList<>();

    public Owner() {
        super();
        this.setRole(Role.OWNER);
    }

    public Owner(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.OWNER);
    }

    // Gerenciamento de Pets
    public void addPet(Pet pet) {
        pets.add(pet);
        pet.setOwner(this); 
    }

    public void removePet(Pet pet) {
        pets.remove(pet);
        pet.setOwner(null); 
    }
    
    // Gerenciamento de Agendamentos 
    public void addAgendamento(Agendamento agendamento) {
        agendamentos.add(agendamento);
        agendamento.setOwner(this); 
    }
    
    public void removeAgendamento(Agendamento agendamento) {
        agendamentos.remove(agendamento);
        agendamento.setOwner(null); 
    }

    // --- Getters e Setters ---
    public List<Pet> getPets() {
        return pets;    
    }

    public void setPets(List<Pet> pets) {
        this.pets = pets;
    }
    
    public List<Agendamento> getAgendamentos() {
        return agendamentos;
    }
    public void setAgendamentos(List<Agendamento> agendamentos) {
        this.agendamentos = agendamentos;
    }
}