// src/main/java/com/petcare/sitter/Sitter.java
package com.petcare.sitter;

import com.petcare.user.Role;   // <-- IMPORTANTE
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

    public Sitter() {
        super();
        this.setRole(Role.SITTER);
    }

    public Sitter(String name, String email, String passwordHash) {
        super(name, email, passwordHash, Role.SITTER);
    }

    public Sitter(String name, String email, String passwordHash, String phone, String bio) {
        super(name, email, passwordHash, Role.SITTER);
        this.phone = phone;
        this.bio = bio;
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
