package com.petcare.servico;

<<<<<<< HEAD
public class ServicoResponse {

}
=======

import com.petcare.servico.Servico.Status;

import java.time.LocalDateTime;

public class ServicoResponse {

    private Long id;
    private Long donoId;
    private Long babaId;
    private Long petId;
    private Long precoServicoId;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Status status;

    public ServicoResponse() {}

    public ServicoResponse(Long id, Long donoId, Long babaId, Long petId, Long precoServicoId,
                           LocalDateTime dataInicio, LocalDateTime dataFim, Status status) {
        this.id = id;
        this.donoId = donoId;
        this.babaId = babaId;
        this.petId = petId;
        this.precoServicoId = precoServicoId;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDonoId() { return donoId; }
    public void setDonoId(Long donoId) { this.donoId = donoId; }

    public Long getBabaId() { return babaId; }
    public void setBabaId(Long babaId) { this.babaId = babaId; }

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }

    public Long getPrecoServicoId() { return precoServicoId; }
    public void setPrecoServicoId(Long precoServicoId) { this.precoServicoId = precoServicoId; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}

>>>>>>> 2113f9d (Resolvendo conflitos do Git. Complemento da entidade Servico)
