package com.petcare.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Implementação independente da entidade User
 * (não depende de getters da sua classe de domínio).
 */
public class UserDetailsImpl implements UserDetails {

    private final Long id;
    private final String username;      // email
    private final String passwordHash;  // hash
    private final String roleName;      // ex: USER/ADMIN

    public UserDetailsImpl(Long id, String username, String passwordHash, String roleName) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.roleName = roleName == null ? "USER" : roleName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
    }

    public Long getId() { return id; }

    @Override public String getPassword() { return passwordHash; }
    @Override public String getUsername() { return username; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
