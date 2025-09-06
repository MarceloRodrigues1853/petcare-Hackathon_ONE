package com.petcare.precoServico;

import jakarta.persistence.*;

@Entity
@Table(name = "precos_servico")
public class PrecoServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private Double valor;

    public PrecoServico() {}

    public PrecoServico(String descricao, Double valor) {
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
