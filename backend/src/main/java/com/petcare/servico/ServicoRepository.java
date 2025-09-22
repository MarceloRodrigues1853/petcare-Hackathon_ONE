package com.petcare.servico;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

    Optional<Servico> findByDescricaoIgnoreCase(String descricao);
}
