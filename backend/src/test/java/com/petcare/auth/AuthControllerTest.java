/*
package com.petcare.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.RegisterResponse;
import com.petcare.user.Role;
import com.petcare.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;


    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;




    @Test
    void deveRetornarTokenAoFazerLoginComCredenciaisValidas() throws Exception {
        LoginRequest req = new LoginRequest("tay@email.com", "123456");
        LoginResponse res = new LoginResponse("fake-jwt-token");

        Mockito.when(authService.login(any(LoginRequest.class))).thenReturn(res);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
    }

    @Test
    void deveRetornarErroAoFazerLoginComCredenciaisInvalidas() throws Exception {
        LoginRequest req = new LoginRequest("tay@email.com", "senhaErrada");

        Mockito.when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Credenciais inválidas"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveRegistrarNovoUsuarioComSucesso() throws Exception {
        RegisterRequest req = new RegisterRequest(
                "Tay",
                "tay@email.com",
                "123456",
                Role.OWNER.name() // ou Role.SITTER.name()
        );

        RegisterResponse res = new RegisterResponse(
                1L,
                "Tay",
                "tay@email.com",
                Role.OWNER.name()
        );

        Mockito.when(authService.register(any(RegisterRequest.class))).thenReturn(res);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Tay"))
                .andExpect(jsonPath("$.email").value("tay@email.com"))
                .andExpect(jsonPath("$.role").value("OWNER"));
    }

    @Test
    void deveRetornarErroAoRegistrarUsuarioComDadosInvalidos() throws Exception {
        RegisterRequest req = new RegisterRequest("", "", "", "");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}

*/