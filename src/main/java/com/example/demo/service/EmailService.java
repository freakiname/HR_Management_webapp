package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Value("${frontend.origin}")
    private String FRONTEND_ORIGIN;
    @Value("${spring.mail.username}")
    private String from;


    // Méthode pour envoyer un email
    public void sendAccountCreationEmail(String to, String token) {
        String link = FRONTEND_ORIGIN + "/signup?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("Activate your account");
        message.setText("Please click the following link to activate your account: " + link);
        mailSender.send(message);
    }
}
