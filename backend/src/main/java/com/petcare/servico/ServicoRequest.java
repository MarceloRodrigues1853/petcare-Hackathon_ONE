package com.petcare.servico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ServicoRequest {

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 100, message = "A descrição deve ter no máximo 100 caracteres")
    private String descricao;

    public ServicoRequest() {}

    public ServicoRequest(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
