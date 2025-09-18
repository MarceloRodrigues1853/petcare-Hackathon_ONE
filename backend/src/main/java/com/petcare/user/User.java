package com.petcare.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.petcare.agendamento.Agendamento;
import com.petcare.pet.Pet;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class User implements UserDetails {

    public enum Role { ADMIN, OWNER, SITTER }
    public enum Status { PENDING, APPROVED, REJECTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status = Status.APPROVED; // Padrão para novos usuários

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("owner-pets")
    private List<Pet> pets = new ArrayList<>();
    
    @OneToMany(mappedBy = "owner")
    @JsonManagedReference("owner-agendamentos")
    private List<Agendamento> agendamentosComoOwner = new ArrayList<>();

    @OneToMany(mappedBy = "sitter")
    @JsonManagedReference("sitter-agendamentos")
    private List<Agendamento> agendamentosComoSitter = new ArrayList<>();

    public User(String name, String email, String passwordHash, Role role) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    // --- Implementação do UserDetails ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(new SimpleGrantedAuthority("ROLE_" + role.name())); }
    @Override
    public String getPassword() { return passwordHash; }
    @Override
    public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}