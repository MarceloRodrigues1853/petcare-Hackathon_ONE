package com.petcare.servico;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findByDonoId(Long donoId);
    List<Servico> findByBabaId(Long babaId);
}
