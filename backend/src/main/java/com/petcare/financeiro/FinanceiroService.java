package com.petcare.financeiro;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;

import org.springframework.stereotype.Service;

import com.petcare.agendamento.Agendamento;
import com.petcare.agendamento.AgendamentoRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FinanceiroService {

    private final AgendamentoRepository agendamentoRepository;
    private static final BigDecimal TAXA_PLATAFORMA = new BigDecimal("0.20"); // 20% de taxa para  a plataforma - pode mudar o valor aqui

    public FinanceiroService(AgendamentoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    public SitterFaturamentoResponse getFaturamentoSitter(Long sitterId) {
        YearMonth mesAtual = YearMonth.now();
        LocalDateTime inicioMes = mesAtual.atDay(1).atStartOfDay();
        LocalDateTime fimMes = mesAtual.atEndOfMonth().atTime(LocalTime.MAX);

        BigDecimal ganhos = agendamentoRepository.sumGanhosSitterByPeriodo(sitterId, inicioMes, fimMes);
        Long concluidos = agendamentoRepository.countBySitterIdAndStatusAndDataFimBetween(sitterId, Agendamento.Status.CONCLUIDO, inicioMes, fimMes);

        return new SitterFaturamentoResponse(ganhos, concluidos.intValue());
    }

    public AdminFaturamentoResponse getFaturamentoAdmin() {
        YearMonth mesAtual = YearMonth.now();
        LocalDateTime inicioMes = mesAtual.atDay(1).atStartOfDay();
        LocalDateTime fimMes = mesAtual.atEndOfMonth().atTime(LocalTime.MAX);

        BigDecimal totalFaturamento = agendamentoRepository.sumFaturamentoTotalByPeriodo(inicioMes, fimMes);
        BigDecimal receitaPlataforma = totalFaturamento.multiply(TAXA_PLATAFORMA);
        Long totalServicos = agendamentoRepository.countByStatusAndDataFimBetween(Agendamento.Status.CONCLUIDO, inicioMes, fimMes);

        return new AdminFaturamentoResponse(totalFaturamento, receitaPlataforma, totalServicos.intValue());
    }

}