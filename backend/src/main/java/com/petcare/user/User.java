package com.petcare.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidade User que representa a tabela de usuários no banco de dados.
 */
@Data // Anotação do Lombok: cria getters, setters, toString, equals e hashCode
@NoArgsConstructor // Anotação do Lombok: cria um construtor sem argumentos
@AllArgsConstructor // Anotação do Lombok: cria um construtor com todos os argumentos
@Entity
@Table(name = "users") // Define o nome da tabela no banco de dados
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Salva o nome do enum (ex: "ADMIN") no banco, em vez do número (0)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @CreationTimestamp // Define automaticamente a data e hora de criação
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp // Define automaticamente a data e hora da última atualização
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

}