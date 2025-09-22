// src/main/java/com/petcare/sitter/SitterAdminServicesController.java
package com.petcare.sitter;

import com.petcare.sitter.dto.SitterServiceSaveItem;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sitters")
@RequiredArgsConstructor
public class SitterAdminServicesController {

    private final SitterServicoPrecoService service;

    @PutMapping("/{sitterId}/services")
    @Operation(summary = "Salva/atualiza serviços e preços do sitter (admin)")
    public List<SitterServicoPrecoController.SspDTO> saveForSitter(
            @PathVariable Long sitterId,
            @RequestBody List<SitterServiceSaveItem> items
    ) {
        return service.saveForSitter(sitterId, items);
    }
}
