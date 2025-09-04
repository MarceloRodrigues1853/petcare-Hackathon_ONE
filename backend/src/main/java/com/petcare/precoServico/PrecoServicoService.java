package com.petcare.precoServico;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class PrecoServicoService {

    private final PrecoServicoRepository repository;

    public PrecoServicoService(PrecoServicoRepository repository) {
        this.repository = repository;
    }

    public List<PrecoServicoResponse> listarTodos() {
        return repository.findAll().stream()
                .map(p -> new PrecoServicoResponse(p.getId(), p.getDescricao(), p.getValor()))
                .collect(Collectors.toList());
    }

    public PrecoServicoResponse buscarPorId(Long id) {
        PrecoServico ps = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preço de serviço não encontrado"));
        return new PrecoServicoResponse(ps.getId(), ps.getDescricao(), ps.getValor());
    }

    public PrecoServicoResponse criar(PrecoServicoRequest request) {
        PrecoServico ps = new PrecoServico(request.getDescricao(), request.getValor());
        repository.save(ps);
        return new PrecoServicoResponse(ps.getId(), ps.getDescricao(), ps.getValor());
    }

    public PrecoServicoResponse atualizar(Long id, PrecoServicoRequest request) {
        PrecoServico ps = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preço de serviço não encontrado"));

        ps.setDescricao(request.getDescricao());
        ps.setValor(request.getValor());

        repository.save(ps);
        return new PrecoServicoResponse(ps.getId(), ps.getDescricao(), ps.getValor());
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
