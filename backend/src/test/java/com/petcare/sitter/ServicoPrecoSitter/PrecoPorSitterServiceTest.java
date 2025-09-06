package com.petcare.sitter.ServicoPrecoSitter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.petcare.sitter.ServicoPrecoSitter.PrecoServicoRepository;
import com.petcare.user.User;
import com.petcare.user.UserRepository;
import com.petcare.sitter.ServicoPrecoSitter.PrecoPorSitterService;
import com.petcare.sitter.ServicoPrecoSitter.PrecoRequest;
import com.petcare.sitter.ServicoPrecoSitter.PrecoResponse;

@ExtendWith(MockitoExtension.class)
public class PrecoPorSitterServiceTest {

    @Mock
    private PrecoServicoRepository precoServicoRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PrecoPorSitterService service;

    @Test
    void deveCriarPrecoParaSitterComSucesso() {
        Long sitterId = 1L;
        PrecoRequest request = new PrecoRequest("Passeio", 50.0);

        User user = new User();
        user.setId(sitterId);
        user.setRole(User.Role.SITTER);

        when(userRepository.findById(sitterId)).thenReturn(Optional.of(user));
        when(precoServicoRepository.existsByUser_IdAndDescricao(sitterId, "Passeio")).thenReturn(false);

        PrecoResponse response = service.criarParaSitter(request, sitterId);

        assertEquals("Passeio", response.getDescricao());
        assertEquals(50.0, response.getValor());
    }


    @Test
    void deveLancarExcecaoQuandoUsuarioNaoExiste() {
        Long sitterId = 99L;
        PrecoRequest request = new PrecoRequest("Banho", 30.0);

        when(userRepository.findById(sitterId)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            service.criarParaSitter(request, sitterId);
        });

        assertEquals("Sitter não encontrado", ex.getMessage());
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioNaoEhSitter() {
        Long sitterId = 2L;
        PrecoRequest request = new PrecoRequest("Tosa", 40.0);

        User user = new User();
        user.setId(sitterId);
        user.setRole(User.Role.OWNER); // papel errado

        when(userRepository.findById(sitterId)).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            service.criarParaSitter(request, sitterId);
        });

        assertEquals("Usuário não é uma sitter", ex.getMessage());
    }
}


//comando para rodar o teste: mvn -Dtest=PrecoPorSitterServiceTest test