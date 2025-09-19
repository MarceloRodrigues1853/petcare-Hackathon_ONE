package com.petcare.admin;

// ATUALIZADO: Importando os DTOs corretos do seu projeto
import com.petcare.dto.AdminDashboardStats;
import com.petcare.dto.StatusUpdateRequest;
import com.petcare.dto.UserResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService; // Lembre-se de criar esta classe de serviço!

    /**
     * ROTA: GET /api/admin/dashboard
     * Busca as estatísticas para os cards do dashboard.
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        AdminDashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * ROTA: GET /api/admin/sitters
     * Lista os sitters. Pode ser filtrado por status (ex: ?status=PENDING).
     * ATUALIZADO: Retorna uma lista de UserResponse, que você já possui.
     */
    @GetMapping("/sitters")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getSitters(@RequestParam(required = false) String status) {
        List<UserResponse> sitters = adminService.findSitters(status);
        return ResponseEntity.ok(sitters);
    }

    /**
     * ROTA: PUT /api/admin/sitters/{sitterId}/status
     * Atualiza o status de um sitter (aprovar/rejeitar).
     * ATUALIZADO: Usa o DTO StatusUpdateRequest para mais segurança e clareza.
     */
    @PutMapping("/sitters/{sitterId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateSitterStatus(@PathVariable Long sitterId, @RequestBody StatusUpdateRequest request) {
        adminService.updateSitterStatus(sitterId, request.status());
        return ResponseEntity.ok().build();
    }
    
    /**
     * ROTA: GET /api/admin/owners
     * Busca todos os donos de pets.
     * ATUALIZADO: Retorna uma lista de UserResponse.
     */
    @GetMapping("/owners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getOwners() {
        List<UserResponse> owners = adminService.findAllOwners();
        return ResponseEntity.ok(owners);
    }
}