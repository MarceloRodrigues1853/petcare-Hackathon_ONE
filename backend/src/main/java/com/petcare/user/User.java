package com.petcare.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "passwordHash")                  // evita logar o hash
@EqualsAndHashCode(onlyExplicitlyIncluded = true)    // evita usar o hash no equals/hashCode
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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // não serializa para JSON
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @PrePersist
    void prePersist() {
        if (this.role == null) this.role = Role.OWNER;
    }

    //construtor
    public User(String name, String email, String passwordHash, Role role) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }
}
