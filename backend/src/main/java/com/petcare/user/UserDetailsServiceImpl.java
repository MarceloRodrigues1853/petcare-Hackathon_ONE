package com.petcare.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

=======
// Essa classe implementa a interface UserDetailsService do Spring Security
// Ela é responsável por buscar o usuário no banco de dados durante o processo de login
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // Repositório que acessa os dados dos usuários no banco
    private final UserRepository userRepository;

    // Construtor com injeção de dependência
>>>>>>> main
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

<<<<<<< HEAD
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

=======
    // Método obrigatório da interface UserDetailsService
    // Recebe o "username" (aqui usamos o email) e retorna um UserDetails
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca o usuário pelo email no banco
        // Se não encontrar, lança uma exceção que o Spring trata automaticamente
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        // Converte o User para UserDetails usando a classe UserDetailsImpl
>>>>>>> main
        return new UserDetailsImpl(user);
    }
}
