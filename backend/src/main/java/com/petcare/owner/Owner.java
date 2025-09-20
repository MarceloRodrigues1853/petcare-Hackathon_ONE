// src/main/java/com/petcare/owner/Owner.java
package com.petcare.owner;

import java.util.ArrayList;
import java.util.List;

import com.petcare.pet.Pet;
import com.petcare.user.Role;   // <-- IMPORTANTE
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

    public Owner() {
        super();
        this.setRole(Role.OWNER);
    }

    public Owner(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.OWNER);
    }

    public List<Pet> getPets() {
        return pets;
    }
    public void setPets(List<Pet> pets) {
        this.pets = pets;
    }
}
