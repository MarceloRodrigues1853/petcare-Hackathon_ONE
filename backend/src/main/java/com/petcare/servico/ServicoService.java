package com.petcare.servico;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    public List<Servico> listarTodos() {
        return servicoRepository.findAll();
    }

    public Optional<Servico> buscarPorId(Long id) {
        return servicoRepository.findById(id);
    }

    public Servico criar(Servico servico) {
        return servicoRepository.save(servico);
    }

    public Optional<Servico> atualizar(Long id, Servico servicoDetalhes) {
        return servicoRepository.findById(id).map(servico -> {
            servico.setDescricao(servicoDetalhes.getDescricao());
            return servicoRepository.save(servico);
        });
    }

    public boolean deletar(Long id) {
        return servicoRepository.findById(id).map(servico -> {
            servicoRepository.delete(servico);
            return true;
        }).orElse(false);
    }
}
