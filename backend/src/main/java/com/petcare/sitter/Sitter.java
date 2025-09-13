package com.petcare.sitter;

import java.util.ArrayList;
import java.util.List;

import com.petcare.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("SITTER") // Este valor será salvo na coluna 'user_type' para identificar um Sitter
public class Sitter extends User {

    //para listar os serviços que o sitter oferece + preços
    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL, orphanRemoval = true )
    private List<SitterServicoPreco> servicosOferecidos = new ArrayList<>();

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

    // Getters e Setters
    public List<SitterServicoPreco> getServicosOferecidos() {
        return servicosOferecidos;
    }
    public void setServicosOferecidos(List<SitterServicoPreco> servicosOferecidos) {
        this.servicosOferecidos = servicosOferecidos;
    }
}