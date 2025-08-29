package com.petcare.auth;

<<<<<<< HEAD
=======
import com.petcare.user.User;
import com.petcare.user.UserRepository;
>>>>>>> main
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
<<<<<<< HEAD
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
=======
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
>>>>>>> main
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
<<<<<<< HEAD
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

    if (SecurityContextHolder.getContext().getAuthentication() != null) {
      filterChain.doFilter(request, response);
      return;
    }

    String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (auth == null || !auth.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = auth.substring(7);

    try {
      String username = jwtService.extractUsername(token);
      var authentication =
          new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
      SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (Exception ignored) {
      // token inválido/expirado → segue sem autenticar
    }

    filterChain.doFilter(request, response);
  }
=======
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

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
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
>>>>>>> main
}
