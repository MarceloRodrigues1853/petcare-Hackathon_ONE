package com.petcare.agendamento;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;


import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(
            @RequestBody AgendamentoRequest request
    ) {
        
        AgendamentoResponse response = agendamentoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> buscarPorId(@PathVariable Long id) {
        AgendamentoResponse response = agendamentoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }
/*
    @GetMapping
    public ResponseEntity<List<AgendamentoResponse>> listarTodos() {
        List<AgendamentoResponse> responseList = agendamentoService.listarTodos();
        return ResponseEntity.ok(responseList);
    } */

    @GetMapping("/meus-agendamentos")
    public ResponseEntity<List<AgendamentoResponse>> listarMeusAgendamentos(@RequestParam Long ownerId) {
        List<AgendamentoResponse> responseList = agendamentoService.listarPorOwner(ownerId);
        return ResponseEntity.ok(responseList);
    }


    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody AgendamentoRequest request
    ) {

        AgendamentoResponse response = agendamentoService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/agendamentos/{id}/cancelar")
    public ResponseEntity<AgendamentoResponse> cancelar(
        @PathVariable Long id,
        @RequestParam Long ownerId
    ) {
        AgendamentoResponse response = agendamentoService.cancelarAgendamento(id, ownerId);
        return ResponseEntity.ok(response);
    }


/*
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long ownerId
    ) {
        agendamentoService.deletar(id, ownerId);
        return ResponseEntity.noContent().build();
    }*/
}
