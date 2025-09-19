package com.petcare.sitter;

import com.petcare.agendamento.Agendamento;
import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.config.exception.ResourceNotFoundException;
import com.petcare.servico.Servico;
import com.petcare.servico.ServicoRepository;
import com.petcare.sitter.dto.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SitterService {

    private final SitterRepository sitterRepository;
    private final SitterServicoPrecoRepository sitterServicoPrecoRepository;
    private final ServicoRepository servicoRepository;
    private final AgendamentoRepository agendamentoRepository;

    public SitterService(
            SitterRepository sitterRepository,
            SitterServicoPrecoRepository sitterServicoPrecoRepository,
            ServicoRepository servicoRepository,
            AgendamentoRepository agendamentoRepository
    ) {
        this.sitterRepository = sitterRepository;
        this.sitterServicoPrecoRepository = sitterServicoPrecoRepository;
        this.servicoRepository = servicoRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    private Sitter getByEmailOrThrow(String email) {
        return sitterRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Sitter não encontrado para email: " + email));
    }

    private SitterAppointmentResponse toAppointmentResponse(Agendamento a) {
        // <<< CORREÇÃO: Conversão explícita de BigDecimal para Double para o DTO >>>
        Double valor = (a.getSitterServicoPreco().getValor() != null)
                ? a.getSitterServicoPreco().getValor().doubleValue()
                : null;

        return new SitterAppointmentResponse(
                a.getId(),
                a.getOwner().getName(),
                a.getPet().getName(), // <<< CORREÇÃO: Usando getName() pois Pet é uma classe normal
                a.getSitterServicoPreco().getServico().getDescricao(),
                a.getDataInicio(),
                a.getDataFim(),
                a.getStatus() != null ? a.getStatus().name() : null,
                valor
        );
    }

    @Transactional(readOnly = true)
    public SitterDashboardResponse getDashboardForEmail(String email) {
        Sitter s = getByEmailOrThrow(email);
        long totalAppointments = agendamentoRepository.countBySitterId(s.getId());
        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        BigDecimal monthlyRevenue = agendamentoRepository
                .calculateMonthlyRevenue(s.getId(), Agendamento.Status.CONCLUIDO, startOfMonth, endOfMonth)
                .orElse(BigDecimal.ZERO);
        double rating = 4.8; // Valor fixo por enquanto
        return new SitterDashboardResponse(totalAppointments, monthlyRevenue.doubleValue(), rating);
    }

    @Transactional(readOnly = true)
    public SitterProfileResponse getProfileByEmail(String email) {
        Sitter s = getByEmailOrThrow(email);
        // <<< CORREÇÃO: Usando o construtor de 3 argumentos correto para o DTO
        return new SitterProfileResponse(s.getId(), s.getName(), s.getEmail());
    }

    @Transactional(readOnly = true)
    public SitterProfileResponse getProfileById(Long sitterId) {
        Sitter s = sitterRepository.findById(sitterId)
                .orElseThrow(() -> new ResourceNotFoundException("Sitter não encontrado com id: " + sitterId));
        // <<< CORREÇÃO: Usando o construtor de 3 argumentos correto para o DTO
        return new SitterProfileResponse(s.getId(), s.getName(), s.getEmail());
    }

    @Transactional
    public SitterProfileResponse updateProfileByEmail(String email, SitterProfileRequest req) {
        Sitter s = getByEmailOrThrow(email);
        if (req.name() != null) s.setName(req.name());
        if (req.email() != null) s.setEmail(req.email());
        sitterRepository.save(s);
        // <<< CORREÇÃO: Usando o construtor de 3 argumentos correto para o DTO
        return new SitterProfileResponse(s.getId(), s.getName(), s.getEmail());
    }

    @Transactional(readOnly = true)
    public List<SitterServiceItem> getServicesForEmail(String email) {
        Sitter s = getByEmailOrThrow(email);
        List<SitterServicoPreco> list = sitterServicoPrecoRepository.findBySitterId(s.getId());
        return list.stream()
                .map(x -> new SitterServiceItem(
                        x.getId(),
                        x.getServico().getId(),
                        x.getServico().getDescricao(),
                        x.getValor() != null ? x.getValor().doubleValue() : 0.0
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveServicesForEmail(String email, SitterServicesRequest req) {
        Sitter s = getByEmailOrThrow(email);
        sitterServicoPrecoRepository.deleteBySitterId(s.getId());
        List<SitterServicoPreco> newPrices = req.items().stream().map(item -> {
            Servico servico = servicoRepository.findById(item.servicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado: " + item.servicoId()));
            SitterServicoPreco n = new SitterServicoPreco();
            n.setSitter(s);
            n.setServico(servico);
            n.setValor(BigDecimal.valueOf(item.valor() != null ? item.valor() : 0.0));
            return n;
        }).collect(Collectors.toList());
        sitterServicoPrecoRepository.saveAll(newPrices);
    }

    @Transactional(readOnly = true)
    public List<SitterAppointmentResponse> getUpcomingAppointmentsForEmail(String email, int limit) {
        Sitter s = getByEmailOrThrow(email);
        Pageable pageable = PageRequest.of(0, limit);
        List<Agendamento> appointments = agendamentoRepository.findUpcomingBySitterId(s.getId(), pageable);
        return appointments.stream().map(this::toAppointmentResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SitterAppointmentResponse> getAppointmentsForEmail(String email, String status, Boolean future) {
        Sitter s = getByEmailOrThrow(email);
        Agendamento.Status statusEnum = (status != null) ? Agendamento.Status.valueOf(status.toUpperCase()) : null;
        List<Agendamento> appointments = agendamentoRepository.findAppointmentsByCriteria(s.getId(), statusEnum, future, LocalDate.now());
        return appointments.stream().map(this::toAppointmentResponse).collect(Collectors.toList());
    }
}