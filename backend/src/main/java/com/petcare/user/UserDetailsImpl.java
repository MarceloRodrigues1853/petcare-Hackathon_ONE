package com.petcare.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {

    private final User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // usamos email como identificador
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // pode personalizar depois
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // pode personalizar depois
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // pode personalizar depois
    }

    @Override
    public boolean isEnabled() {
        return true; // pode personalizar depois
    }

    public User getUser() {
        return user;
    }
}
