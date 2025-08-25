package com.petcare.auth;

import com.petcare.user.User;
import com.petcare.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

//Esta classe é um filtro que pega todas as requisições HTTP antes de chgar aos controllers.

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService; // Serviço responsável por manipular o token JWT

    @Autowired
    private UserRepository userRepo; // Repositório para buscar o usuário no banco

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extrai o cabeçalho Authorization da requisição
        String authHeader = request.getHeader("Authorization");

        // Verifica se o cabeçalho está presente e começa com "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Se não estiver, segue o fluxo sem autenticar
            filterChain.doFilter(request, response);
            return;
        }

        // Remove o prefixo "Bearer " para obter o token JWT
        String token = authHeader.substring(7);

        // Extrai o e-mail do usuário a partir do token
        String email = jwtService.extractEmail(token);

        // Verifica se o e-mail foi extraído e se ainda não há autenticação no contexto
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Busca o usuário no banco pelo e-mail
            Optional<User> userOptional = userRepo.findByEmail(email);

            // Verifica se o usuário existe e se o token é válido
            if (userOptional.isPresent() && jwtService.isTokenValid(token, userOptional.get())) {

                User user = userOptional.get();

                // Extrai a role do token JWT
                String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));

                // Cria o objeto de autenticação com a role do usuário
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user, null, List.of(new SimpleGrantedAuthority(role))
                );

                // Define a autenticação no contexto de segurança do Spring
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
