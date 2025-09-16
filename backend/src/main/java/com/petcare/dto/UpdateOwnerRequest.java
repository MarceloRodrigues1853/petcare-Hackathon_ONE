// backend/src/main/java/com/petcare/dto/UpdateOwnerRequest.java
package com.petcare.dto;

// Este record representa o JSON que o frontend envia para atualizar um Owner
public record UpdateOwnerRequest(
    String name,
    String email,
    String password // Pode ser opcional dependendo da lógica
) {}