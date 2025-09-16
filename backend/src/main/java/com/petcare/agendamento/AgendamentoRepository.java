package com.petcare.agendamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
// método para buscar conflitos de horário do Sitter
    @Query("SELECT a FROM Agendamento a " +
        "WHERE a.sitter.id = :sitterId " +
        "AND a.status = 'AGENDADO' " + 
        "AND a.dataInicio < :dataFim " +
        "AND a.dataFim > :dataInicio")
    List<Agendamento> findConflitos(Long sitterId, LocalDateTime dataInicio, LocalDateTime dataFim);

    List<Agendamento> findByOwnerId(Long ownerId);
	List<Agendamento> findBySitterId(Long sitterId);
	List<Agendamento> findByStatus(Agendamento.Status status);

    //Query para listar agendamento por ordem de data (mais recente primeiro)
    List<Agendamento> findAllByOrderByDataInicioDesc();

    //Query para buscar conflitos para o admin conseguir editar um agendamento
    @Query("SELECT a FROM Agendamento a " +
           "WHERE a.sitter.id = :sitterId " +
           "AND a.id != :agendamentoId " + 
           "AND a.status = 'AGENDADO' " +
           "AND a.dataInicio < :dataFim " +
           "AND a.dataFim > :dataInicio")
    List<Agendamento> findConflitosParaEdicao(
        @Param("sitterId") Long sitterId,
        @Param("agendamentoId") Long agendamentoId,
        @Param("dataInicio") LocalDateTime dataInicio,
        @Param("dataFim") LocalDateTime dataFim
    );

	//QUERYS PARA O FINANCEIRO
	
	// Query para calcular os ganhos de UM sitter em um período (VERSÃO OTIMIZADA)
	@Query("SELECT COALESCE(SUM(ssp.valor), 0) FROM Agendamento a JOIN a.sitterServicoPreco ssp " +
		"WHERE a.sitter = :sitterId AND a.status = 'CONCLUIDO' " +
		"AND a.dataFim BETWEEN :inicioPeriodo AND :fimPeriodo")
	BigDecimal sumGanhosSitterByPeriodo(
		@Param("sitterId") Long sitterId,
		@Param("inicioPeriodo") LocalDateTime inicioPeriodo,
		@Param("fimPeriodo") LocalDateTime fimPeriodo
	);


    // Query para calcular o faturamento TOTAL da plataforma em um período
    @Query("SELECT COALESCE(SUM(ssp.valor), 0) FROM Agendamento a JOIN a.sitterServicoPreco ssp " +
           "WHERE a.status = 'CONCLUIDO' " +
           "AND a.dataFim BETWEEN :inicioPeriodo AND :fimPeriodo")
    BigDecimal sumFaturamentoTotalByPeriodo(
        @Param("inicioPeriodo") LocalDateTime inicioPeriodo,
        @Param("fimPeriodo") LocalDateTime fimPeriodo
    );
    
	
    // Query para contar agendamentos concluídos
    Long countBySitterIdAndStatusAndDataFimBetween(Long sitterId, Agendamento.Status status, LocalDateTime inicio, LocalDateTime fim);
    Long countByStatusAndDataFimBetween(Agendamento.Status status, LocalDateTime inicio, LocalDateTime fim);

}

