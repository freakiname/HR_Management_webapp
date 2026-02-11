package com.example.demo.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LeaveRequestUpdate (
    @NotNull(message = "start date is required")
    LocalDate startDate,

    @NotNull(message = "end date is required")
    LocalDate endDate,

    @NotNull(message = "reason is required")
    @Size(min = 2, max = 50, message = "min is 2 characters and max is 50 characters")
    String reason,

    String status // Optionnel, par défaut on garde l'ancien statut

){
    // Validation personnalisée : endDate doit être après ou égal à startDate
    public LeaveRequestUpdate {
        if (endDate != null && startDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("La date de fin doit être après ou égale à la date de début");
        }
    }
}

