package com.petcare.sitter;

//dto para entrada de dados - para cadastro e atualização
public record SitterRequest(
        String name,
        String email,
        String senha
) {}
