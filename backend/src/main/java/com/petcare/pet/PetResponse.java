package com.petcare.pet;

public class PetResponse {
    private Long id;
    private String nome;
    private String especie;
    private Integer idade; 
    private Long ownerId;

    public PetResponse() {}

    public PetResponse(Long id, String nome, String especie, Integer idade, Long ownerId) {
        this.id = id;
        this.nome = nome;
        this.especie = especie;
        this.idade = idade;
        this.ownerId = ownerId;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
}
