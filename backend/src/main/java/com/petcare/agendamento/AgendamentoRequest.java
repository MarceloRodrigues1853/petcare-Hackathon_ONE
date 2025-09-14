package com.petcare.agendamento;

import java.time.LocalDateTime;

public class AgendamentoRequest {
    private Long ownerId;
    private Long sitterId;
    private Long petId;
    private Long sitterServicoPrecoId;

    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
/* */
    public AgendamentoRequest() {}

        public AgendamentoRequest(Long ownerId, Long sitterId, Long petId, Long sitterServicoPrecoId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        this.ownerId = ownerId;
        this.sitterId = sitterId;
        this.petId = petId;
        this.sitterServicoPrecoId = sitterServicoPrecoId;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }


    // Getters e Setters
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public Long getSitterId() { return sitterId; }
    public void setSitterId(Long sitterId) { this.sitterId = sitterId; }

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }

    public Long getSitterServicoPrecoId() { return sitterServicoPrecoId; }
    public void setSitterServicoPrecoId(Long sitterServicoPrecoId) { this.sitterServicoPrecoId = sitterServicoPrecoId; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
}
