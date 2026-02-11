package com.example.demo.dto;

import java.time.LocalDate;
import java.util.UUID;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public record EmployeeCreate(
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String firstName,
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String lastName,
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String email,
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String phone,
    @NotNull(message = "last name is required")
    @PastOrPresent(message = "Hire date cannot be in the future")
    LocalDate hireDate,
    @NotNull(message = "first name is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String position,
    @NotNull(message = "department id is required")
    UUID departmentId
){}

