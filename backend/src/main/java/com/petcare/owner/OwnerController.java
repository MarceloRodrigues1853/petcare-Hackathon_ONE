package com.petcare.owner;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/owners")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping
    public List<OwnerResponse> listar() {
        return ownerService.listarTodos();
    }

    @GetMapping("/{id}")
    public OwnerResponse buscarPorId(@PathVariable Long id) {
        return ownerService.buscarPorId(id);
    }

    @PostMapping
    public OwnerResponse criar(@RequestBody OwnerRequest request) {
        return ownerService.criar(request);
    }

    @PutMapping("/{id}")
    public OwnerResponse atualizar(@PathVariable Long id, @RequestBody OwnerRequest request) {
        return ownerService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        ownerService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}