package com.petcare.admin;

import org.hibernate.mapping.List;
import org.springframework.stereotype.Service;

import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.owner.OwnerRepository;
import com.petcare.servico.ServicoRepository;
import com.petcare.sitter.SitterRepository;
import com.petcare.owner.OwnerResponse;

@Service
public class AdminService {

    private final OwnerRepository ownerRepository;
    private final SitterRepository sitterRepository;
    private final ServicoRepository servicoRepository;
    private final AgendamentoRepository agendamentoRepository;
    

    public AdminService(OwnerRepository ownerRepository, SitterRepository sitterRepository,
                        ServicoRepository servicoRepository, AgendamentoRepository agendamentoRepository) {
        this.ownerRepository = ownerRepository;
        this.sitterRepository = sitterRepository;
        this.servicoRepository = servicoRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @Transactional(readOnly = true)
    public List<OwnerResponse> getAllOwners() {
        return ownerRepository.findAll().stream()
                .map(this::toOwnerResponse) // Converte cada Owner para um DTO
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteOwner(Long ownerId) {
        ownerRepository.deleteById(ownerId); // A exclusão em cascata cuidará dos pets
    }

    @Transactional(readOnly = true)
    public List<SitterResponse> getAllSitters() {
        return sitterRepository.findAll().stream()
                .map(this::toSitterResponse) // Converte cada Sitter para um DTO
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSitter(Long sitterId) {
        sitterRepository.deleteById(sitterId);
    }

    // --- MÉTODOS PARA GERENCIAR O CATÁLOGO DE SERVIÇOS ---

    @Transactional(readOnly = true)
    public List<ServicoResponse> getAllServices() {
        // Delega para o ServicoService e depois converte
        return servicoService.listarTodos().stream()
                .map(this::toServicoResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServicoResponse createService(ServicoRequest serviceRequest) {
        // Delega a criação para o ServicoService
        Servico novoServico = new Servico(); // Supondo que Servico tem um construtor vazio
        novoServico.setDescricao(serviceRequest.getDescricao());
        Servico servicoSalvo = servicoService.criar(novoServico);
        return toServicoResponse(servicoSalvo);
    }

    @Transactional
    public void deleteService(Long serviceId) {
        servicoService.deletar(serviceId);
    }

    // --- MÉTODOS PARA GERENCIAR AGENDAMENTOS ---

    @Transactional(readOnly = true)
    public List<AgendamentoResponse> getAllAgendamentos() {
        return agendamentoRepository.findAll().stream()
                .map(this::toAgendamentoResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponse> getAgendamentosByStatus(String statusString) {
        Agendamento.Status status = Agendamento.Status.valueOf(statusString.toUpperCase());
        List<Agendamento> agendamentos = agendamentoRepository.findByStatus(status);
        return agendamentos.stream()
                .map(this::toAgendamentoResponse)
                .collect(Collectors.toList());
    }

    public List<AgendamentoResponse> getConflictingAgendamentos() {
        // Como combinado: printamos um aviso e retornamos uma lista vazia.
        System.out.println("AVISO: Lógica para buscar agendamentos conflituosos ainda não implementada.");
        return Collections.emptyList();
    }

    @Transactional
    public void deleteAgendamento(Long agendamentoId) {
        agendamentoRepository.deleteById(agendamentoId);
    }


    // --- MÉTODOS AUXILIARES PRIVADOS PARA CONVERSÃO DE DTOs ---
    // (Você precisará criar os DTOs correspondentes)

    private OwnerResponse toOwnerResponse(Owner owner) {
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    private SitterResponse toSitterResponse(Sitter sitter) {
        return new SitterResponse(sitter.getId(), sitter.getName(), sitter.getEmail());
    }

    private ServicoResponse toServicoResponse(Servico servico) {
        return new ServicoResponse(servico.getId(), servico.getDescricao());
    }

    private AgendamentoResponse toAgendamentoResponse(Agendamento agendamento) {
        // Este DTO pode ser mais complexo, dependendo do que o front quer ver
        return new AgendamentoResponse(agendamento.getId(), agendamento.getStatus().name(), agendamento.getDataInicio());
    }

    

    

}

/*
public List<AgendamentoResponse> getAgendamentosByStatus(String statusString) {
    // Converte a String para o Enum de forma segura
    Agendamento.Status status = Agendamento.Status.valueOf(statusString.toUpperCase());
    List<Agendamento> agendamentos = agendamentoRepository.findByStatus(status);
    // ... faça a conversão para List<AgendamentoResponse> e retorne
    return ...;
    
    public List<AgendamentoResponse> getConflictingAgendamentos() {
    // TODO: Implementar a lógica de busca de conflitos quando as regras de negócio forem definidas.
    System.out.println("AVISO: A busca por agendamentos conflituosos ainda não foi implementada.");
    
    return Collections.emptyList(); // Retorna uma lista vazia por enquanto
}
    
*/