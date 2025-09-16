package com.petcare.admin;


import com.petcare.agendamento.Agendamento;
import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.agendamento.AgendamentoResponse;
import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import com.petcare.owner.OwnerResponse;
import com.petcare.servico.ServicoService;
import com.petcare.servico.Servico;
import com.petcare.servico.ServicoRequest;
import com.petcare.servico.ServicoResponse;
import com.petcare.sitter.Sitter;
import com.petcare.sitter.SitterProfileResponse;
import com.petcare.sitter.SitterRepository;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OwnerRepository ownerRepository;
    private final SitterRepository sitterRepository;
    private final ServicoService servicoService;     
    private final AgendamentoRepository agendamentoRepository;

    // --- MÉTODOS PARA GERENCIAR USUÁRIOS ---

    //LISTAR TODOS OS OWNER
    @Transactional(readOnly = true)
    public List<OwnerResponse> getAllOwners() {
        return ownerRepository.findAll().stream()
                .map(this::toOwnerResponse)
                .collect(Collectors.toList());
    }

    //DELETAR UM OWNER
    @Transactional
    public void deleteOwner(Long ownerId) {
        ownerRepository.deleteById(ownerId);
    }


    //LISTAR TODOS OS SITTER
    @Transactional(readOnly = true)
    public List<SitterProfileResponse> getAllSitters() {
        return sitterRepository.findAll().stream()
                .map(this::toSitterProfileResponse)
                .collect(Collectors.toList());
    }

    //DELETAR UM SITTER
    @Transactional
    public void deleteSitter(Long sitterId) {
        sitterRepository.deleteById(sitterId);
    }

    // --- MÉTODOS PARA GERENCIAR O CATÁLOGO DE SERVIÇOS ---

    //LISTAR TODOS OS SERVIÇOS CADASTRADOS
    @Transactional(readOnly = true)
    public List<ServicoResponse> getAllServices() {
        List<Servico> servicos = servicoService.listarTodos();
        
        return servicos.stream()
            .map(this::toServicoResponse)
            .collect(Collectors.toList());
    }
    

    //CRIA UM NOVO SERVIÇO - JÁ TEMOS OS 3 SERVIÇOS CADASTRADOS NO BD
    @Transactional
    public ServicoResponse createService(ServicoRequest serviceRequest) {
        Servico novoServico = new Servico();
        novoServico.setDescricao(serviceRequest.getDescricao());
        Servico servicoSalvo = servicoService.criar(novoServico);

        return toServicoResponse(servicoSalvo);
    }


    //DELETA UM SERVIÇO
    @Transactional
    public void deleteService(Long serviceId) {
        servicoService.deletar(serviceId);
    }

    // --- MÉTODOS PARA GERENCIAR AGENDAMENTOS ---

    //LISTA TODOS OS AGENDAMENTOS - POR ORDEM DO MAIS RECENTE
    @Transactional(readOnly = true)
    public List<AgendamentoResponse> getAllAgendamentos() {
        List<Agendamento> agentamentoOrdenado = agendamentoRepository.findAllByOrderByDataInicioDesc();

        return agentamentoOrdenado.stream()
                .map(this::toAgendamentoResponse)
                .collect(Collectors.toList());
    }


    //DELETA UM AGENDAMENTO
    @Transactional
    public void deleteAgendamento(Long agendamentoId) {
        if (!agendamentoRepository.existsById(agendamentoId)) {
            throw new RuntimeException("Agendamento com ID " + agendamentoId + " não encontrado.");
        }
        agendamentoRepository.deleteById(agendamentoId);
    }

    //LISTA AGENDAMENTOS CONFLITANTES 
     public List<AgendamentoResponse> getConflictingAgendamentos() {
        List<Agendamento> agendamentosAtivos = agendamentoRepository.findByStatus(Agendamento.Status.AGENDADO);
        Set<Agendamento> agendamentosComConflito = new HashSet<>();  //evita de add o msm agendamento mais de uma vez

        //verifica se há conflitos para cada agendamento
        for (Agendamento agendamentoAtual : agendamentosAtivos) {
            List<Agendamento> conflitosEncontrados = agendamentoRepository.findConflitos(
                agendamentoAtual.getSitter().getId(),
                agendamentoAtual.getDataInicio(),
                agendamentoAtual.getDataFim()
            );

            //se o resultado da lista tiver mais de um 1 item, é porque há um conflito
            if (conflitosEncontrados.size() > 1) {
                agendamentosComConflito.addAll(conflitosEncontrados);
            }
        }

        //retorna uma lista de dtos de resposta
        return agendamentosComConflito.stream()
            .map(this::toAgendamentoResponse) 
            .collect(Collectors.toList());
    }
  


    // --- MÉTODOS AUXILIARES DE CONVERSÃO ---
     private OwnerResponse toOwnerResponse(Owner owner) {
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    private SitterProfileResponse toSitterProfileResponse(Sitter sitter) {
        return new SitterProfileResponse(sitter.getId(), sitter.getName(), sitter.getEmail());
    }

    private ServicoResponse toServicoResponse(Servico servico) {
        return new ServicoResponse(servico.getId(), servico.getDescricao());
    }

    private AgendamentoResponse toAgendamentoResponse(Agendamento agendamento) {
    return new AgendamentoResponse(agendamento);
    }
}