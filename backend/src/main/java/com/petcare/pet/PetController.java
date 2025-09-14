package com.petcare.pet;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<PetResponse>> listar() {
        List<PetResponse> pets = petService.listarTodos();
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponse> buscarPorId(@PathVariable Long id) {
        PetResponse pet = petService.buscarPorId(id);
        return ResponseEntity.ok(pet);
    }

    @PostMapping
    public ResponseEntity<PetResponse> criar(@RequestBody PetRequest request) {
        PetResponse novoPet = petService.criar(request);
        // Retorna o status 201 Created para indicar que um novo recurso foi criado
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> atualizar(@PathVariable Long id, @RequestBody PetRequest request) {
        PetResponse petAtualizado = petService.atualizar(id, request);
        return ResponseEntity.ok(petAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        petService.deletar(id);
        // Retorna o status 204 No Content, indicando sucesso sem conteúdo na resposta
        return ResponseEntity.noContent().build();
    }
}