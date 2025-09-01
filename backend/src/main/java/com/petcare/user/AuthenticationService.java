package com.petcare.user;

import com.petcare.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public AuthenticationService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public User register(RegisterRequest req) {
        User u = new User();

        // name/email/password via getters padrão
        String name = invokeString(req, "getName");
        String email = invokeString(req, "getEmail");
        String raw   = invokeString(req, "getPassword");

        // setName / setEmail
        invokeVoid(u, "setName", String.class, name);
        invokeVoid(u, "setEmail", String.class, email);

        // set hash (tenta setPasswordHash depois setPassword)
        String hash = encoder.encode(raw);
        if (!invokeVoid(u, "setPasswordHash", String.class, hash)) {
            invokeVoid(u, "setPassword", String.class, hash);
        }

        // tenta setar role (se existir)
        try {
            invokeVoid(u, "setRole", Role.class, Role.USER);
        } catch (Exception ignored) {}

        return users.save(u);
    }

    public User authenticate(String email, String rawPassword) {
        User u = users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        String stored = null;
        Object got = tryInvoke(u, "getPasswordHash");
        if (got == null) got = tryInvoke(u, "getPassword");
        if (got != null) stored = String.valueOf(got);

        if (stored == null || !encoder.matches(rawPassword, stored)) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        return u;
    }

    // helpers reflexivos
    private static Object tryInvoke(Object t, String m) {
        try { return t.getClass().getMethod(m).invoke(t); } catch (Exception e) { return null; }
    }
    private static String invokeString(Object t, String m) {
        Object o = tryInvoke(t, m);
        return o == null ? null : String.valueOf(o);
    }
    private static boolean invokeVoid(Object t, String m, Class<?> p, Object v) {
        try { t.getClass().getMethod(m, p).invoke(t, v); return true; } catch (Exception e) { return false; }
    }
}
