package com.petcare.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository users;

    public UserDetailsServiceImpl(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // no nosso caso username == email
        User u = users.findByEmail(username.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // autoridade padrão no formato ROLE_*
        List<GrantedAuthority> auths =
                List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()));

        return org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail())
                .password(u.getPasswordHash())
                .authorities(auths)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
