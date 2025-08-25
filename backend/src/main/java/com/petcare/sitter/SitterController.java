package com.petcare.sitter;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sitter")
@RequiredArgsConstructor
public class SitterController {

    private final SitterService sitterService;

    // Ver perfil - apenas sitter autenticado
    @PreAuthorize("hasRole('SITTER')")
    @GetMapping("/profile")
    public ResponseEntity<SitterResponse> getProfile(Authentication authentication) {
        SitterResponse response = sitterService.getProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }


    // Editar perfil - apenas sitter autenticado
    @PreAuthorize("hasRole('SITTER')")
    @PutMapping("/profile")
    public ResponseEntity<SitterResponse> updateProfile(
            Authentication authentication,
            @RequestBody SitterRequest request) {
        SitterResponse response = sitterService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }


    // Excluir perfil - sitter ou admin
    @PreAuthorize("hasAnyRole('SITTER', 'ADMIN')")
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(Authentication authentication) {
        sitterService.deleteProfile(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}

