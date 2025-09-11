
package com.petcare.pet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.pet.PetController;
import com.petcare.pet.PetRequest;
import com.petcare.pet.PetResponse;
import com.petcare.pet.PetService;
import com.petcare.auth.JwtService;
import com.petcare.owner.Owner;
import com.petcare.owner.OwnerRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PetController.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = {"OWNER"})
    void deveCriarPet() throws Exception {
        PetRequest request = new PetRequest("Bolt", "Cachorro", 3, 1L);
        PetResponse response = new PetResponse(10L, "Bolt", "Cachorro", 1L);

        Mockito.when(petService.criar(any(PetRequest.class))).thenReturn(response);

        mockMvc.perform(post("/pets")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("Bolt"))
            .andExpect(jsonPath("$.especie").value("Cachorro"));
    }

    @Test
    @WithMockUser(roles = {"OWNER"})
    void deveAtualizarPet() throws Exception {
        PetRequest request = new PetRequest("Max", "Gato", 2, 1L);
        PetResponse response = new PetResponse(10L, "Max", "Gato", 1L);

        Mockito.when(petService.atualizar(eq(10L), any(PetRequest.class))).thenReturn(response);

        mockMvc.perform(put("/pets/10")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("Max"))
            .andExpect(jsonPath("$.especie").value("Gato"));
    }

    @Test
    @WithMockUser(roles = {"OWNER"})
    void deveExcluirPet() throws Exception {
        mockMvc.perform(delete("/pets/10")
                .with(csrf()))
            .andExpect(status().isOk());

        Mockito.verify(petService).deletar(10L);
    }

    @Test
    @WithMockUser(roles = {"OWNER"})
    void deveListarTodosOsPets() throws Exception {
        PetResponse pet1 = new PetResponse(10L, "Bolt", "Cachorro", 1L);
        PetResponse pet2 = new PetResponse(11L, "Mia", "Gato", 1L);

        Mockito.when(petService.listarTodos()).thenReturn(List.of(pet1, pet2));

        mockMvc.perform(get("/pets"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].nome").value("Bolt"))
            .andExpect(jsonPath("$[1].nome").value("Mia"));
    }

    @Test
    @WithMockUser(roles = {"OWNER"})
    void deveBuscarPetPorId() throws Exception {
        PetResponse pet = new PetResponse(10L, "Bolt", "Cachorro", 1L);

        Mockito.when(petService.buscarPorId(10L)).thenReturn(pet);

        mockMvc.perform(get("/pets/10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("Bolt"))
            .andExpect(jsonPath("$.especie").value("Cachorro"));
    }
}

//comando para rodar os testes: mvn -Dtest=PetControllerTest test
