package com.example.demo.dto;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;

public record SignupRequest (
    @NotNull(message = "username is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String username,

    @NotNull(message = "password is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String password
){}

