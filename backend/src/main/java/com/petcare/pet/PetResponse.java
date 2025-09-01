package com.petcare.pet;

public class PetResponse {

    private Long id;
    private String nome;
    private String especie;
    private String raca;
    private Integer idade;
    private Long ownerId;

    public PetResponse(Long id, String nome, String especie, String raca, Integer idade, Long ownerId) {
        this.id = id;
        this.nome = nome;
        this.especie = especie;
        this.raca = raca;
        this.idade = idade;
        this.ownerId = ownerId;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEspecie() { return especie; }
    public String getRaca() { return raca; }
    public Integer getIdade() { return idade; }
    public Long getOwnerId() { return ownerId; }
}
