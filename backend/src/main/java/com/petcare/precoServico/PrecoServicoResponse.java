package com.petcare.precoServico;

public class PrecoServicoResponse {
    private Long id;
    private String descricao;
    private Double valor;

    public PrecoServicoResponse() {}

    public PrecoServicoResponse(Long id, String descricao, Double valor) {
        this.id = id;
        this.descricao = descricao;
        this.valor = valor;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
}
