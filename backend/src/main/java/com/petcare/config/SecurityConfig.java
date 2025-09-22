package com.petcare.config;

import com.petcare.auth.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter;

  private static final String[] SWAGGER_WHITELIST = {
      "/swagger-ui.html",
      "/swagger-ui/**",
      "/v3/api-docs",
      "/v3/api-docs/**",
      "/v3/api-docs.yaml",
      "/swagger-resources/**",
      "/webjars/**"
  };

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> {})
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // públicos
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers(SWAGGER_WHITELIST).permitAll()
            .requestMatchers("/api/auth/**", "/auth/**").permitAll()
            .requestMatchers("/ping", "/error").permitAll()

            // público: listagem de sitters e serviços por sitter
            .requestMatchers(HttpMethod.GET, "/api/sitters").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/sitters/*/services").permitAll()

            // áreas protegidas por AUTHORITY
            .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
            .requestMatchers("/api/owners/**").hasAnyAuthority("OWNER", "ADMIN")

            // sitter "me" só para SITTER
            .requestMatchers("/api/sitters/me/**").hasAuthority("SITTER")

            // demais endpoints de /api/sitters/** exigem SITTER ou ADMIN
            .requestMatchers("/api/sitters/**").hasAnyAuthority("SITTER", "ADMIN")

            // qualquer outra rota autenticada
            .anyRequest().authenticated()
        )
        .exceptionHandling(e -> e
            .authenticationEntryPoint((req, res, ex) -> res.sendError(401, "Unauthorized"))
            .accessDeniedHandler((req, res, ex) -> res.sendError(403, "Forbidden"))
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
    cfg.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","Origin","X-Requested-With"));
    cfg.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", cfg);
    return src;
  }
}
