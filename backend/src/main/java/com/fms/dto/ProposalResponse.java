package com.fms.dto;

import com.fms.entity.Proposal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {
    private Long id;
    private String message;
    private Double expectedBudget;
    private String status;
    private Long projectId;
    private String projectTitle;
    private Long freelancerId;
    private String freelancerName;
    private LocalDateTime createdAt;

    public static ProposalResponse fromEntity(Proposal proposal) {
        return ProposalResponse.builder()
                .id(proposal.getId())
                .message(proposal.getMessage())
                .expectedBudget(proposal.getExpectedBudget())
                .status(proposal.getStatus().name())
                .projectId(proposal.getProject().getId())
                .projectTitle(proposal.getProject().getTitle())
                .freelancerId(proposal.getFreelancer().getId())
                .freelancerName(proposal.getFreelancer().getName())
                .createdAt(proposal.getCreatedAt())
                .build();
    }
}
