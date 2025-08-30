package com.petcare.sitter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;

@RestController
@RequestMapping("/sitters")
public class SitterController {

    private final SitterService sitterService;

    public SitterController(SitterService sitterService) {
        this.sitterService = sitterService;
    }

    @GetMapping("/{key}")
    public ResponseEntity<SitterResponse> getProfile(@PathVariable String key) {
        Sitter sitter = sitterService.getProfile(key);
        return ResponseEntity.ok(toResponse(sitter));
    }

    @PutMapping("/{key}")
    public ResponseEntity<SitterResponse> updateProfile(@PathVariable String key,
                                                        @RequestBody SitterRequest request) {
        Sitter updated = sitterService.updateProfile(key, request);
        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<Void> deleteProfile(@PathVariable String key) {
        sitterService.deleteProfile(key);
        return ResponseEntity.noContent().build();
    }

    // ==== mapper Sitter -> SitterResponse (tolerante a nomes de métodos) ====
    private SitterResponse toResponse(Sitter s) {
        Long id = (Long) tryCall(s, "getId", Long.class, null);
        String name = (String) tryCall(s, "getName", String.class, null);
        String email = (String) tryCall(s, "getEmail", String.class, null);
        String phone = (String) tryCall(s, "getPhone", String.class, null);
        String bio = (String) tryCall(s, "getBio", String.class, null);

        // Se sua classe SitterResponse tiver outro construtor, ajuste aqui.
        return new SitterResponse(id, name, email, phone, bio);
    }

    private Object tryCall(Object target, String methodName, Class<?> returnType, Object defaultVal) {
        try {
            Method m = target.getClass().getMethod(methodName);
            Object val = m.invoke(target);
            if (val == null) return defaultVal;
            if (!returnType.isInstance(val)) return defaultVal;
            return val;
        } catch (Exception ignored) {
            return defaultVal;
        }
    }
}
