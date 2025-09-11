package com.petcare.sitter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sitters") // Boa prática usar um prefixo como /api
public class SitterController {

    private final SitterService sitterService;

    public SitterController(SitterService sitterService) {
        this.sitterService = sitterService;
    }

    // --- ENDPOINTS PARA GERENCIAR O PERFIL DO SITTER ---

    @GetMapping("/{sitterId}")
    public ResponseEntity<SitterProfileResponse> getSitterProfile(@PathVariable Long sitterId) {
        Sitter sitter = sitterService.getSitterProfile(sitterId);
        return ResponseEntity.ok(toProfileResponse(sitter));
    }

    @PutMapping("/{sitterId}")
    public ResponseEntity<SitterProfileResponse> updateSitterProfile(@PathVariable Long sitterId, @RequestBody SitterProfileRequest request) {
        Sitter updatedSitter = sitterService.updateSitterProfile(sitterId, request);
        return ResponseEntity.ok(toProfileResponse(updatedSitter));
    }

    // --- ENDPOINTS PARA GERENCIAR OS SERVIÇOS E PREÇOS DO SITTER ---

    @GetMapping("/{sitterId}/servicos")
    public ResponseEntity<List<SitterServicoResponse>> getServicosDoSitter(@PathVariable Long sitterId) {
        List<SitterServicoPreco> servicos = sitterService.getServicosDoSitter(sitterId);
        List<SitterServicoResponse> response = servicos.stream()
                .map(this::toServicoResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sitterId}/servicos")
    public ResponseEntity<SitterServicoResponse> addServicoParaSitter(@PathVariable Long sitterId, @RequestBody SitterServicoRequest request) {
        SitterServicoPreco novoServico = sitterService.addServicoParaSitter(sitterId, request);
        URI location = URI.create(String.format("/api/sitters/%d/servicos/%d", sitterId, novoServico.getId()));
        return ResponseEntity.created(location).body(toServicoResponse(novoServico));
    }

    @DeleteMapping("/{sitterId}/servicos/{servicoPrecoId}")
    public ResponseEntity<Void> deleteServicoDoSitter(@PathVariable Long sitterId, @PathVariable Long servicoPrecoId) {
        sitterService.deleteServicoDoSitter(sitterId, servicoPrecoId);
        return ResponseEntity.noContent().build();
    }


    // --- MAPPERS SIMPLES (sem reflexão) ---

    private SitterProfileResponse toProfileResponse(Sitter sitter) {
        // Crie um record/classe DTO SitterProfileResponse com os campos que você quer retornar
        return new SitterProfileResponse(sitter.getId(), sitter.getName(), sitter.getEmail());
    }

    private SitterServicoResponse toServicoResponse(SitterServicoPreco servicoPreco) {
        // Crie um record/classe DTO SitterServicoResponse
        return new SitterServicoResponse(
                servicoPreco.getId(),
                servicoPreco.getServico().getDescricao(), // Pega a descrição do serviço (ex: "Passeio")
                servicoPreco.getValor()
        );
    }
}

