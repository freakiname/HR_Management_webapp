package com.example.demo.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.config.JwtHelper;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.model.Employee;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.EmployeeRepo;
import com.example.demo.repository.UserAccountRepo;

@Service
public class AuthService {

    @Autowired
    private UserAccountRepo userAccountRepo;
    @Autowired
    private EmployeeRepo employeeRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtHelper jwtHelper;

    // Signup avec token d'activation
    public void signup(SignupRequest signupRequest, String token) {
        Employee employee = employeeRepo.findOneByAccountCreationToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (employee.isVerified()) {
            throw new RuntimeException("Account already created");
        }

        UserAccount account = new UserAccount();
        account.setUsername(signupRequest.username());
        account.setPassword(passwordEncoder.encode(signupRequest.password()));
        account.setEmployee(employee);
        userAccountRepo.save(account);

        employee.setVerified(true);
        employee.setAccountCreationToken(null);
        employeeRepo.save(employee);
    }

    // Login et génération JWT
    public String login(LoginRequest loginRequest) {
        // Authentification
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.username(),
                loginRequest.password()
            )
        );

        // Récupérer l’utilisateur
        UserAccount user = userAccountRepo.findByUsername(loginRequest.username())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Claims personnalisés (optionnel)
        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put("userId", user.getId());
        customClaims.put("role", user.getRole());

        // Générer et retourner le token JWT
        return jwtHelper.generateToken(customClaims, user);
    }
}

