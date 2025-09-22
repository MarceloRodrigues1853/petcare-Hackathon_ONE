package com.petcare.sitter;

import com.petcare.config.exception.ResourceNotFoundException;
import com.petcare.sitter.dto.SitterServiceSaveItem;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sitters/me/services")
@RequiredArgsConstructor
public class SitterMeServicesController {

    private final UserRepository userRepository;
    private final SitterRepository sitterRepository;
    private final SitterServicoPrecoService service;

    private Long currentSitterId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        if (email == null) {
            throw new ResourceNotFoundException("Usuário autenticado não encontrado.");
        }

        // 1) pega o usuário
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + email));

        // 2) localiza o Sitter pelo e-mail (recomendado) — precise ter findByEmail no SitterRepository
        Sitter sitter = sitterRepository.findByEmail(u.getEmail())
                // fallback: se seu modelo usa mesmo ID para User e Sitter
                .orElseGet(() -> sitterRepository.findById(u.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Sitter não encontrado para o usuário: " + email)));

        return sitter.getId();
    }

    @PutMapping
    @PreAuthorize("hasAuthority('SITTER')")
    @Operation(summary = "Salva/atualiza serviços e preços do sitter autenticado")
    public List<SitterServicoPrecoController.SspDTO> saveMyServices(@RequestBody List<SitterServiceSaveItem> items) {
        Long sitterId = currentSitterId();
        return service.saveForSitter(sitterId, items);
    }

    // Opcional: facilitar o front para GET "me" também
    @GetMapping
    @PreAuthorize("hasAuthority('SITTER')")
    @Operation(summary = "Lista serviços e preços do sitter autenticado")
    public List<SitterServicoPrecoController.SspDTO> listMyServices() {
        Long sitterId = currentSitterId();
        return service.listForSitter(sitterId);
    }
}
