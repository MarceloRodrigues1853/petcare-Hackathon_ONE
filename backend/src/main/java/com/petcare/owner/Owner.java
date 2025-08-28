package com.petcare.owner;

import com.petcare.user.User;
import com.petcare.pet.Pet;
import com.petcare.servico.Servico;
import com.petcare.servico.PrecoServico;
import com.petcare.servico.StatusServico;
import com.petcare.baba.Baba;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "owners")
@Data
public class Owner extends User {

    @OneToMany(mappedBy = "dono", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();

    @OneToMany(mappedBy = "dono", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Servico> servicos = new ArrayList<>();

   

    public void addPet(Pet pet) {
        pets.add(pet);
        pet.setDono(this);
    }

    public void removePet(Pet pet) {
        pets.remove(pet);
        pet.setDono(null);
    }
}
