package com.petcare.pet;

public class PetRequest {
    private String nome;
    private String especie;
    private Integer idade; 
    private Long ownerId;

    public PetRequest() {}

    public PetRequest(String nome, String especie, Integer idade, Long ownerId) {
        this.nome = nome;
        this.especie = especie;
        this.idade = idade;
        this.ownerId = ownerId;
    }

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }

    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}
