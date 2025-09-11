
package com.petcare.owner;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import com.petcare.auth.JwtService;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(OwnerController.class)
class OwnerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OwnerService ownerService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser(username = "tay@email.com", roles = {"OWNER"})
    void deveListarTodosOsOwners() throws Exception {
        List<OwnerResponse> owners = Arrays.asList(
                new OwnerResponse(1L, "Tay", "tay@email.com"),
                new OwnerResponse(2L, "Luna", "luna@email.com")
        );

        Mockito.when(ownerService.listarTodos()).thenReturn(owners);

        mockMvc.perform(get("/owners"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Tay"))
                .andExpect(jsonPath("$[1].email").value("luna@email.com"));
    }

    @Test
    @WithMockUser(username = "tay@email.com", roles = {"OWNER"})
    void deveBuscarOwnerPorId() throws Exception {
        OwnerResponse response = new OwnerResponse(1L, "Tay", "tay@email.com");

        Mockito.when(ownerService.buscarPorId(1L)).thenReturn(response);

        mockMvc.perform(get("/owners/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Tay"))
                .andExpect(jsonPath("$.email").value("tay@email.com"));
    }

    @Test
    @WithMockUser(username = "tay@email.com", roles = {"OWNER"})
    void deveCriarNovoOwner() throws Exception {
        OwnerRequest request = new OwnerRequest("Tay", "tay@email.com", "senha123");
        OwnerResponse response = new OwnerResponse(1L, "Tay", "tay@email.com");

        Mockito.when(ownerService.criar(any(OwnerRequest.class))).thenReturn(response);

        mockMvc.perform(post("/owners")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Tay"));
    }

    @Test
    @WithMockUser(username = "tay@email.com", roles = {"OWNER"})
    void deveAtualizarOwner() throws Exception {
        OwnerRequest request = new OwnerRequest("Novo Nome", "novo@email.com", "novaSenha");
        OwnerResponse response = new OwnerResponse(1L, "Novo Nome", "novo@email.com");

        Mockito.when(ownerService.atualizar(eq(1L), any(OwnerRequest.class))).thenReturn(response);

        mockMvc.perform(put("/owners/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Novo Nome"))
                .andExpect(jsonPath("$.email").value("novo@email.com"));
    }

    @Test
    @WithMockUser(username = "tay@email.com", roles = {"OWNER"})
    void deveDeletarOwner() throws Exception {
        mockMvc.perform(delete("/owners/1")
                        .with(csrf()))
                .andExpect(status().isOk());

        Mockito.verify(ownerService).deletar(1L);
    }
}


//comando para rodar no terminal: mvn -Dtest=OwnerControllerTest test


