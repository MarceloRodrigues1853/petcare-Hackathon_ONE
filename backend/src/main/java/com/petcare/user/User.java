package com.petcare.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity @Table(name="users")
@Data
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String name;

  @Email @Column(unique = true, nullable = false)
  private String email;

  @NotBlank
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  private Role role;

  public static String hash(String raw) {
    return new BCryptPasswordEncoder().encode(raw);
  }
}
