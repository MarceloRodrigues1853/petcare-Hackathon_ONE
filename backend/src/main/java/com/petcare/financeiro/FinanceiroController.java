package com.petcare.financeiro;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/financeiro")  //FRONTEND: VER SE O NOME DO ENPOINT ESTÁ BOM, PODEM MUDAR SE QUISER
public class FinanceiroController {

    private final FinanceiroService financeiroService;

    public FinanceiroController(FinanceiroService financeiroService) {
        this.financeiroService = financeiroService;
    }


    @GetMapping("/sitter/{sitterId}")
    public ResponseEntity<SitterFaturamentoResponse> getFaturamentoSitter(@PathVariable Long sitterId) {
        SitterFaturamentoResponse response = financeiroService.getFaturamentoSitter(sitterId);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/admin")
    public ResponseEntity<AdminFaturamentoResponse> getFaturamentoAdmin() {
        AdminFaturamentoResponse response = financeiroService.getFaturamentoAdmin();
        return ResponseEntity.ok(response);
    }
}
