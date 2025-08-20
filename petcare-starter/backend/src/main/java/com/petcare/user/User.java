package com.petcare.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity @Table(name="users")
@Getter @Setter
public class User {
  public enum Role { OWNER, SITTER, ADMIN }
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @NotBlank private String name;
  @Email @Column(unique = true, nullable = false) private String email;
  @NotBlank private String passwordHash;
  @Enumerated(EnumType.STRING) private Role role = Role.OWNER;
  public static String hash(String raw) { return new BCryptPasswordEncoder().encode(raw); }
}
