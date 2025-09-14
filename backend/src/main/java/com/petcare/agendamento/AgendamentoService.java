package com.petcare.agendamento;

import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import com.petcare.pet.PetRepository;
import com.petcare.sitter.SitterRepository; 
import com.petcare.sitter.SitterServicoPrecoRepository; 

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

    public AgendamentoResponse criar(AgendamentoRequest request) {
        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner não encontrado"));

    
        var sitter = sitterRepository.findById(request.getSitterId())
                .orElseThrow(() -> new RuntimeException("Sitter não encontrado"));
        var pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        var servicoPreco = sitterServicoPrecoRepository.findById(request.getSitterServicoPrecoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        // Cria a entidade Agendamento
        Agendamento agendamento = new Agendamento();
        agendamento.setDataInicio(request.getDataInicio());
        agendamento.setDataFim(request.getDataFim());
        agendamento.setStatus(Agendamento.Status.AGENDADO);
        agendamento.setSitter(sitter);
        agendamento.setPet(pet);
        agendamento.setSitterServicoPreco(servicoPreco);

        // Valida conflito no mesmo horário
        var conflitos = agendamentoRepository.findConflitos(
                agendamento.getSitter().getId(),
                agendamento.getDataInicio(),
                agendamento.getDataFim()
        );
        if (!conflitos.isEmpty()) {
            throw new RuntimeException("Sitter indisponível neste horário.");
        }
       
        owner.addAgendamento(agendamento);
        
        ownerRepository.save(owner); 

        return new AgendamentoResponse(agendamento);
    }

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
            );
            if (!conflitos.isEmpty()) {
                throw new RuntimeException("Sitter indisponível neste novo horário.");
            }
        }
        
        agendamentoRepository.save(agendamento);
        
        return new AgendamentoResponse(agendamento);
    }

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
    }
    
    public List<AgendamentoResponse> listarTodos() {
        return agendamentoRepository.findAll().stream()
            .map(AgendamentoResponse::new) 
            .collect(Collectors.toList());
    }
    
    public AgendamentoResponse buscarPorId(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        
        return new AgendamentoResponse(agendamento);
    }
}