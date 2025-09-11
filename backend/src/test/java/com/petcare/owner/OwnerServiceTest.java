package com.petcare.owner;

import com.petcare.owner.OwnerRequest;
import com.petcare.owner.OwnerResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OwnerServiceTest {

    @Mock
    private OwnerRepository ownerRepository;

    @InjectMocks
    private OwnerService ownerService;

    @Test
    void deveRetornarOwnerPorId() {
        Owner owner = new Owner("Tay", "tay@teste.com", "123");
        owner.setId(1L);
        when(ownerRepository.findById(1L)).thenReturn(Optional.of(owner));

        OwnerResponse response = ownerService.buscarPorId(1L);

        assertEquals("Tay", response.getName());
        assertEquals("tay@teste.com", response.getEmail());
    }

    @Test
    void deveLancarExcecaoSeOwnerNaoExistir() {
        when(ownerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            ownerService.buscarPorId(99L);
        });
    }

    @Test
    void deveAtualizarOwnerCorretamente() {
        Owner owner = new Owner("Tay", "tay@email.com", "senha123");
        owner.setId(1L);
        OwnerRequest request = new OwnerRequest("Novo Nome", "novo@email.com", "1234");

        when(ownerRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(ownerRepository.save(any(Owner.class))).thenAnswer(inv -> inv.getArgument(0));

        OwnerResponse response = ownerService.atualizar(1L, request);

        assertEquals("Novo Nome", response.getName());
        assertEquals("novo@email.com", response.getEmail());
    }

    @Test
    void deveLancarExcecaoAoAtualizarOwnerInexistente() {
        OwnerRequest request = new OwnerRequest("Novo Nome", "novo@email.com", "1234");
        when(ownerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            ownerService.atualizar(99L, request);
        });
    }

    @Test
    void deveExcluirOwnerCorretamente() {
        Owner owner = new Owner("Tay", "tay@email.com", "senha123");
        owner.setId(1L);
        //when(ownerRepository.findById(1L)).thenReturn(Optional.of(owner));

        ownerService.deletar(1L);

        verify(ownerRepository).deleteById(1L);
    }
}

//comando para rodar este teste com Maven: mvn -Dtest=OwnerServiceTest test
