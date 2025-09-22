package com.petcare.owner;

import com.petcare.agendamento.Agendamento;
import com.petcare.agendamento.AgendamentoRepository;
import com.petcare.config.exception.ResourceNotFoundException;
import com.petcare.owner.dto.OwnerAppointmentCreateRequest;
import com.petcare.owner.dto.OwnerAppointmentResponse;
import com.petcare.pet.Pet;
import com.petcare.pet.PetRepository;
import com.petcare.sitter.Sitter;
import com.petcare.sitter.SitterRepository;
import com.petcare.sitter.SitterServicoPreco;
import com.petcare.sitter.SitterServicoPrecoRepository;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/owners/me")
@RequiredArgsConstructor
public class OwnerAppointmentsController {

    private final UserRepository userRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final PetRepository petRepository;
    private final SitterRepository sitterRepository;
    private final SitterServicoPrecoRepository sitterServicoPrecoRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null) ? auth.getName() : null;
        if (email == null) throw new ResourceNotFoundException("Usuário autenticado não encontrado.");
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + email));
    }

    @GetMapping("/compromissos")
    @Transactional(readOnly = true)
    public List<OwnerAppointmentResponse> listMyAppointments(@RequestParam(required = false) String status) {
        User owner = currentUser();

        Agendamento.Status st = null;
        if (status != null && !status.isBlank()) {
            st = Agendamento.Status.valueOf(status.toUpperCase());
        }

        var list = agendamentoRepository.findFullByOwnerEmailAndStatus(owner.getEmail(), st);
        return list.stream().map(this::toOwnerResponse).toList();
    }

    @PostMapping("/compromissos")
    @Transactional
    public OwnerAppointmentResponse create(@RequestBody OwnerAppointmentCreateRequest req) {
        User owner = currentUser();

        Pet pet = petRepository.findById(req.petId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado: " + req.petId()));

        if (pet.getOwner() == null || !pet.getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("O pet informado não pertence ao usuário autenticado.");
        }

        Sitter sitter = sitterRepository.findById(req.sitterId())
                .orElseThrow(() -> new ResourceNotFoundException("Sitter não encontrado: " + req.sitterId()));

        SitterServicoPreco ssp = sitterServicoPrecoRepository.findById(req.sitterServicoPrecoId())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço do sitter não encontrado: " + req.sitterServicoPrecoId()));

        if (!ssp.getSitter().getId().equals(sitter.getId())) {
            throw new IllegalArgumentException("O serviço selecionado não pertence ao Sitter informado.");
        }

        LocalDateTime inicio = req.startDate();
        if (inicio == null) throw new IllegalArgumentException("startDate é obrigatório.");
        LocalDateTime fim = (req.endDate() != null) ? req.endDate() : inicio.plusHours(1);

        Agendamento a = new Agendamento();
        a.setOwner((Owner) owner);
        a.setSitter(sitter);
        a.setPet(pet);
        a.setSitterServicoPreco(ssp);
        a.setDataInicio(inicio);
        a.setDataFim(fim);
        a.setStatus(Agendamento.Status.PENDENTE);

        a = agendamentoRepository.save(a);
        return toOwnerResponse(a);
    }

    private OwnerAppointmentResponse toOwnerResponse(Agendamento a) {
        String sitterName = (a.getSitter() != null) ? a.getSitter().getName() : null;
        String petName = (a.getPet() != null) ? a.getPet().getName() : null;

        String service = null;
        Double valor = null;
        if (a.getSitterServicoPreco() != null) {
            service = (a.getSitterServicoPreco().getServico() != null)
                    ? a.getSitterServicoPreco().getServico().getDescricao()
                    : null;
            valor = a.getSitterServicoPreco().getValor() != null
                    ? a.getSitterServicoPreco().getValor().doubleValue()
                    : null;
        }

        return new OwnerAppointmentResponse(
                a.getId(),
                sitterName,
                petName,
                service,
                a.getDataInicio(),
                a.getDataFim(),
                a.getStatus() != null ? a.getStatus().name() : null,
                valor
        );
    }
}
