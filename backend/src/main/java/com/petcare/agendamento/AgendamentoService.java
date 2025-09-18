package com.petcare.agendamento;

import com.petcare.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;

    public List<Agendamento> listarAgendamentosDoUsuarioLogado() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (user.getRole() == User.Role.OWNER) {
            return agendamentoRepository.findByOwnerId(user.getId());
        } else if (user.getRole() == User.Role.SITTER) {
            return agendamentoRepository.findBySitterId(user.getId());
        }
        
        if (user.getRole() == User.Role.ADMIN) {
            return agendamentoRepository.findAll();
        }

        return new ArrayList<>();
    }

    @Transactional
    public Agendamento criar(Agendamento agendamento) {
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com id " + id));
    }

    @Transactional
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

    @Transactional
    public void deletar(Long id) {
        if (!agendamentoRepository.existsById(id)) {
            throw new RuntimeException("Agendamento não encontrado com id " + id);
        }
        agendamentoRepository.deleteById(id);
    }
}