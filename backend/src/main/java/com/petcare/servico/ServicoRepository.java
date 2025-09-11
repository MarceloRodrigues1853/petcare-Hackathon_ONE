package com.petcare.servico;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {
    // O Spring Data JPA criará os métodos básicos de busca (findById, findAll, etc.)
    // Você pode adicionar métodos de busca customizados aqui se precisar, como:
    // Optional<Servico> findByDescricao(String descricao);
}