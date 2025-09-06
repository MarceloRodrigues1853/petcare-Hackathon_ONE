package com.petcare.sitter.ServicoPrecoSitter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.sitter.ServicoPrecoSitter.PrecoRequest;
import com.petcare.sitter.ServicoPrecoSitter.PrecoResponse;
import com.petcare.sitter.ServicoPrecoSitter.PrecoPorSitterService;
import com.petcare.sitter.ServicoPrecoSitter.SitterServicoController;
import com.petcare.auth.JwtService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = SitterServicoController.class)
class SitterServicoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PrecoPorSitterService precoServicoService;

    @MockBean
    private JwtService jwtService; // se o controller depende de autenticação

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = {"SITTER"})
    void deveCadastrarServicoComSucesso() throws Exception {
        Long sitterId = 1L;
        PrecoRequest request = new PrecoRequest("Passeio", 50.0);
        PrecoResponse response = new PrecoResponse(10L, "Passeio", 50.0);

        Mockito.when(precoServicoService.criarParaSitter(any(PrecoRequest.class), eq(sitterId)))
            .thenReturn(response);

        mockMvc.perform(post("/sitters/{sitterId}/servicos", sitterId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(10))
            .andExpect(jsonPath("$.descricao").value("Passeio"))
            .andExpect(jsonPath("$.valor").value(50.0));
    }
}


//comando para rodar o teste: mvn -Dtest=SitterServicoControllerTest test
