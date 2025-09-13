package com.petcare.sitter;

import com.petcare.servico.Servico; // Supondo que você tenha uma entidade Servico
import com.petcare.servico.ServicoRepository; // Supondo que você tenha um repositório para Servico
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SitterService {

    private final SitterRepository sitterRepository;
    private final SitterServicoPrecoRepository sitterServicoPrecoRepository;
    private final ServicoRepository servicoRepository; // Dependência para buscar os tipos de serviço

    // Construtor unificado com todas as dependências necessárias
    public SitterService(SitterRepository sitterRepository,
                         SitterServicoPrecoRepository sitterServicoPrecoRepository,
                         ServicoRepository servicoRepository) {
        this.sitterRepository = sitterRepository;
        this.sitterServicoPrecoRepository = sitterServicoPrecoRepository;
        this.servicoRepository = servicoRepository;
    }

    // --- MÉTODOS PARA GERENCIAR O PERFIL DO SITTER ---

    @Transactional(readOnly = true)
    public Sitter getSitterProfile(Long sitterId) {
        return sitterRepository.findById(sitterId)
                .orElseThrow(() -> new RuntimeException("Sitter com ID " + sitterId + " não encontrado."));
    }

    @Transactional
    public Sitter updateSitterProfile(Long sitterId, SitterProfileRequest request) {
        Sitter sitter = getSitterProfile(sitterId);
        sitter.setName(request.name());
        sitter.setEmail(request.email());
        // Adicione outros campos que podem ser atualizados (bio, telefone, etc.)
        return sitterRepository.save(sitter);
    }

    // --- MÉTODOS PARA GERENCIAR OS SERVIÇOS E PREÇOS DO SITTER (LÓGICA DO ANTIGO PrecoPorSitterService) ---

    //retorna lista dos serviços e preços de um sitter especifico
    @Transactional(readOnly = true)
    public List<SitterServicoPreco> getServicosDoSitter(Long sitterId) {
        // Garante que o sitter existe antes de buscar os serviços
        if (!sitterRepository.existsById(sitterId)) {
            throw new RuntimeException("Sitter com ID " + sitterId + " não encontrado.");
        }
        return sitterServicoPrecoRepository.findBySitterId(sitterId);
    }

    @Transactional
    public SitterServicoPreco addServicoParaSitter(Long sitterId, SitterServicoRequest request) {
        Sitter sitter = getSitterProfile(sitterId);

        // Busca o tipo de serviço (ex: Passeio, Hospedagem) pelo ID
        Servico servico = servicoRepository.findById(request.servicoId())
                .orElseThrow(() -> new RuntimeException("Tipo de Serviço com ID " + request.servicoId() + " não encontrado."));

        // Verifica se o sitter já oferece este serviço para evitar duplicatas
        boolean jaExiste = sitterServicoPrecoRepository.existsBySitterAndServico(sitter, servico);
        if (jaExiste) {
            throw new RuntimeException("Este Sitter já oferece o serviço de '" + servico.getDescricao() + "'.");
        }

        SitterServicoPreco novoServicoPreco = new SitterServicoPreco();
        novoServicoPreco.setSitter(sitter);
        novoServicoPreco.setServico(servico);
        novoServicoPreco.setValor(request.valor());

        return sitterServicoPrecoRepository.save(novoServicoPreco);
    }

    @Transactional
    public void deleteServicoDoSitter(Long sitterId, Long servicoPrecoId) {
        SitterServicoPreco servicoPreco = sitterServicoPrecoRepository.findByIdAndSitterId(servicoPrecoId, sitterId)
                .orElseThrow(() -> new RuntimeException("Serviço com ID " + servicoPrecoId + " não encontrado para o Sitter ID " + sitterId));
        
        sitterServicoPrecoRepository.delete(servicoPreco);
    }

    // --- MÉTODOS PARA O FRONTEND USAR ---

    // Lista todos os Sitters, opcionalmente filtrando por um tipo de serviço específico
   @Transactional(readOnly = true)
    public List<SitterListarServicoResponse> listarSittersPorServico(Long servicoId) {
        List<Sitter> sitters;

        if (servicoId != null) {
            sitters = sitterRepository.findByServicoId(servicoId);
        } else {
            sitters = sitterRepository.findAll();
        }

        return sitters.stream()
            .map(sitter -> {
                List<SitterServicoResponse> servicosResponse = sitter.getServicosOferecidos().stream()
                    .filter(servicoPreco -> servicoId == null || servicoPreco.getServico().getId().equals(servicoId))
                    .map(servicoPreco -> new SitterServicoResponse(
                        servicoPreco.getId(),
                        servicoPreco.getServico().getDescricao(),
                        servicoPreco.getValor()
                    ))
                    .collect(Collectors.toList());

                return new SitterListarServicoResponse(
                    sitter.getId(),
                    sitter.getName(),
                    servicosResponse
                );
            })
            .collect(Collectors.toList());
    }
}

