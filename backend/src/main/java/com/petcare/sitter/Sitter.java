package com.petcare.sitter;

import com.petcare.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SITTER")
public class Sitter extends User {

    @Column(name = "phone")
    private String phone;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    // Construtor vazio (necessário para o JPA)
    public Sitter() {
        super();
        this.setRole(Role.SITTER);
    }

    // <<< CORREÇÃO: ADICIONADO O CONSTRUTOR DE 3 ARGUMENTOS DE VOLTA >>>
    // Este construtor é usado pelo AuthenticationService
    public Sitter(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.SITTER);
    }

    // Construtor completo com 5 argumentos
    public Sitter(String name, String email, String passwordHash, String phone, String bio) {
        super(name, email, passwordHash, Role.SITTER);
        this.phone = phone;
        this.bio = bio;
    }

    // Getters e Setters
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}