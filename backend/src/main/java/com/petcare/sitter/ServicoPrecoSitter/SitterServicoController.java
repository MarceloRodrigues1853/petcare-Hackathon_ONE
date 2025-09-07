package com.petcare.sitter.ServicoPrecoSitter;

// Adicionados imports para clareza e novas funcionalidades
import com.petcare.dto.PrecoRequest;  // Supondo que o DTO está neste pacote
import com.petcare.dto.PrecoResponse; // Supondo que o DTO está neste pacote
import org.springframework.http.HttpStatus;
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

        // MELHORIA: Retornando HTTP 201 Created, que é o padrão para criação de recursos via POST.
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
} 