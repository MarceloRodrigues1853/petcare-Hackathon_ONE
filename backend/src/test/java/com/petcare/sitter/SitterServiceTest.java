package com.petcare.sitter;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.petcare.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
class SitterServiceTest {

    @Mock
    private SitterRepository sitterRepository;

    @InjectMocks
    private SitterService sitterService;

    private Sitter mockSitter;

    @BeforeEach
    void setUp() {
        mockSitter = new Sitter();
        mockSitter.setId(1L);
        mockSitter.setName("Tay");
        mockSitter.setEmail("tay@example.com");
        mockSitter.setPasswordHash("hashed");
        mockSitter.setRole(Role.SITTER);
    }

    @Test
    void deveRetornarPerfilDoSitter() {
        when(sitterRepository.findByEmail("tay@example.com")).thenReturn(Optional.of(mockSitter));

        SitterResponse response = sitterService.getProfile("tay@example.com");

        assertEquals("Tay", response.name());
        assertEquals("tay@example.com", response.email());
    }

    @Test
    void deveLancarExcecaoSePerfilNaoEncontrado() {
        when(sitterRepository.findByEmail("tay@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            sitterService.getProfile("tay@example.com");
        });
    }

    @Test
    void deveAtualizarPerfilDoSitter() {
        SitterRequest request = new SitterRequest("Tay Atualizada", "nova@example.com", null);

        when(sitterRepository.findByEmail("tay@example.com")).thenReturn(Optional.of(mockSitter));
        when(sitterRepository.save(any(Sitter.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SitterResponse response = sitterService.updateProfile("tay@example.com", request);

        assertEquals("Tay Atualizada", response.name());
        assertEquals("nova@example.com", response.email());
    }

    @Test
    void deveLancarExcecaoAoAtualizarPerfilNaoEncontrado() {
        SitterRequest request = new SitterRequest("Novo Nome", "novo@email.com", null);

        when(sitterRepository.findByEmail("tay@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            sitterService.updateProfile("tay@example.com", request);
        });
    }

    @Test
    void deveExcluirPerfilDoSitter() {
        when(sitterRepository.findByEmail("tay@example.com")).thenReturn(Optional.of(mockSitter));

        sitterService.deleteProfile("tay@example.com");

        verify(sitterRepository).delete(mockSitter);
    }

    @Test
    void deveLancarExcecaoAoExcluirPerfilNaoEncontrado() {
        when(sitterRepository.findByEmail("tay@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            sitterService.deleteProfile("tay@example.com");
        });
    }
}
