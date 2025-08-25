package com.petcare.config;

import com.petcare.auth.JwtAuthFilter;
import com.petcare.user.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig {

  @Autowired
  private JwtAuthFilter jwtAuthFilter;

  // Declara um bean do tipo AuthenticationProvider
// Esse bean será usado pelo Spring Security para autenticar usuários
  @Bean
  public AuthenticationProvider authenticationProvider(UserDetailsServiceImpl userDetailsService) {

    // Cria uma instância do DaoAuthenticationProvider
    // Esse é o provedor padrão do Spring que usa dados do banco de dados
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

    // Define o serviço que carrega os dados do usuário (email, senha, role)
    // Esse serviço é sua classe UserDetailsServiceImpl
    authProvider.setUserDetailsService(userDetailsService);

    // Define o algoritmo de criptografia usado para verificar a senha
    // Aqui usamos BCrypt, que é seguro e recomendado
    authProvider.setPasswordEncoder(new BCryptPasswordEncoder());

    // Retorna o provedor configurado para ser usado na autenticação
    return authProvider;
  }


  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
    return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/**").permitAll()
                    .requestMatchers("/admin/**").hasAuthority("ADMIN")
                    .requestMatchers("/sitter/**").hasAuthority("SITTER")
                    .requestMatchers("/user/**").hasAuthority("OWNER") // ou "USER", se preferir
                    .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
  }

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("http://localhost:5173").allowedMethods("*");
      }
    };
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }



}
