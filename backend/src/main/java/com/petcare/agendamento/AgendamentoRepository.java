package com.petcare.agendamento;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
	List<Agendamento> findByOwnerId(Long ownerId);
	List<Agendamento> findBySitterId(Long sitterId);
	List<Agendamento> findByStatus(Agendamento.Status status);

}

