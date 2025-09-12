package com.petcare.agendamento;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    public Agendamento criar(Agendamento agendamento) {
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com id " + id));
    }

    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public Agendamento atualizar(Long id, Agendamento dadosAtualizados) {
        Agendamento existente = buscarPorId(id);

        existente.setDataInicio(dadosAtualizados.getDataInicio());
        existente.setDataFim(dadosAtualizados.getDataFim());
        existente.setStatus(dadosAtualizados.getStatus());
        existente.setOwner(dadosAtualizados.getOwner());
        existente.setPet(dadosAtualizados.getPet());
        existente.setSitter(dadosAtualizados.getSitter());
        existente.setSitterServicoPreco(dadosAtualizados.getSitterServicoPreco());

        return agendamentoRepository.save(existente);
    }

    public void deletar(Long id) {
        if (!agendamentoRepository.existsById(id)) {
            throw new RuntimeException("Agendamento não encontrado com id " + id);
        }
        agendamentoRepository.deleteById(id);
    }
}
