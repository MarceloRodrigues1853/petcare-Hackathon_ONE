package com.petcare.servico;

import jakarta.persistence.*;
import java.util.Objects;

/**
 * Representa um TIPO de serviço oferecido na plataforma (ex: Passeio, Hospedagem).
 * Esta é uma entidade de catálogo, geralmente gerenciada por um administrador.
 */
@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String descricao;

    // Construtor vazio para o JPA
    public Servico() {
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    // --- equals() e hashCode() são importantes para o bom funcionamento das entidades ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Servico servico = (Servico) o;
        return Objects.equals(id, servico.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

