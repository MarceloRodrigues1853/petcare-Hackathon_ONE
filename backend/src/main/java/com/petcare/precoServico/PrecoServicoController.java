package com.petcare.precoServico;

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
@RequestMapping("/precos-servico")
public class PrecoServicoController {

    private final PrecoServicoService service;

    public PrecoServicoController(PrecoServicoService service) {
        this.service = service;
    }

    @GetMapping
    public List<PrecoServicoResponse> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public PrecoServicoResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public PrecoServicoResponse criar(@RequestBody PrecoServicoRequest request) {
        return service.criar(request);
    }

    @PutMapping("/{id}")
    public PrecoServicoResponse atualizar(@PathVariable Long id, @RequestBody PrecoServicoRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
