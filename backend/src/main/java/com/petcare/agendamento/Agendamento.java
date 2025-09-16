package com.petcare.agendamento;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.petcare.owner.Owner;
import com.petcare.pet.Pet;
import com.petcare.sitter.Sitter;
import com.petcare.sitter.SitterServicoPreco;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
@Getter
@Setter
@NoArgsConstructor
public class Agendamento {

    public enum Status {
        AGENDADO,
        EM_ANDAMENTO,
        CONCLUIDO,
        CANCELADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonBackReference("owner-agendamentos")
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sitter_id", nullable = false)
    @JsonBackReference("sitter-agendamentos")
    private Sitter sitter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sitter_servico_preco_id", nullable = false)
    private SitterServicoPreco sitterServicoPreco;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDateTime dataFim;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    // O Lombok gera o construtor vazio e todos os getters/setters.
}