package com.petcare.agendamento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
// método para buscar conflitos de horário do Sitter
    @Query("SELECT a FROM Agendamento a " +
           "WHERE a.sitter.id = :sitterId " +
           "AND a.dataInicio < :dataFim " +
           "AND a.dataFim > :dataInicio")
    List<Agendamento> findConflitos(Long sitterId, LocalDateTime dataInicio, LocalDateTime dataFim);
    
    List<Agendamento> findByOwnerId(Long ownerId);
	List<Agendamento> findBySitterId(Long sitterId);
	List<Agendamento> findByStatus(Agendamento.Status status);
}
