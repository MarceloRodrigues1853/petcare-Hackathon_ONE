package com.petcare.sitter;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.petcare.user.User;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
// CORREÇÃO: Sem @Table e com @DiscriminatorValue para a estratégia SINGLE_TABLE
@DiscriminatorValue("SITTER")
@NoArgsConstructor
public class Sitter extends User {

    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("sitter-servicos")
    private List<SitterServicoPreco> servicosOferecidos = new ArrayList<>();

    public Sitter(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.SITTER);
    }

    // Getters e Setters para servicosOferecidos
    public List<SitterServicoPreco> getServicosOferecidos() {
        return servicosOferecidos;
    }

    public void setServicosOferecidos(List<SitterServicoPreco> servicosOferecidos) {
        this.servicosOferecidos = servicosOferecidos;
    }
}