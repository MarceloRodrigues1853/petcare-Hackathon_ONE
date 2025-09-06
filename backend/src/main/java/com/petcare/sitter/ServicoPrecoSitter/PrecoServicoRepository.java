package com.petcare.sitter.ServicoPrecoSitter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.petcare.precoServico.PrecoServico;

@Repository
public interface PrecoServicoRepository extends JpaRepository<PrecoServico, Long> {

    boolean existsByUser_IdAndDescricao(Long userId, String descricao);
}
