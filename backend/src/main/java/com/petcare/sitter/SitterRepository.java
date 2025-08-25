package com.petcare.sitter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SitterRepository extends JpaRepository<Sitter, Long> {

    Optional<Sitter> findByEmail(String email);
}

