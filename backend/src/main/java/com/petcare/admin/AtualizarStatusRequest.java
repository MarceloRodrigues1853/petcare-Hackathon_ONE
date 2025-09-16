package com.petcare.admin;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.EnumDeserializer;
import com.petcare.agendamento.Agendamento;


public class AtualizarStatusRequest {

    @JsonProperty("novoStatus")
    @JsonDeserialize(using = EnumDeserializer.class)
    private Agendamento.Status novoStatus;

    public AtualizarStatusRequest() {}

    public Agendamento.Status getNovoStatus() {
        return novoStatus;
    }

    public void setNovoStatus(Agendamento.Status novoStatus) {
        this.novoStatus = novoStatus;
    }
        
}
