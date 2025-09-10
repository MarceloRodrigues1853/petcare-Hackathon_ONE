package com.petcare.servico;

<<<<<<< HEAD
public class ServicoController {

}
=======

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    // Criar serviço
    @PostMapping
    public ResponseEntity<Servico> create(@RequestBody Servico servico) {
        return ResponseEntity.ok(servicoService.createServico(servico));
    }

    // Buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<Servico> getById(@PathVariable Long id) {
        return ResponseEntity.ok(servicoService.getServicoById(id));
    }

    // Listar todos
    @GetMapping
    public ResponseEntity<List<Servico>> getAll() {
        return ResponseEntity.ok(servicoService.getAllServicos());
    }

    /*
    @PutMapping("/{id}")
    public ResponseEntity<Servico> update(@PathVariable Long id, @RequestBody Servico servico) {
        return ResponseEntity.ok(servicoService.updateServico(id, servico));
    }
*/
    // Deletar serviço
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        servicoService.deleteServico(id);
        return ResponseEntity.noContent().build();
    }
}

>>>>>>> 2113f9d (Resolvendo conflitos do Git. Complemento da entidade Servico)
