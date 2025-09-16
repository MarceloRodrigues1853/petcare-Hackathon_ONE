package com.petcare.owner;

import com.petcare.dto.OwnerDTO;
import com.petcare.dto.UpdateOwnerRequest; // Import corrigido
import lombok.RequiredArgsConstructor; // Usando Lombok para o construtor
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/owners") // Adicionando /api para padronização
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping
    public List<OwnerDTO> findAll() {
        return ownerService.findAll(); // Nome do método corrigido
    }

    @GetMapping("/{id}")
    public OwnerDTO findById(@PathVariable Long id) {
        return ownerService.findById(id); // Nome do método corrigido
    }

    @PutMapping("/{id}")
    public OwnerDTO update(@PathVariable Long id, @RequestBody UpdateOwnerRequest request) {
        return ownerService.update(id, request); // Nome do método corrigido
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        ownerService.deleteById(id); // Nome do método corrigido
    }
}