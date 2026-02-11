package com.example.demo.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

public record LeaveRequestCreate (
    @NotNull(message = "start date is required")
    @PastOrPresent(message = "Hire date cannot be in the future")
    LocalDate startDate,

    @NotNull(message = "end date is required")
    @FutureOrPresent(message = "Hire date must be in the future")
    LocalDate endDate,

    @NotNull(message = "reason is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String reason,

    String status // Optionnel, par défaut "PENDING"

){}
