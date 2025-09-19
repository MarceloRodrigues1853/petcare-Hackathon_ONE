package com.petcare.sitter;

import com.petcare.sitter.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sitters")
public class SitterController {

    private final SitterService sitterService;

    public SitterController(SitterService sitterService) {
        this.sitterService = sitterService;
    }

    // Endpoint para os 3 cards do painel
    @GetMapping("/me/dashboard")
    public ResponseEntity<SitterDashboardResponse> getMyDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        SitterDashboardResponse dashboardData = sitterService.getDashboardForEmail(userDetails.getUsername());
        return ResponseEntity.ok(dashboardData);
    }

    // Endpoint para a lista de agendamentos (o frontend pode filtrar por ?future=true&limit=5)
    @GetMapping("/me/appointments")
    public ResponseEntity<List<SitterAppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "future", required = false) Boolean future,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
        if (Boolean.TRUE.equals(future) && limit != null) {
            List<SitterAppointmentResponse> appointments = sitterService.getUpcomingAppointmentsForEmail(userDetails.getUsername(), limit);
            return ResponseEntity.ok(appointments);
        }
        List<SitterAppointmentResponse> appointments = sitterService.getAppointmentsForEmail(userDetails.getUsername(), status, future);
        return ResponseEntity.ok(appointments);
    }

    // --- Outros endpoints do Sitter que você já tinha ---
    @GetMapping("/me/profile")
    public ResponseEntity<SitterProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        SitterProfileResponse profile = sitterService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me/profile")
    public ResponseEntity<SitterProfileResponse> updateMyProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody SitterProfileRequest request) {
        SitterProfileResponse updatedProfile = sitterService.updateProfileByEmail(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedProfile);
    }
}