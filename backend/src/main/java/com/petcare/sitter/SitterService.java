package com.petcare.sitter;

import org.springframework.stereotype.Service;

import java.lang.reflect.Field;

@Service
public class SitterService {

    private final SitterRepository repo;

    public SitterService(SitterRepository repo) {
        this.repo = repo;
    }

    public Sitter create(Sitter sitter) {
        return repo.save(sitter);
    }

    public Sitter update(Long id, Sitter updated) {
        // garante id no objeto e salva
        try {
            Field f = updated.getClass().getDeclaredField("id");
            f.setAccessible(true);
            f.set(updated, id);
        } catch (Exception ignored) {}
        return repo.save(updated);
    }
}
