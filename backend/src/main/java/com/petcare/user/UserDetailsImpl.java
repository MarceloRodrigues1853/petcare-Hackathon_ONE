package com.petcare.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
<<<<<<< HEAD

import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {

    private final User user;

=======
import java.util.Collection;
import java.util.List;

// Implementa a interface UserDetails do Spring Security
// Essa classe adapta a entidade User para o formato que o Spring usa na autenticação
public class UserDetailsImpl implements UserDetails {

    // Armazena o usuário original vindo do banco
    private final User user;

    // Construtor que recebe o usuário
>>>>>>> main
    public UserDetailsImpl(User user) {
        this.user = user;
    }

<<<<<<< HEAD
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()));
    }

=======
    // Retorna as permissões (authorities) do usuário
    // Aqui usamos o papel (role) como uma autoridade
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Exemplo: retorna "ADMIN", "SITTER", "OWNER"
        return List.of(new SimpleGrantedAuthority(user.getRole().name()));
    }

    // Retorna a senha do usuário (criptografada)
>>>>>>> main
    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

<<<<<<< HEAD
    @Override
    public String getUsername() {
        return user.getEmail(); // usamos email como identificador
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // pode personalizar depois
=======
    // Retorna o identificador do usuário — aqui usamos o email como "username"
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // Os métodos abaixo indicam se a conta está ativa e válida
    // Aqui deixamos tudo como "true", mas você pode personalizar depois

    @Override
    public boolean isAccountNonExpired() {
        return true; // Conta não expirada
>>>>>>> main
    }

    @Override
    public boolean isAccountNonLocked() {
<<<<<<< HEAD
        return true; // pode personalizar depois
=======
        return true; // Conta não bloqueada
>>>>>>> main
    }

    @Override
    public boolean isCredentialsNonExpired() {
<<<<<<< HEAD
        return true; // pode personalizar depois
=======
        return true; // Credenciais válidas
>>>>>>> main
    }

    @Override
    public boolean isEnabled() {
<<<<<<< HEAD
        return true; // pode personalizar depois
    }

=======
        return true; // Usuário está ativo
    }

    // Getter opcional para acessar o objeto User original, se precisar
>>>>>>> main
    public User getUser() {
        return user;
    }
}
<<<<<<< HEAD
=======

//Essa classe é um adaptador: ela transforma sua entidade User (ou Sitter, Owner, etc.)
// em algo que o Spring Security entende — ou seja, um UserDetails.
//
//Ela é usada internamente pelo Spring durante o processo de autenticação. Quando alguém
// faz login, o Spring chama o UserDetailsServiceImpl, que busca o usuário no banco e
// transforma ele em UserDetailsImpl.
>>>>>>> main
