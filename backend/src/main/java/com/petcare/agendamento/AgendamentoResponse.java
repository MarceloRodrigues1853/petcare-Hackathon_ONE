package com.petcare.agendamento;

import java.time.LocalDateTime;

public class AgendamentoResponse {
    private Long id;
    private Long ownerId;
    private Long sitterId;
    private Long petId;
    private Long sitterServicoPrecoId;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Agendamento.Status status;

    public AgendamentoResponse(Agendamento agendamento) {
        this.id = agendamento.getId();
        this.ownerId = agendamento.getOwner().getId();
        this.sitterId = agendamento.getSitter().getId();
        this.petId = agendamento.getPet().getId();
        this.sitterServicoPrecoId = agendamento.getSitterServicoPreco().getId();
        this.dataInicio = agendamento.getDataInicio();
        this.dataFim = agendamento.getDataFim();
        this.status = agendamento.getStatus();
    }

    // Getters
    public Long getId() { return id; }
    public Long getOwnerId() { return ownerId; }
    public Long getSitterId() { return sitterId; }
    public Long getPetId() { return petId; }
    public Long getSitterServicoPrecoId() { return sitterServicoPrecoId; }
    public LocalDateTime getDataInicio() { return dataInicio; }
    public LocalDateTime getDataFim() { return dataFim; }
    public Agendamento.Status getStatus() { return status; }
}
