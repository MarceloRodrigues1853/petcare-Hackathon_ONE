package com.petcare.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository users;

    public UserDetailsServiceImpl(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = users.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String email = safeString(get(u, "getEmail"));
        String hash  = safeString(get(u, "getPasswordHash")); // tenta hash
        if (hash == null) hash = safeString(get(u, "getPassword")); // fallback
        String role  = null;
        try {
            Object r = u.getClass().getMethod("getRole").invoke(u);
            role = r == null ? null : r.toString();
        } catch (Exception ignored) {}

        return new UserDetailsImpl(email != null ? email : username, hash != null ? hash : "", role);
    }

    private static Object get(Object target, String method) {
        try {
            return target.getClass().getMethod(method).invoke(target);
        } catch (Exception e) {
            return null;
        }
    }

    private static String safeString(Object o) { return o == null ? null : String.valueOf(o); }
}
