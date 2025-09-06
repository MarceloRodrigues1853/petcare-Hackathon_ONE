package com.petcare.owner;

import com.petcare.pet.Pet;
import com.petcare.user.User;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "owners")
public class Owner extends User {

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();

    public Owner() {
        super();
        this.setRole(Role.OWNER); 
    }

    public Owner(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.OWNER);
    }

    public List<Pet> getPets() { return pets; }
    public void setPets(List<Pet> pets) { this.pets = pets; }
}
