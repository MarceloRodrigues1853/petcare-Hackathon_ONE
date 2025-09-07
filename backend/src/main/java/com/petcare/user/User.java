package com.petcare.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // A tabela física no banco de dados
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Estratégia: Todos os filhos na mesma tabela
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING) // Coluna que diferencia Owner de Sitter
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "passwordHash")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    public enum Role { OWNER, SITTER, ADMIN }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    @EqualsAndHashCode.Include
    private String email;

    @Column(nullable = false, name = "password_hash")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Construtor principal que as classes filhas (Owner, Sitter) irão chamar
    public User(String name, String email, String passwordHash, Role role) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }
}

