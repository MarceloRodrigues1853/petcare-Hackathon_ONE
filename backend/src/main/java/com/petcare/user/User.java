package com.petcare.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

<<<<<<< HEAD
@Entity
@Table(name = "users")
=======
@Entity @Table(name="users")
>>>>>>> main
@Data
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

<<<<<<< HEAD
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
=======
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
>>>>>>> main
  private Long id;

  @NotBlank
  private String name;

<<<<<<< HEAD
  @Email
  @Column(unique = true, nullable = false)
=======
  @Email @Column(unique = true, nullable = false)
>>>>>>> main
  private String email;

  @NotBlank
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  private Role role;

  public static String hash(String raw) {
    return new BCryptPasswordEncoder().encode(raw);
  }
<<<<<<< HEAD

  // ===== getters/setters explícitos (blindam o build no Docker) =====
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

  public Role getRole() { return role; }
  public void setRole(Role role) { this.role = role; }
=======
>>>>>>> main
}
