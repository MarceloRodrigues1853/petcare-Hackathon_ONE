package com.petcare.owner;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    // Ver perfil - apenas dono autenticado
    @PreAuthorize("hasRole('OWNER')") 
    @GetMapping("/profile")
    public ResponseEntity<OwnerResponse> getProfile(Authentication authentication) {
        OwnerResponse response = ownerService.getProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    // Editar perfil - apenas dono autenticado
    @PreAuthorize("hasRole('OWNER')")
    @PutMapping("/profile")
    public ResponseEntity<OwnerResponse> updateProfile(
            Authentication authentication,
            @RequestBody OwnerRequest request) {
        OwnerResponse response = ownerService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    // Excluir perfil - dono ou admin
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(Authentication authentication) {
        ownerService.deleteProfile(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
