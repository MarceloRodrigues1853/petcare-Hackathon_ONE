package com.petcare.sitter;

import com.fasterxml.jackson.annotation.JsonBackReference; // <-- IMPORT NECESSÁRIO
import com.petcare.servico.Servico;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sitter_servicos_precos")
public class SitterServicoPreco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sitter_id", nullable = false)
    @JsonBackReference("sitter-servicos") // <-- ANOTAÇÃO ADICIONADA
    private Sitter sitter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    // Construtor vazio
    public SitterServicoPreco() {
    }

    // Getters e Setters (sem alteração)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Sitter getSitter() {
        return sitter;
    }

    public void setSitter(Sitter sitter) {
        this.sitter = sitter;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}