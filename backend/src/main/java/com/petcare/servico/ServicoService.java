package com.petcare.servico;

<<<<<<< HEAD
public class ServicoService {

=======

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    // Criar serviço
    public Servico createServico(Servico servico) {
        return servicoRepository.save(servico);
    }

    // Buscar serviço por id
    public Servico getServicoById(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado com id " + id));
    }

    // Listar todos os serviços
    public List<Servico> getAllServicos() {
        return servicoRepository.findAll();
    }

    /* Em construção
    public Servico updateServico(Long id, Servico servicoAtualizado) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado com id " + id));

        
        return servicoRepository.save(servico);
    }
*/
    // Deletar serviço
    public void deleteServico(Long id) {
        if (!servicoRepository.existsById(id)) {
            throw new RuntimeException("Serviço não encontrado com id " + id);
        }
        servicoRepository.deleteById(id);
    }
>>>>>>> 2113f9d (Resolvendo conflitos do Git. Complemento da entidade Servico)
}
