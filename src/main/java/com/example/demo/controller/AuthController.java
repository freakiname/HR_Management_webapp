package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Value("${frontend.origin}")
    private String frontendOrigin;

    // Signup avec token d'activation
    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestBody @Valid SignupRequest signupRequest,
            @RequestParam String token
    ) {
        authService.signup(signupRequest, token);
        return ResponseEntity.status(HttpStatus.CREATED).body("Signed Up successfully");
    }

    // Login → retourne JWT directement
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody @Valid LoginRequest loginRequest
    ) {
        String token = authService.login(loginRequest);
        return ResponseEntity.ok(token);
    }
    
    // Redirection vers le frontend pour les anciens liens
    @GetMapping("/signup")
    public RedirectView redirectToFrontendSignup(@RequestParam String token) {
        return new RedirectView(frontendOrigin + "/signup?token=" + token);
    }
}
