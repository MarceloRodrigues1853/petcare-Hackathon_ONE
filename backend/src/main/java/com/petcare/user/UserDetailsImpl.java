package com.petcare.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {
  private final Long id;
  private final String email;
  private final String passwordHash;
  private final String role;    // OWNER | SITTER | ADMIN
  private final String status;  // APPROVED, DISABLED, BLOCKED...

  public UserDetailsImpl(Long id, String email, String passwordHash, String role) {
    this(id, email, passwordHash, role, "APPROVED");
  }
  public UserDetailsImpl(Long id, String email, String passwordHash, String role, String status) {
    this.id = id; this.email = email; this.passwordHash = passwordHash; this.role = role; this.status = status;
  }

  public Long getId() { return id; }
  public String getRoleRaw() { return role; }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
   String r = (role == null || role.isBlank()) ? "OWNER" : role;
   return List.of(new SimpleGrantedAuthority("ROLE_" + r)); // ← ESSENCIAL
  }

  @Override public String getPassword() { return passwordHash == null ? "" : passwordHash; }
  @Override public String getUsername() { return email; }
  @Override public boolean isAccountNonExpired() { return true; }
  @Override public boolean isAccountNonLocked() { return !"BLOCKED".equalsIgnoreCase(status); }
  @Override public boolean isCredentialsNonExpired() { return true; }
  @Override public boolean isEnabled() { return !"DISABLED".equalsIgnoreCase(status); }
}
