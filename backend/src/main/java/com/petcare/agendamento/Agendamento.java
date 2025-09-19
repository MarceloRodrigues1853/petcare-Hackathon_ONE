package com.petcare.agendamento;

import com.petcare.owner.Owner;
import com.petcare.pet.Pet;
import com.petcare.sitter.Sitter;
import com.petcare.sitter.SitterServicoPreco;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Representa a reserva/agendamento de um serviço específico,
 * conectando o Owner, o Sitter, o Pet e o serviço contratado.
 */
@Entity
@Table(name = "agendamentos")
public class Agendamento {

    public enum Status {
        PENDENTE,    // Adicionado
        CONFIRMADO,  // Adicionado
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
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sitter_id", nullable = false)
    private Sitter sitter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    // Esta é a ligação correta: o agendamento aponta para o serviço específico
    // que o Sitter oferece, que já contém o preço.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sitter_servico_preco_id", nullable = false)
    private SitterServicoPreco sitterServicoPreco;

    @Column(nullable = false)
    private LocalDateTime dataInicio;

    @Column(nullable = false)
    private LocalDateTime dataFim;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    // Construtor vazio para JPA
    public Agendamento() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Owner getOwner() { return owner; }
    public void setOwner(Owner owner) { this.owner = owner; }

    public Sitter getSitter() { return sitter; }
    public void setSitter(Sitter sitter) { this.sitter = sitter; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }

    public SitterServicoPreco getSitterServicoPreco() { return sitterServicoPreco; }
    public void setSitterServicoPreco(SitterServicoPreco sitterServicoPreco) { this.sitterServicoPreco = sitterServicoPreco; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}

