package com.petcare.config;

import com.petcare.auth.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    private static final String[] PUBLIC_ROUTES = {
        "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
        "/api/auth/**", "/ping",
        "/api/health/**", "/actuator/**"
    };

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_ROUTES).permitAll()

                // Pets: qualquer usuário autenticado pode listar/buscar;
                // mutações restritas a OWNER/ADMIN (se quiser apertar depois, use regras por método)
                .requestMatchers("/api/pets/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/pets/**").authenticated()   // ← temporário
                .requestMatchers(HttpMethod.PUT,  "/api/pets/**").hasAnyRole("OWNER","ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/api/pets/**").hasAnyRole("OWNER","ADMIN")

                .requestMatchers("/api/owners/**").hasAnyRole("OWNER", "ADMIN")
                .requestMatchers("/api/sitters/**").hasAnyRole("SITTER", "ADMIN")
                .requestMatchers("/api/agendamentos/**").authenticated()
                .requestMatchers("/api/servicos/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "Referer", "User-Agent", "Cache-Control", "Pragma", "Expires", "X-Requested-With"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }
}
