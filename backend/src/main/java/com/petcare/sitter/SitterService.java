package com.petcare.sitter;

import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.Optional;

@Service
public class SitterService {

    private final SitterRepository repo;

    public SitterService(SitterRepository repo) {
        this.repo = repo;
    }

    // ==== Métodos já existentes ====
    public Sitter create(Sitter sitter) {
        return repo.save(sitter);
    }

    public Sitter update(Long id, Sitter updated) {
        try {
            var f = updated.getClass().getDeclaredField("id");
            f.setAccessible(true);
            f.set(updated, id);
        } catch (Exception ignored) {}
        return repo.save(updated);
    }

    // ==== Métodos esperados pelo controller ====

    /** Busca por email (se houver findByEmail) ou tenta interpretar como ID numérico. */
    public Sitter getProfile(String key) {
        // tenta findByEmail(String)
        Sitter byEmail = (Sitter) invokeRepo("findByEmail", new Class[]{String.class}, new Object[]{key})
                .map(this::unwrapOptional).orElse(null);
        if (byEmail != null) return byEmail;

        // tenta findById(Long)
        try {
            Long id = Long.valueOf(key);
            Sitter byId = (Sitter) invokeRepo("findById", new Class[]{Long.class}, new Object[]{id})
                    .map(this::unwrapOptional).orElse(null);
            if (byId != null) return byId;
        } catch (NumberFormatException ignored) {}

        throw new IllegalArgumentException("Sitter não encontrado");
    }

    /** Atualiza perfil a partir de um request arbitrário (SitterRequest) via reflexão. */
    public Sitter updateProfile(String key, Object sitterRequest) {
        Sitter current = getProfile(key);

        // tenta mapear campos comuns do request para o entity
        copyIfPresent(sitterRequest, "getName", current, "setName");
        copyIfPresent(sitterRequest, "getEmail", current, "setEmail");
        copyIfPresent(sitterRequest, "getPhone", current, "setPhone");
        copyIfPresent(sitterRequest, "getBio", current, "setBio");

        return repo.save(current);
    }

    /** Deleta por email (se houver) ou por id numérico. */
    public void deleteProfile(String key) {
        // tenta buscar entity e deletar
        Sitter s = getProfile(key);
        try {
            Method m = repo.getClass().getMethod("delete", Object.class);
            m.invoke(repo, s);
            return;
        } catch (Exception ignored) {}

        // fallback: deleteById(Long)
        try {
            Long id = Long.valueOf(key);
            Method m = repo.getClass().getMethod("deleteById", Object.class);
            m.invoke(repo, id);
        } catch (Exception e) {
            throw new IllegalStateException("Não foi possível deletar o perfil", e);
        }
    }

    // ==== helpers de reflexão ====

    private Optional<?> invokeRepo(String method, Class<?>[] types, Object[] args) {
        try {
            Method m = repo.getClass().getMethod(method, types);
            Object result = m.invoke(repo, args);
            return Optional.ofNullable(result);
        } catch (NoSuchMethodException e) {
            return Optional.empty();
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao chamar " + method + " no repository", e);
        }
    }

    private Object unwrapOptional(Object o) {
        if (o instanceof Optional<?> opt) {
            return opt.orElse(null);
        }
        return o;
    }

    private void copyIfPresent(Object src, String getter, Object dst, String setter) {
        try {
            Method g = src.getClass().getMethod(getter);
            Object val = g.invoke(src);
            if (val != null) {
                // tenta achar setter com o tipo exato; se não achar, procura por String
                Method s;
                try {
                    s = dst.getClass().getMethod(setter, val.getClass());
                } catch (NoSuchMethodException e) {
                    s = dst.getClass().getMethod(setter, String.class);
                    if (!(val instanceof String)) val = String.valueOf(val);
                }
                s.invoke(dst, val);
            }
        } catch (NoSuchMethodException ignored) {
            // getter não existe no request; tudo bem
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao copiar campo via reflexão (" + getter + ")", e);
        }
    }
}
