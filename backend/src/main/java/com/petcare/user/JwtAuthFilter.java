package com.petcare.user;

import com.petcare.auth.JwtService;  // << correto
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

    String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (auth == null || !auth.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = auth.substring(7);
    String username;
    try {
      username = jwtService.extractUsername(token);
    } catch (Exception ex) {
      filterChain.doFilter(request, response);
      return;
    }

    // Exemplo simples: autentica com usuário "vazio" e sem authorities.
    // Integra com UserDetailsService depois.
    var authentication = new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
    SecurityContextHolder.getContext().setAuthentication(authentication);

    filterChain.doFilter(request, response);
  }
}
