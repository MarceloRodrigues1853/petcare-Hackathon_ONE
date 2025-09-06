package com.petcare.precoServico;

public class PrecoServicoRequest {
    private String descricao;
    private Double valor;

    public PrecoServicoRequest() {}

    public PrecoServicoRequest(String descricao, Double valor) {
        this.descricao = descricao;
        this.valor = valor;
    }

    // Getters e Setters
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
}
