package com.petcare.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petcare.agendamento.AgendamentoResponse;
import com.petcare.owner.OwnerResponse;
import com.petcare.servico.ServicoRequest;
import com.petcare.servico.ServicoResponse;
import com.petcare.sitter.SitterProfileResponse;


import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor 
@RequestMapping("/api/admin") //PODEM MUDAR OS NOMES DOS ENDPOINTS
public class AdminController {
    private final AdminService adminService;


    //LISTA TODDOS OS OWNERS
    @GetMapping("/users/owners")
    public ResponseEntity<List<OwnerResponse>> getAllOwners() {
        List<OwnerResponse> owners = adminService.getAllOwners();
        return ResponseEntity.ok(owners);
    }

    //DELETA UM OWNER COM BASE NO ID
    @DeleteMapping("/users/owners/{ownerId}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long ownerId) {
        adminService.deleteOwner(ownerId);
        return ResponseEntity.noContent().build();
    }

    //LISTA TODOS OS SITTERS
    @GetMapping("/users/sitters")
    public ResponseEntity<List<SitterProfileResponse>> getAllSitters() {
        List<SitterProfileResponse> sitters = adminService.getAllSitters();
        return ResponseEntity.ok(sitters);
    }

    //DELETA UM SITTER COM BASE NO ID
    @DeleteMapping("/users/sitters/{sitterId}")
    public ResponseEntity<Void> deleteSitter(@PathVariable Long sitterId) {
        adminService.deleteSitter(sitterId);
        return ResponseEntity.noContent().build();
    }

    // --- ENDPOINTS PARA GERENCIAR O CATÁLOGO DE SERVIÇOS ---

    //LISTA TODOS OS SERVIÇOS
    @GetMapping("/servicos")
    public ResponseEntity<List<ServicoResponse>> getAllServices() {
        List<ServicoResponse> services = adminService.getAllServices();
        return ResponseEntity.ok(services);
    }

    //CRIA UM NOVO SERVIÇO
    @PostMapping("/servicos")
    public ResponseEntity<ServicoResponse> createService(@RequestBody ServicoRequest serviceRequest) {
        ServicoResponse createdService = adminService.createService(serviceRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }

    //DELETA UM SERVIÇO COM BASE NO ID
    @DeleteMapping("/servicos/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Long serviceId) {
        adminService.deleteService(serviceId);
        return ResponseEntity.noContent().build();
    }

    // --- ENDPOINTS PARA GERENCIAR AGENDAMENTOS ---

    //LISTA TODOS OS AGENDAMENTOS
    @GetMapping("/agendamentos")
    public ResponseEntity<List<AgendamentoResponse>> getAllAgendamentos() {
        List<AgendamentoResponse> agendamentos = adminService.getAllAgendamentos();
        return ResponseEntity.ok(agendamentos);
    }

    //DELETA UM AGENDAMENTO COM BASE NO ID
    @DeleteMapping("/agendamentos/{agendamentoId}")
    public ResponseEntity<Void> deleteAgendamento(@PathVariable Long agendamentoId) {
        adminService.deleteAgendamento(agendamentoId);
        return ResponseEntity.noContent().build();
    }
    
    //LISTA OS AGENDAMENTOS QUE ESTÃO COM CONFLITO DE HORÁRIO
    @GetMapping("/agendamentos/conflitos")
    public ResponseEntity<List<AgendamentoResponse>> getConflictingAgendamentos() {
        List<AgendamentoResponse> agendamentos = adminService.getConflictingAgendamentos();
        return ResponseEntity.ok(agendamentos);
    }
}
