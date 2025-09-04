package com.petcare.pet;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public List<PetResponse> listar() {
        return petService.listarTodos();
    }

    @GetMapping("/{id}")
    public PetResponse buscarPorId(@PathVariable Long id) {
        return petService.buscarPorId(id);
    }

    @PostMapping
    public PetResponse criar(@RequestBody PetRequest request) {
        return petService.criar(request);
    }

    @PutMapping("/{id}")
    public PetResponse atualizar(@PathVariable Long id, @RequestBody PetRequest request) {
        return petService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        petService.deletar(id);
    }
}
