// src/main/java/com/petcare/sitter/SitterRepository.java
package com.petcare.sitter;

import com.petcare.user.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SitterRepository extends JpaRepository<Sitter, Long> {
    Optional<Sitter> findByEmail(String email);

    // 👇 para o SitterPublicController
    List<Sitter> findByStatus(Status status);
}
