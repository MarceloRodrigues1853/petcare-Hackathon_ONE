package com.petcare.servico;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    public List<ServicoResponse> listarTodos() {
        return servicoRepository.findAll().stream()
                .map(servico -> new ServicoResponse(servico.getId(), servico.getDescricao()))
                .collect(Collectors.toList());
    }

    public ServicoResponse buscarPorId(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        return new ServicoResponse(servico.getId(), servico.getDescricao());
    }

    public ServicoResponse criar(ServicoRequest request) {
        // Verifica se já existe um serviço com a mesma descrição
        if (servicoRepository.findByDescricao(request.getDescricao()).isPresent()) {
            throw new RuntimeException("Já existe um serviço com esta descrição.");
        }
        
        Servico servico = new Servico();
        servico.setDescricao(request.getDescricao());
        Servico novoServico = servicoRepository.save(servico);

        return new ServicoResponse(novoServico.getId(), novoServico.getDescricao());
    }

    public ServicoResponse atualizar(Long id, ServicoRequest request) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        servico.setDescricao(request.getDescricao());
        Servico servicoAtualizado = servicoRepository.save(servico);
        
        return new ServicoResponse(servicoAtualizado.getId(), servicoAtualizado.getDescricao());
    }

    public void deletar(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        servicoRepository.delete(servico);
    }
}
