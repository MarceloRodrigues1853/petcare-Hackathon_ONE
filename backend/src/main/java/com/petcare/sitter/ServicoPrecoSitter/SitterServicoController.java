package com.petcare.sitter.ServicoPrecoSitter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sitters/{sitterId}/servicos")
public class SitterServicoController {

    private final PrecoPorSitterService precoServicoService;

    public SitterServicoController(PrecoPorSitterService precoServicoService) {
        this.precoServicoService = precoServicoService;
    }

    @PostMapping
    public ResponseEntity<PrecoResponse> cadastrarServico(
                        @PathVariable Long sitterId,
                        @RequestBody PrecoRequest request) {

        PrecoResponse response = precoServicoService.criarParaSitter(request, sitterId);
        return ResponseEntity.ok(response);
    }
