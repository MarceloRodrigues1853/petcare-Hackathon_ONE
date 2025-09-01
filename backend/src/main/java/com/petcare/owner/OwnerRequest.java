
package com.petcare.owner;

//dto para entrada de dados - para cadastro e atualização
public record OwnerRequest(
        String name,
        String email,
        String password
) {}
