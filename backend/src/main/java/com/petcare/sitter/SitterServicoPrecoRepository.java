package com.petcare.sitter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SitterServicoPrecoRepository extends JpaRepository<SitterServicoPreco, Long> {

    List<SitterServicoPreco> findBySitterId(Long sitterId);

    Optional<SitterServicoPreco> findBySitterIdAndServicoId(Long sitterId, Long servicoId);

    void deleteBySitterId(Long sitterId);
}
