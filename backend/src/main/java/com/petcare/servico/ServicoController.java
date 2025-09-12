package com.petcare.servico;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    // Listar todos os serviços
    @GetMapping
    public List<ServicoResponse> listarTodos() {
        return servicoService.listarTodos().stream()
                .map(s -> new ServicoResponse(s.getId(), s.getDescricao()))
                .collect(Collectors.toList());
    }

    // Obter serviço por ID
    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponse> obterPorId(@PathVariable Long id) {
        return servicoService.buscarPorId(id)
                .map(s -> new ServicoResponse(s.getId(), s.getDescricao()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Criar um novo serviço
    @PostMapping
    public ResponseEntity<ServicoResponse> criar(@Valid @RequestBody ServicoRequest request) {
        Servico servico = new Servico();
        servico.setDescricao(request.getDescricao());
        Servico salvo = servicoService.criar(servico);

        ServicoResponse response = new ServicoResponse(salvo.getId(), salvo.getDescricao());
        return ResponseEntity.ok(response);
    }

    // Atualizar um serviço existente
    @PutMapping("/{id}")
    public ResponseEntity<ServicoResponse> atualizar(@PathVariable Long id,
                                                     @Valid @RequestBody ServicoRequest request) {
        // Cria um objeto Servico com os dados do request
        Servico servicoAtualizado = new Servico();
        servicoAtualizado.setDescricao(request.getDescricao());

        return servicoService.atualizar(id, servicoAtualizado)
                .map(s -> new ServicoResponse(s.getId(), s.getDescricao()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar um serviço
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean deletado = servicoService.deletar(id);
        return deletado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
