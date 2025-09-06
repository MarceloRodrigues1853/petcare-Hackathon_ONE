package com.petcare.sitter.ServicoPrecoSitter;

import org.springframework.stereotype.Service;

import com.petcare.precoServico.PrecoServico;
import com.petcare.user.User;
import com.petcare.user.UserRepository;

@Service
public class PrecoPorSitterService {

    private final PrecoServicoRepository repository;
    private final UserRepository userRepository;

    public PrecoPorSitterService(PrecoServicoRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public PrecoResponse criarParaSitter(PrecoRequest request, Long sitterId) {
        User user = userRepository.findById(sitterId)
            .orElseThrow(() -> new RuntimeException("Sitter não encontrado"));

        if (user.getRole() != User.Role.SITTER) {
            throw new RuntimeException("Usuário não é uma sitter");
        }

        boolean jaExiste = repository.existsByUser_IdAndDescricao(sitterId, request.getDescricao());
        if (jaExiste) {
            throw new RuntimeException("Esse tipo de serviço já foi cadastrado por esse usuário.");
        }

        PrecoServico ps = new PrecoServico();
        ps.setDescricao(request.getDescricao());
        ps.setValor(request.getValor());

        repository.save(ps);

        return new PrecoResponse(
            ps.getId(),
            ps.getDescricao(),
            ps.getValor()
        );
    }

    //CRIAR METODO PARA EXCLUIR PRECO E SERVICO E LISTAR
}