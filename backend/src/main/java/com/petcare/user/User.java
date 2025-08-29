package com.petcare.user;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password; // <== padroniza como "password"

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // getters/setters padrão
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    // ---- aliases para compatibilidade com código antigo ----
    public String getPasswordHash() { return password; }
    public void setPasswordHash(String hash) { this.password = hash; }

    // helper legado: permite chamar User.hash("senha") em código antigo
    public static String hash(String rawPassword) {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
            .encode(rawPassword);
    }
}
