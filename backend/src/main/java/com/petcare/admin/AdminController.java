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
import com.petcare.owner.OwnerRepository;
import com.petcare.owner.OwnerResponse;
import com.petcare.servico.ServicoRequest;
import com.petcare.servico.ServicoResponse;
import com.petcare.sitter.SitterRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/admin") //PODEM MUDAR OS NOMES DOS ENDPOINTS
public class AdminController {
    private final AdminService adminService;


    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    //LISTAR OWNER CADASTRADOS
    @GetMapping("/users/owners")
    public ResponseEntity<List<OwnerResponse>> getAllOwners() {
        List<OwnerResponse> owners = adminService.getAllOwners();
        return ResponseEntity.ok(owners);
    }

    //BANIR/DELETAR OWNER
    @DeleteMapping("/users/owners/{ownerId}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long ownerId) {
        adminService.deleteOwner(ownerId);
        return ResponseEntity.noContent().build();
    }
    
    //LISTAR SITTER CADASTRADOS
    @GetMapping("/users/sitters")
    public ResponseEntity<List<SitterResponse>> getAllSitters() {
        List<SitterResponse> sitters = adminService.getAllSitters();
        return ResponseEntity.ok(sitters);
    }

    //BANIR/DELETAR SITTER
    @DeleteMapping("/users/sitters/{sitterId}")
    public ResponseEntity<Void> deleteSitter(@PathVariable Long sitterId) {
        adminService.deleteSitter(sitterId);
        return ResponseEntity.noContent().build();
    }

    //LiSTAR TODOS OS SERVIÇOS CADASTRADOS
    @GetMapping("/services")
    public ResponseEntity<List<ServicoResponse>> getAllServices() {
        List<ServicoResponse> services = adminService.getAllServices();
        return ResponseEntity.ok(services);
    }

    //CRIAR NOVO SERVIÇO - ja estão criados no BD, mas coloquei aqui
    @PostMapping("/services")
    public ResponseEntity<ServicoResponse> createService(@RequestBody ServicoRequest serviceRequest) {
        ServicoResponse createdService = adminService.createService(serviceRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }

    //EXCLUIR SERVIÇO CADASTRADO
    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Long serviceId) {
        adminService.deleteService(serviceId);
        return ResponseEntity.noContent().build(); 
    }

    //LISTAR OD AGENDAMENTOS DO MES
    @GetMapping("/")
    public ResponseEntity<List<AgendamentoResponse>> getAllAgendamentos() {
        List<AgendamentoResponse> agendamentos = adminService.getAllAgendamentos();
        return ResponseEntity.ok(agendamentos);
    }


    //---- AQUI VAI DEPENDER DOS AJUSTES FINAIS NA PARTE DE AGENDAMENTOS ----
    // POR ISSO VOU DEIXAR COMENTADO

    //LISTAR AGENDAMENTOS POR STATUS (PENDENTE, APROVADO, CANCELADO, CONCLUIDO)
    @GetMapping("/agendamentos/status/{status}")
    public ResponseEntity<List<AgendamentoResponse>> getAgendamentosByStatus(String status) {
        List<AgendamentoResponse> agendamentos = adminService.getAgendamentosByStatus(status);
        return ResponseEntity.ok(agendamentos);
    }

    //LISTAR AGENDAMENTOS CONFLITUOSOS  
    @GetMapping("/agendamentos/conflitos")
    public ResponseEntity<List<AgendamentoResponse>> getConflictingAgendamentos() {
        List<AgendamentoResponse> agendamentos = adminService.getConflictingAgendamentos
        return ResponseEntity.ok(agendamentos);
    }

    //EXCLUIR AGENDAMENTO
    @DeleteMapping("/agendamentos/{agendamentoId}")
    public ResponseEntity<Void> deleteAgendamento(Long agendamentoId) {
        adminService.deleteAgendamento(agendamentoId);
        return ResponseEntity.noContent().build();
    }
}
