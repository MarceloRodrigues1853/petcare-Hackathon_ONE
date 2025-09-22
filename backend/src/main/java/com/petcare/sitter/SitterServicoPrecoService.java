package com.petcare.sitter;

import com.petcare.servico.Servico;
import com.petcare.servico.ServicoRepository;
import com.petcare.sitter.dto.SitterServiceSaveItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SitterServicoPrecoService {

    private final SitterRepository sitterRepository;
    private final ServicoRepository servicoRepository;
    private final SitterServicoPrecoRepository sspRepository;

    @Transactional(readOnly = true)
    public List<SitterServicoPrecoController.SspDTO> listForSitter(Long sitterId) {
        // se quiser ordenar no banco, crie método no repo; aqui ordeno em memória por descrição
        return sspRepository.findBySitterId(sitterId).stream()
                .sorted(Comparator.comparing(ssp -> ssp.getServico().getDescricao(), String.CASE_INSENSITIVE_ORDER))
                .map(ssp -> new SitterServicoPrecoController.SspDTO(
                        ssp.getId(),
                        ssp.getServico().getDescricao(),
                        ssp.getValor()
                ))
                .toList();
    }

    @Transactional
    public List<SitterServicoPrecoController.SspDTO> saveForSitter(Long sitterId, List<SitterServiceSaveItem> items) {
        Sitter sitter = sitterRepository.findById(sitterId)
                .orElseThrow(() -> new NoSuchElementException("Sitter não encontrado: " + sitterId));

        // normaliza entrada (filtra vazios/duplica removendo por descrição)
        List<SitterServiceSaveItem> norm = Optional.ofNullable(items).orElseGet(List::of).stream()
                .filter(it -> it != null && it.servico() != null && !it.servico().isBlank())
                .map(it -> new SitterServiceSaveItem(it.servico().trim(), safeValor(it.valor())))
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                it -> it.servico().toLowerCase(Locale.ROOT),
                                it -> it,
                                // se vier duplicado, mantém o último
                                (a, b) -> b,
                                LinkedHashMap::new
                        ),
                        m -> new ArrayList<>(m.values())
                ));

        // carrega o estado atual
        List<SitterServicoPreco> atuais = sspRepository.findBySitterId(sitterId);
        Map<Long, SitterServicoPreco> porServicoId = new HashMap<>();
        for (SitterServicoPreco s : atuais) {
            porServicoId.put(s.getServico().getId(), s);
        }

        // ids de serviços a manter após merge
        Set<Long> manterIdsServico = new HashSet<>();

        // upsert por descrição
        for (SitterServiceSaveItem it : norm) {
            Servico servico = servicoRepository.findByDescricaoIgnoreCase(it.servico())
                    .orElseThrow(() -> new NoSuchElementException("Servico não encontrado no catálogo: " + it.servico()));
            manterIdsServico.add(servico.getId());

            SitterServicoPreco existente = porServicoId.get(servico.getId());
            if (existente != null) {
                existente.setValor(it.valor());
            } else {
                SitterServicoPreco novo = new SitterServicoPreco();
                novo.setSitter(sitter);
                novo.setServico(servico);
                novo.setValor(it.valor());
                atuais.add(novo);
            }
        }

        // remove o que não veio na lista
        if (!manterIdsServico.isEmpty()) {
            List<SitterServicoPreco> paraRemover = atuais.stream()
                    .filter(ssp -> !manterIdsServico.contains(ssp.getServico().getId()))
                    .toList();
            if (!paraRemover.isEmpty()) {
                sspRepository.deleteAll(paraRemover);
                atuais.removeAll(paraRemover);
            }
        } else {
            // se a lista veio vazia, apaga todos
            sspRepository.deleteBySitterId(sitterId);
            atuais.clear();
        }

        // persiste e retorna ordenado por descrição
        List<SitterServicoPreco> salvos = sspRepository.saveAll(atuais);
        return salvos.stream()
                .sorted(Comparator.comparing(ssp -> ssp.getServico().getDescricao(), String.CASE_INSENSITIVE_ORDER))
                .map(ssp -> new SitterServicoPrecoController.SspDTO(
                        ssp.getId(),
                        ssp.getServico().getDescricao(),
                        ssp.getValor()
                ))
                .toList();
    }

    private BigDecimal safeValor(BigDecimal v) {
        if (v == null || v.signum() < 0) return BigDecimal.ZERO;
        // se quiser padronizar casas decimais:
        // return v.setScale(2, RoundingMode.HALF_UP);
        return v;
    }
}
