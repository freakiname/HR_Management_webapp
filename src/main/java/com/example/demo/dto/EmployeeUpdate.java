package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EmployeeUpdate (
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String firstName,
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String lastName,
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String phone,
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String position
){}
