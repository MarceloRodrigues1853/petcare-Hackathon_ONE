package com.petcare.agendamento;

import com.petcare.agendamento.Agendamento.Status;
import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import com.petcare.pet.Pet;
import com.petcare.pet.PetRepository;
import com.petcare.sitter.Sitter;
import com.petcare.sitter.SitterRepository;
import com.petcare.sitter.SitterServicoPreco;
import com.petcare.sitter.SitterServicoPrecoRepository;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final OwnerRepository ownerRepository;
    private final PetRepository petRepository;
    private final SitterRepository sitterRepository;
    private final SitterServicoPrecoRepository sitterServicoPrecoRepository;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository, 
            OwnerRepository ownerRepository, 
            PetRepository petRepository, 
            SitterRepository sitterRepository, 
            SitterServicoPrecoRepository sitterServicoPrecoRepository
    ) {
        this.agendamentoRepository = agendamentoRepository;
        this.ownerRepository = ownerRepository;
        this.petRepository = petRepository;
        this.sitterRepository = sitterRepository;
        this.sitterServicoPrecoRepository = sitterServicoPrecoRepository;
    }

    @Transactional
    public AgendamentoResponse criar(AgendamentoRequest request) {
    // VALIDAÇÃO 1: Datas
    if (request.getDataInicio().isAfter(request.getDataFim())) {
        throw new IllegalArgumentException("A data de início não pode ser depois da data de fim.");
    }

    Owner owner = ownerRepository.findById(request.getOwnerId())
            .orElseThrow(() -> new RuntimeException("Owner não encontrado"));
    Sitter sitter = sitterRepository.findById(request.getSitterId())
            .orElseThrow(() -> new RuntimeException("Sitter não encontrado"));
    Pet pet = petRepository.findById(request.getPetId())
            .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
    SitterServicoPreco servicoPreco = sitterServicoPrecoRepository.findById(request.getSitterServicoPrecoId())
            .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

    // VALIDAÇÃO 2: Conflitos (agora com a query melhorada)
    List<Agendamento> conflitos = agendamentoRepository.findConflitos(
            sitter.getId(),
            request.getDataInicio(),
            request.getDataFim()
    );
    if (!conflitos.isEmpty()) {
        throw new RuntimeException("Sitter indisponível neste horário.");
    }
    
    // Se passou por todas as validações, cria e salva
    Agendamento agendamento = new Agendamento();
    agendamento.setOwner(owner);
    agendamento.setSitter(sitter);
    agendamento.setPet(pet);
    agendamento.setSitterServicoPreco(servicoPreco);
    agendamento.setDataInicio(request.getDataInicio());
    agendamento.setDataFim(request.getDataFim());
    agendamento.setStatus(Agendamento.Status.AGENDADO);
    
    Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);

    return new AgendamentoResponse(agendamentoSalvo);
}

    @Transactional
    public AgendamentoResponse atualizar(Long id, AgendamentoRequest request) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        
        // Checagem de permissão
        if (!agendamento.getOwner().getId().equals(request.getOwnerId())) {
             throw new RuntimeException("Você não pode editar este agendamento.");
        }

        // Busca as entidades a partir dos IDs no Request para as atualizações
        var newSitter = sitterRepository.findById(request.getSitterId())
                .orElseThrow(() -> new RuntimeException("Sitter não encontrado"));
        var newPet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        var newServicoPreco = sitterServicoPrecoRepository.findById(request.getSitterServicoPrecoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        
        // Armazena os valores originais para a validação
        var oldSitterId = agendamento.getSitter().getId();
        var oldDataInicio = agendamento.getDataInicio();
        var oldDataFim = agendamento.getDataFim();
        
        // Atualiza os dados com base no Request
        agendamento.setDataInicio(request.getDataInicio());
        agendamento.setDataFim(request.getDataFim());
        agendamento.setSitter(newSitter);
        agendamento.setPet(newPet);
        agendamento.setSitterServicoPreco(newServicoPreco);
        
        // Valida conflitos de agenda
        if (!agendamento.getSitter().getId().equals(oldSitterId) || !agendamento.getDataInicio().equals(oldDataInicio) || !agendamento.getDataFim().equals(oldDataFim)) {
            var conflitos = agendamentoRepository.findConflitos(
                agendamento.getSitter().getId(),
                agendamento.getDataInicio(),
                agendamento.getDataFim()
            ).stream()
            .filter(a -> !a.getId().equals(agendamento.getId())) // ignora o próprio
            .toList();

            if (!conflitos.isEmpty()) {
                throw new RuntimeException("Sitter indisponível neste novo horário.");
            }
        }

        agendamentoRepository.save(agendamento);
        
        return new AgendamentoResponse(agendamento);
    }

    @Transactional
    public AgendamentoResponse cancelarAgendamento(Long agendamentoId, Long ownerId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!agendamento.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Você não tem permissão para cancelar este agendamento");
        }

        agendamento.setStatus(Status.CANCELADO);
        agendamentoRepository.save(agendamento);

        return new AgendamentoResponse(agendamento);
}

/*
    @Transactional
    public void deletar(Long id, Long ownerId) {
        var agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!agendamento.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Você não pode cancelar este agendamento.");
        }
        
        // Remove o agendamento da lista do Owner
        var owner = agendamento.getOwner();
        owner.removeAgendamento(agendamento);
        
        agendamentoRepository.delete(agendamento);
    }*/
    /*
    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listarTodos() {
        return agendamentoRepository.findAll().stream()
            .map(AgendamentoResponse::new) 
            .collect(Collectors.toList());
    }*/

    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listarPorOwner(Long ownerId) {
        return agendamentoRepository.findByOwnerId(ownerId).stream()
            .map(AgendamentoResponse::new)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public AgendamentoResponse buscarPorId(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        
        return new AgendamentoResponse(agendamento);
    }
}
