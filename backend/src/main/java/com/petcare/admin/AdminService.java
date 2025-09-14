package com.petcare.admin;

import com.petcare.agendamento.Agendamento;
import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.agendamento.AgendamentoRequest;
import com.petcare.agendamento.AgendamentoResponse;
import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import com.petcare.owner.OwnerResponse;
import com.petcare.pet.Pet;
import com.petcare.pet.PetRepository;
import com.petcare.servico.ServicoService;
import com.petcare.servico.Servico;
import com.petcare.servico.ServicoRequest;
import com.petcare.servico.ServicoResponse;
import com.petcare.sitter.Sitter;
import com.petcare.sitter.SitterProfileResponse;
import com.petcare.sitter.SitterRepository;
import com.petcare.sitter.SitterServicoPreco;
import com.petcare.sitter.SitterServicoPrecoRepository;

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
    private final PetRepository petRepository;
    private final SitterServicoPrecoRepository sitterServicoPrecoRepository;
    

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
        return servicoService.listarTodos();
    }

    //CRIA UM NOVO SERVIÇO - JÁ TEMOS OS 3 SERVIÇOS CADASTRADOS NO BD
    @Transactional
    public ServicoResponse createService(ServicoRequest serviceRequest) {
        return servicoService.criar(serviceRequest);
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

    //EDITAR UM AGENDAMENTO
     public AgendamentoResponse atualizarAgendamento(Long agendamentoId, AgendamentoRequest request) {
        
        // =============================================================
        // LOG DE DEPURAÇÃO - VAMOS VER O QUE ESTÁ CHEGANDO AQUI
        // =============================================================
        System.out.println("--- DEBUG: DTO Recebido no Serviço ---");
        System.out.println("Sitter ID recebido: " + request.getSitterId());
        System.out.println("Pet ID recebido: " + request.getPetId());
        System.out.println("Serviço Preço ID recebido: " + request.getSitterServicoPrecoId());
        System.out.println("------------------------------------");
        // =============================================================
            
        // Busca o agendamento que será editado
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new RuntimeException("Agendamento com ID " + agendamentoId + " não encontrado."));

        // Busca as novas entidades relacionadas com base nos IDs da requisição
        Sitter newSitter = sitterRepository.findById(request.getSitterId())
                .orElseThrow(() -> new RuntimeException("Sitter não encontrado"));
        
        Pet newPet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet não encontrado"));
        
        SitterServicoPreco newServicoPreco = sitterServicoPrecoRepository.findById(request.getSitterServicoPrecoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        // Valida se o novo horário tem conflito, usando o metodo findConflitosParaEdicao da agendamentoRepository
        List<Agendamento> conflitos = agendamentoRepository.findConflitosParaEdicao(
            request.getSitterId(),
            agendamentoId, // Passa o ID do agendamento atual para ser ignorado na busca
            request.getDataInicio(),
            request.getDataFim()
        );

        if (!conflitos.isEmpty()) {
            throw new RuntimeException("Sitter já possui um agendamento conflitante neste novo horário.");
        }

        // Atualiza os dados da entidade com os novos valores
        agendamento.setSitter(newSitter);
        agendamento.setPet(newPet);
        agendamento.setSitterServicoPreco(newServicoPreco);
        agendamento.setDataInicio(request.getDataInicio());
        agendamento.setDataFim(request.getDataFim());
        // Aqui o Admin poderia também atualizar o status, se necessário
        // ex: agendamento.setStatus(request.getStatus());

        // Salva a entidade atualizada no banco
        Agendamento agendamentoAtualizado = agendamentoRepository.save(agendamento);

        // Retorna o DTO de resposta para o controller
        return new AgendamentoResponse(agendamentoAtualizado);
    }


    //DELETA UM AGENDAMENTO
    @Transactional
    public void deleteAgendamento(Long agendamentoId) {
        if (!agendamentoRepository.existsById(agendamentoId)) {
            throw new RuntimeException("Agendamento com ID " + agendamentoId + " não encontrado.");
        }
        agendamentoRepository.deleteById(agendamentoId);
    }

    //LISTA AGENDAMENTOS CONFLITANTES  -- FRONTEND: VER MSG ABAIXO DESTE MÉTODO
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
    /* ---ATENÇA PESSOAL DO FRONTEND ---
    A funcionalidade de gerenciamento de agendamentos para o Admin está pronta no back-end. Aqui está como usá-la:

    O que o Back-end Fornece:
    Endpoint Principal para Listar Conflitos:

    GET /api/admin/agendamentos/conflitos
    Resposta: Retorna um array [] de objetos AgendamentoResponse com os detalhes dos agendamentos que estão em conflito. Cada objeto na lista terá seu id.

    Endpoints de Suporte (Já existentes):
    GET /agendamentos/{id}: Para buscar os detalhes de um único agendamento.
    PUT /agendamentos/{id}: Para atualizar um agendamento.
    DELETE /api/admin/agendamentos/{id}: Para que o admin possa excluir um agendamento.

    Fluxo Sugerido para a Tela do Admin:
    ---> 1. Montando a Tela de Conflitos:

    Fazer uma chamada GET para /api/admin/agendamentos/conflitos.

    Com a lista recebida, renderizar cada agendamento na tela.

    Para cada agendamento, exibir um botão "Editar" e um "Excluir".

    ---> 2. Ao Clicar no Botão "Excluir":

    (Opcional) Mostrar um modal de confirmação ("Tem certeza?").

    Se confirmado, fazer uma chamada DELETE para /api/admin/agendamentos/{id}, passando o id do agendamento clicado.

    Após o sucesso (resposta 204), remover o item da lista na tela.

    ---> 3. Ao Clicar no Botão "Editar":

    ---> Vocês precisarão criar a tela/formulário de edição. - TBM PODE SER UMA JANELA MODAL EM FORMA DE FORMULARIO, AO INVES
                                                                 DE SER UMA JANELA NOVA, MAS NAO SEI SE NO REACT TEM A OPÇÃO DE CRIAR MODAL

    ---> Navegar o usuário para a nova rota (ex: /admin/agendamentos/{id}/editar).

    ---> Para preencher o formulário com os dados atuais, a tela de edição pode fazer uma chamada GET /agendamentos/{id}.

    --->  Após o admin salvar as alterações, o formulário deve fazer uma chamada PUT /agendamentos/{id} com os novos dados.
    */



    // --- MÉTODOS AUXILIARES DE CONVERSÃO ---
     private OwnerResponse toOwnerResponse(Owner owner) {
        // Supondo que OwnerResponse tem um construtor (id, name, email)
        return new OwnerResponse(owner.getId(), owner.getName(), owner.getEmail());
    }

    private SitterProfileResponse toSitterProfileResponse(Sitter sitter) {
        // Supondo que SitterProfileResponse tem um construtor (id, name, email)
        return new SitterProfileResponse(sitter.getId(), sitter.getName(), sitter.getEmail());
    }

    private ServicoResponse toServicoResponse(Servico servico) {
        // Supondo que ServicoResponse tem um construtor (id, descricao)
        return new ServicoResponse(servico.getId(), servico.getDescricao());
    }

    private AgendamentoResponse toAgendamentoResponse(Agendamento agendamento) {
    // Simplesmente chame o construtor que você já criou no DTO.
    return new AgendamentoResponse(agendamento);
    }
}
