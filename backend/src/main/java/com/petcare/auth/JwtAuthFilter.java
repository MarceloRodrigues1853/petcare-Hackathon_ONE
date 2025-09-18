package com.petcare.auth;

import com.petcare.user.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();
    private static final List<String> PUBLIC_PATHS = List.of(
        "/api/health/**",
        "/actuator/**",
        "/api/auth/**",
        "/auth/**",
        "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**",
        "/ping"
    );

    private boolean isPublic(String path) {
        for (String p : PUBLIC_PATHS) if (PATH_MATCHER.match(p, path)) return true;
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String path = request.getServletPath();

        if (isPublic(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        try {
            String username = jwtService.extractUsername(jwt);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
                    if (authorities == null || authorities.isEmpty()) {
                        authorities = List.of(new SimpleGrantedAuthority("ROLE_OWNER"));
                    }

                    var auth = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities().isEmpty()
                          ? List.of(new SimpleGrantedAuthority("ROLE_OWNER"))
                          : userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException ex) {
            logger.warn("Invalid JWT", ex);
        }

        filterChain.doFilter(request, response);
    }
}
