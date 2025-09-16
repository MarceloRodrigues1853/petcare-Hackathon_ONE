package com.petcare.pet;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.petcare.owner.Owner;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pets")
@Getter // Gera todos os getters
@Setter // Gera todos os setters
@NoArgsConstructor // Gera o construtor vazio
@AllArgsConstructor // Gera o construtor com todos os campos
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String especie;

    private Integer idade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonBackReference("owner-pets")
    private Owner owner;
    
    // O Lombok gera os construtores e getters/setters automaticamente.
    // Não precisamos de os escrever manualmente.
}