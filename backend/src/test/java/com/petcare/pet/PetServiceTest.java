
package com.petcare.pet;

import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;


import java.util.*;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
class PetServiceTest {

    @InjectMocks
    private PetService petService;

    @Mock
    private PetRepository petRepository;

    @Mock
    private OwnerRepository ownerRepository;

    @Test
    void deveCriarPetComOwnerValido() {
        PetRequest request = new PetRequest("Bolt", "Cachorro", 3, 1L);
        Owner owner = new Owner("Tay", "tay@teste.com", "11999999999");
        owner.setId(1L);

        Pet pet = new Pet("Bolt", "Cachorro", 3, owner);
        pet.setId(10L);

        when(ownerRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(petRepository.save(any(Pet.class))).thenReturn(pet);

        PetResponse response = petService.criar(request);

        assertEquals("Bolt", response.getNome());
        assertEquals("Cachorro", response.getEspecie());
        assertEquals(1L, response.getOwnerId());
    }

    @Test
    void deveLancarExcecaoAoCriarPetComOwnerInvalido() {
        PetRequest request = new PetRequest("Bolt", "Cachorro", 3, 99L);

        when(ownerRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> petService.criar(request));
        assertEquals("Owner não encontrado", ex.getMessage());
    }

    @Test
    void deveAtualizarPetComDadosNovos() {
        Owner owner = new Owner("Tay", "tay@teste.com", "11999999999");
        owner.setId(1L);

        Pet pet = new Pet("Bolt", "Cachorro", 3, owner);
        pet.setId(10L);

        PetRequest request = new PetRequest("Max", "Gato", 2, 1L);

        when(petRepository.findById(10L)).thenReturn(Optional.of(pet));
        when(ownerRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(petRepository.save(any(Pet.class))).thenReturn(pet);

        PetResponse response = petService.atualizar(10L, request);

        assertEquals("Max", response.getNome());
        assertEquals("Gato", response.getEspecie());
        assertEquals(1L, response.getOwnerId());
    }

    @Test
    void deveExcluirPetPorId() {
        Long petId = 10L;

        petService.deletar(petId);

        verify(petRepository).deleteById(petId);
    }

    @Test
    void deveListarTodosOsPets() {
        Owner owner = new Owner("Tay", "tay@teste.com", "11999999999");
        owner.setId(1L);

        Pet pet1 = new Pet("Bolt", "Cachorro", 3, owner);
        pet1.setId(10L);
        Pet pet2 = new Pet("Mia", "Gato", 2, owner);
        pet2.setId(11L);

        when(petRepository.findAll()).thenReturn(List.of(pet1, pet2));

        List<PetResponse> pets = petService.listarTodos();

        assertEquals(2, pets.size());
        assertEquals("Bolt", pets.get(0).getNome());
        assertEquals("Mia", pets.get(1).getNome());
    }
}



//comando para rodar o teste com maven: mvn -Dtest=PetServiceTest test
