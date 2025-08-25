package com.petcare.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

// Implementa a interface UserDetails do Spring Security
// Essa classe adapta a entidade User para o formato que o Spring usa na autenticação
public class UserDetailsImpl implements UserDetails {

    // Armazena o usuário original vindo do banco
    private final User user;

    // Construtor que recebe o usuário
    public UserDetailsImpl(User user) {
        this.user = user;
    }

    // Retorna as permissões (authorities) do usuário
    // Aqui usamos o papel (role) como uma autoridade
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Exemplo: retorna "ADMIN", "SITTER", "OWNER"
        return List.of(new SimpleGrantedAuthority(user.getRole().name()));
    }

    // Retorna a senha do usuário (criptografada)
    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

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
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Conta não bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credenciais válidas
    }

    @Override
    public boolean isEnabled() {
        return true; // Usuário está ativo
    }

    // Getter opcional para acessar o objeto User original, se precisar
    public User getUser() {
        return user;
    }
}
