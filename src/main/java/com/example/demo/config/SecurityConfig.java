package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean 
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Configuration CORS
            .csrf(csrf -> csrf.disable()) // désactive CSRF
            .formLogin(form -> form.disable()) // désactive le formulaire HTML
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT stateless
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/login",
                    "/auth/signup",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/h2-console/**"
                ).permitAll()
                .requestMatchers(HttpMethod.DELETE, "/departments/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/departments/create-department").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/departments/edit/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/departments/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/employees/me").hasAnyRole("ADMIN", "USER") // Récupérer son propre employé
                .requestMatchers(HttpMethod.GET, "/employees/*").hasAnyRole("ADMIN", "USER") // Permettre GET /employees/{id} pour ADMIN et USER
                .requestMatchers(HttpMethod.POST, "/employees").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/employees").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/employees/*").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.DELETE, "/employees/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/leaveRequests").hasRole("ADMIN") // Récupérer toutes les demandes (admin uniquement)
                .requestMatchers(HttpMethod.POST, "/leaveRequests/{employeeId}").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.GET, "/leaveRequests/{employeeId}").hasAnyRole("ADMIN", "USER")
                .requestMatchers(HttpMethod.PUT, "/leaveRequests/{leaveRequestId}").hasAnyRole("ADMIN", "USER")
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())); // pour H2 frame

        // Ajouter le filtre JWT avant UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public org.springframework.web.filter.HiddenHttpMethodFilter hiddenHttpMethodFilter() {
        return new org.springframework.web.filter.HiddenHttpMethodFilter();
    }
}
