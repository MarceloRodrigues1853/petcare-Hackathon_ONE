package com.petcare.sitter; // Verifique o pacote correto

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SitterServicoPrecoRepository extends JpaRepository<SitterServicoPreco, Long> {
    
    List<SitterServicoPreco> findBySitterId(Long sitterId);
    
    // Método para exclusão em lote, mais eficiente
    void deleteBySitterId(Long sitterId);
}