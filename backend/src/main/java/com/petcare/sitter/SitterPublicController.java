// src/main/java/com/petcare/sitter/SitterPublicController.java
package com.petcare.sitter;

import com.petcare.user.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sitters")
@RequiredArgsConstructor
public class SitterPublicController {

    private final SitterRepository sitterRepository;

    public record SitterLite(Long id, String name, String email) {}

    @GetMapping
    public List<SitterLite> list(@RequestParam(name="status", required=false) String status) {
        List<Sitter> sitters;
        if (status != null && !status.isBlank()) {
            try {
                Status st = Status.valueOf(status.toUpperCase());
                sitters = sitterRepository.findByStatus(st);
            } catch (IllegalArgumentException e) {
                // status inválido -> devolve todos
                sitters = sitterRepository.findAll();
            }
        } else {
            sitters = sitterRepository.findAll();
        }

        return sitters.stream()
                .map(s -> new SitterLite(s.getId(), s.getName(), s.getEmail()))
                .toList();
    }
}
