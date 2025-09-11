package com.petcare.sitter;

import com.petcare.servico.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
// A interface agora gerencia a entidade 'SitterServicoPreco'
public interface SitterServicoPrecoRepository extends JpaRepository<SitterServicoPreco, Long> {

    /**
     * Encontra todos os serviços oferecidos por um Sitter específico.
     * O Spring Data JPA cria a query automaticamente a partir do nome do método.
     */
    List<SitterServicoPreco> findBySitterId(Long sitterId);

    /**
     * Verifica se uma combinação específica de Sitter e Serviço já existe,
     * para evitar que um Sitter cadastre o mesmo serviço duas vezes.
     */
    boolean existsBySitterAndServico(Sitter sitter, Servico servico);

    /**
     * Busca um serviço/preço específico pelo seu ID e pelo ID do Sitter,
     * garantindo que um Sitter só possa deletar os seus próprios serviços.
     */
    Optional<SitterServicoPreco> findByIdAndSitterId(Long id, Long sitterId);
}
