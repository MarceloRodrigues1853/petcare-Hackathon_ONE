package com.petcare.servico;

public class ServicoResponse {

    private Long id;
    private String descricao;

    public ServicoResponse() {}

    public ServicoResponse(Long id, String descricao) {
        this.id = id;
        this.descricao = descricao;
    }

    public Long getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }
}
