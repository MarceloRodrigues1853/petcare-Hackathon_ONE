package com.petcare.owner;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping
    public List<OwnerResponse> getAll() {
        return ownerService.findAll().stream()
                .map(OwnerResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public OwnerResponse getById(@PathVariable Long id) {
        return new OwnerResponse(ownerService.findById(id));
    }

    @PostMapping
    public OwnerResponse create(@RequestBody @Valid OwnerRequest request) {
        Owner owner = ownerService.save(request);
        return new OwnerResponse(owner);
    }

    @PutMapping("/{id}")
    public OwnerResponse update(@PathVariable Long id, @RequestBody @Valid OwnerRequest request) {
        Owner owner = ownerService.update(id, request);
        return new OwnerResponse(owner);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ownerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

