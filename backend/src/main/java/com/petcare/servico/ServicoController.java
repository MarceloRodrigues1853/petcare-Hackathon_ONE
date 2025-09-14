package com.petcare.servico;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    // Listar todos os serviços
    @GetMapping
    public ResponseEntity<List<ServicoResponse>> listarTodos() {
        List<ServicoResponse> responseList = servicoService.listarTodos();
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponse> buscarPorId(@PathVariable Long id) {
        ServicoResponse response = servicoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ServicoResponse> criar(@Valid @RequestBody ServicoRequest request) {
        ServicoResponse response = servicoService.criar(request);
        // Retorna o status 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ServicoRequest request
    ) {
        ServicoResponse response = servicoService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    // Deletar um serviço
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        servicoService.deletar(id);
        // Retorna o status 204 No Content
        return ResponseEntity.noContent().build();
    }
}