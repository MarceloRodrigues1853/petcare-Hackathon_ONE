package com.petcare.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets") // Padronizado para usar /api
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping
    public ResponseEntity<List<PetResponse>> listar() {
        // CORREÇÃO: Chama o método que filtra os pets pelo usuário logado
        return ResponseEntity.ok(petService.listarPetsDoUsuarioLogado());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(petService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PetResponse> criar(@RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> atualizar(@PathVariable Long id, @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        petService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}