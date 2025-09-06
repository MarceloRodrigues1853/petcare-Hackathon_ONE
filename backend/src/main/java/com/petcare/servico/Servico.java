package com.petcare.servico;

import com.petcare.pet.Pet;
import com.petcare.precoServico.PrecoServico;
import com.petcare.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "servicos")
public class Servico {

    public enum Status {
        Agendado,
        EmAndamento,
        Concluido,
        Cancelado
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dono_id", nullable = false)
    private User dono;

    @ManyToOne
    @JoinColumn(name = "baba_id", nullable = false)
    private User baba;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "preco_servico_id", nullable = false)
    private PrecoServico precoServico;

    @Column(nullable = false)
    private LocalDateTime dataInicio;

    @Column(nullable = false)
    private LocalDateTime dataFim;

    @Enumerated(EnumType.STRING)
    private Status status;

    public Servico() {}

    public Servico(User dono, User baba, Pet pet, PrecoServico precoServico, LocalDateTime dataInicio, LocalDateTime dataFim, Status status) {
        this.dono = dono;
        this.baba = baba;
        this.pet = pet;
        this.precoServico = precoServico;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.status = status;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getDono() { return dono; }
    public void setDono(User dono) { this.dono = dono; }

    public User getBaba() { return baba; }
    public void setBaba(User baba) { this.baba = baba; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }

    public PrecoServico getPrecoServico() { return precoServico; }
    public void setPrecoServico(PrecoServico precoServico) { this.precoServico = precoServico; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
