/*
package com.petcare.sitter;

import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.auth.JwtService;
import com.petcare.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SitterController.class)
@AutoConfigureMockMvc(addFilters = false)
class SitterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SitterService sitterService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtService jwtService;


    private final String email = "tay@example.com";

    private UsernamePasswordAuthenticationToken auth() {
        return new UsernamePasswordAuthenticationToken(email, null);
    }

    @Test
    void deveRetornarPerfilDoSitterAutenticado() throws Exception {
        SitterResponse response = new SitterResponse("Tay", email);
        when(sitterService.getProfile(email)).thenReturn(response);

        mockMvc.perform(get("/api/sitter/profile")
                        .principal(auth()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Tay"))
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    void deveAtualizarPerfilDoSitter() throws Exception {
        SitterRequest request = new SitterRequest("Tay Atualizada", "nova@example.com", null);
        SitterResponse response = new SitterResponse("Tay Atualizada", "nova@example.com");

        when(sitterService.updateProfile(any(), any())).thenReturn(response);

        mockMvc.perform(put("/api/sitter/profile")
                        .principal(auth())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Tay Atualizada"))
                .andExpect(jsonPath("$.email").value("nova@example.com"));
    }

    @Test
    void deveExcluirPerfilDoSitter() throws Exception {
        mockMvc.perform(delete("/api/sitter/profile")
                        .principal(auth()))
                .andExpect(status().isNoContent());

        verify(sitterService).deleteProfile(email);
    }
}
*/