package com.petcare.agendamento;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AgendamentoRequest {

    @JsonProperty("ownerId")
    private Long ownerId;

    @JsonProperty("sitterId")
    private Long sitterId;

    @JsonProperty("petId")
    private Long petId;

    @JsonProperty("sitterServicoPrecoId")
    private Long sitterServicoPrecoId;

    @JsonProperty("dataInicio")
    private LocalDateTime dataInicio;

    @JsonProperty("dataFim")
    private LocalDateTime dataFim;

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
