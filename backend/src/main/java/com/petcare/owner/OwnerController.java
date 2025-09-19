package com.petcare.owner;

import com.petcare.owner.dto.OwnerAppointmentResponse;
import com.petcare.owner.dto.OwnerDashboardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<OwnerDashboardResponse> getMyDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        OwnerDashboardResponse dashboardData = ownerService.getDashboardForEmail(userDetails.getUsername());
        return ResponseEntity.ok(dashboardData);
    }

    @GetMapping("/me/appointments")
    public ResponseEntity<List<OwnerAppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "status", required = false) String status
    ) {
        List<OwnerAppointmentResponse> appointments = ownerService.getAppointmentsForEmail(userDetails.getUsername(), status);
        return ResponseEntity.ok(appointments);
    }
}