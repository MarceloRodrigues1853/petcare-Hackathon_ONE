package com.petcare.owner;

import com.petcare.agendamento.Agendamento;
import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.owner.dto.OwnerAppointmentResponse;
import com.petcare.owner.dto.OwnerAppointmentSummary;
import com.petcare.owner.dto.OwnerDashboardResponse;
import com.petcare.pet.PetRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final PetRepository petRepository;
    private final AgendamentoRepository agendamentoRepository;

    public OwnerService(OwnerRepository ownerRepository,
                        PetRepository petRepository,
                        AgendamentoRepository agendamentoRepository) {
        this.ownerRepository = ownerRepository;
        this.petRepository = petRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @Transactional(readOnly = true)
    public OwnerDashboardResponse getDashboardForEmail(String email) {
        // >>> Resolva o Owner primeiro
        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner não encontrado para email: " + email));

        // >>> Conte pets pelo ownerId
        long totalPets = petRepository.countByOwnerId(owner.getId());

        long totalAgendamentos =
                agendamentoRepository.countByOwnerEmailAndStatusNot(email, Agendamento.Status.CANCELADO);

        // Ajuste os status que contam para "valor a pagar" conforme sua regra
        List<Agendamento.Status> statusesParaPagar =
                List.of(Agendamento.Status.PENDENTE, Agendamento.Status.CONFIRMADO);

        BigDecimal valorAPagar = agendamentoRepository
                .sumValorAPagarByOwnerEmail(email, statusesParaPagar)
                .orElse(BigDecimal.ZERO);

        Pageable limit = PageRequest.of(0, 3);
        var upcoming = agendamentoRepository.findUpcomingByOwnerEmail(email, limit);

        var proximosAgendamentos = upcoming.stream()
                .map(a -> new OwnerAppointmentSummary(
                        a.getId(),
                        a.getPet().getName(),
                        a.getSitterServicoPreco().getServico().getDescricao(),
                         a.getDataInicio(),
                        a.getSitterServicoPreco().getValor()
                ))
                .collect(Collectors.toList());

        return new OwnerDashboardResponse(totalPets, totalAgendamentos, valorAPagar, proximosAgendamentos);
    }

    @Transactional(readOnly = true)
    public List<OwnerAppointmentResponse> getAppointmentsForEmail(String email, String status) {
        var statusEnum = (status != null && !status.isBlank())
                ? Agendamento.Status.valueOf(status.toUpperCase())
                : null;

        var agendamentos = agendamentoRepository.findFullByOwnerEmailAndStatus(email, statusEnum);

        return agendamentos.stream()
                .map(a -> new OwnerAppointmentResponse(
                        a.getId(),
                        a.getSitter().getName(),
                        a.getPet().getName(),
                        a.getSitterServicoPreco().getServico().getDescricao(),
                        a.getDataInicio(),
                        a.getDataFim(),
                        a.getStatus() != null ? a.getStatus().name() : null,
                        a.getSitterServicoPreco().getValor() != null
                                ? a.getSitterServicoPreco().getValor().doubleValue()
                                : null
                ))
                .collect(Collectors.toList());
    }
}
