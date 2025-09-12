package com.petcare.sitter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SitterRepository extends JpaRepository<Sitter, Long> {

    Optional<Sitter> findByEmail(String email);

    //Listar Sitters que oferecem um serviço específico
    @Query("SELECT s FROM Sitter s JOIN s.servicosOferecidos ssp WHERE ssp.servico.id = :servicoId")
    List<Sitter> findByServicoId(@Param("servicoId") Long servicoId);
}

