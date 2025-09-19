package com.petcare.agendamento;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // === Métodos para o Painel do Sitter ===
    long countBySitterId(Long sitterId);

    @Query("SELECT SUM(ssp.valor) FROM Agendamento a JOIN a.sitterServicoPreco ssp " +
           "WHERE a.sitter.id = :sitterId AND a.status = :status " +
           "AND CAST(a.dataInicio AS LocalDate) >= :startDate AND CAST(a.dataInicio AS LocalDate) <= :endDate")
    Optional<BigDecimal> calculateMonthlyRevenue(
            @Param("sitterId") Long sitterId,
            @Param("status") Agendamento.Status status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT a FROM Agendamento a WHERE a.sitter.id = :sitterId AND a.dataInicio > CURRENT_TIMESTAMP ORDER BY a.dataInicio ASC")
    List<Agendamento> findUpcomingBySitterId(@Param("sitterId") Long sitterId, Pageable pageable);
    
    @Query("SELECT a FROM Agendamento a WHERE a.sitter.id = :sitterId " +
           "AND (:status IS NULL OR a.status = :status) " +
           "AND (:future IS NULL OR " +
           "    (:future = true AND CAST(a.dataInicio AS LocalDate) > :now) OR " +
           "    (:future = false AND CAST(a.dataInicio AS LocalDate) < :now)) " +
           "ORDER BY a.dataInicio DESC")
    List<Agendamento> findAppointmentsByCriteria(
            @Param("sitterId") Long sitterId,
            @Param("status") Agendamento.Status status,
            @Param("future") Boolean future,
            @Param("now") LocalDate now
    );

    // === Métodos para o Painel do Dono ===
    long countByOwnerEmailAndStatusNot(String ownerEmail, Agendamento.Status status);

    @Query("SELECT SUM(ssp.valor) FROM Agendamento a JOIN a.sitterServicoPreco ssp " +
           "WHERE a.owner.email = :ownerEmail AND a.status IN :statuses")
    Optional<BigDecimal> sumValorAPagarByOwnerEmail(
            @Param("ownerEmail") String ownerEmail,
            @Param("statuses") List<Agendamento.Status> statuses
    );

    @Query("SELECT a FROM Agendamento a WHERE a.owner.email = :ownerEmail " +
           "AND a.dataInicio > CURRENT_TIMESTAMP ORDER BY a.dataInicio ASC")
    List<Agendamento> findUpcomingByOwnerEmail(@Param("ownerEmail") String ownerEmail, Pageable pageable);

    @Query("SELECT a FROM Agendamento a WHERE a.owner.email = :ownerEmail " +
           "AND (:status IS NULL OR a.status = :status) " +
           "ORDER BY a.dataInicio DESC")
    List<Agendamento> findFullByOwnerEmailAndStatus(
            @Param("ownerEmail") String ownerEmail,
            @Param("status") Agendamento.Status status
    );
}