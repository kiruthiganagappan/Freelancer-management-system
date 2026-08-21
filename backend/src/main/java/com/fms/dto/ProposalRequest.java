package com.fms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProposalRequest {
    @NotNull(message = "Project id is required")
    private Long projectId;

    @NotBlank(message = "Proposal message is required")
    private String message;

    @NotNull(message = "Expected budget is required")
    @Positive(message = "Expected budget must be positive")
    private Double expectedBudget;
}
