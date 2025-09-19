package com.petcare.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Este você já tinha, é usado para o login.
    Optional<User> findByEmail(String email);

    // --- ADICIONE OS MÉTODOS ABAIXO ---

    /**
     * ADICIONADO: Encontra todos os usuários com uma determinada Role (ex: todos os SITTERs).
     * Usado em: AdminService para listar todos os sitters ou todos os owners.
     */
    List<User> findByRole(Role role);

    /**
     * ADICIONADO: Encontra todos os usuários com uma Role e um Status específicos.
     * Usado em: AdminService para encontrar sitters com status PENDENTE.
     */
    List<User> findByRoleAndStatus(Role role, Status status);

    /**
     * ADICIONADO: Conta quantos usuários existem com uma Role e um Status específicos.
     * Usado em: AdminService para o card de "Aprovações Pendentes" no dashboard.
     */
    long countByRoleAndStatus(Role role, Status status);
}