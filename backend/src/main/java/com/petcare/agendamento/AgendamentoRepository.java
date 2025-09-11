package com.petcare.agendamento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    // Aqui você pode adicionar métodos para buscar agendamentos específicos, por exemplo:
    // List<Agendamento> findBySitterId(Long sitterId);
    // List<Agendamento> findByOwnerId(Long ownerId);
}
