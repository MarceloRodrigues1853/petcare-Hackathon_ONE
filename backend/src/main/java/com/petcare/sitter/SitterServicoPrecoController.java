// src/main/java/com/petcare/sitter/SitterServicoPrecoController.java
package com.petcare.sitter;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sitters/{sitterId}/services")
@RequiredArgsConstructor
public class SitterServicoPrecoController {

    private final SitterServicoPrecoRepository repo;
    private final SitterRepository sitterRepository;

    public record SspDTO(Long id, String servico, BigDecimal valor) {}

    @GetMapping
    public List<SspDTO> list(@PathVariable Long sitterId) {
        // opcional: validar se o sitter existe
        sitterRepository.findById(sitterId).orElseThrow();

        return repo.findBySitterId(sitterId).stream()
                .map(ssp -> new SspDTO(
                        ssp.getId(),
                        (ssp.getServico() != null ? ssp.getServico().getDescricao() : null),
                        ssp.getValor()))
                .toList();
    }
}
