package com.fms.dto;

import com.fms.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private Double budget;
    private LocalDate deadline;
    private String status;
    private Long clientId;
    private String clientName;
    private Long freelancerId;
    private String freelancerName;
    private LocalDateTime createdAt;

    public static ProjectResponse fromEntity(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .budget(project.getBudget())
                .deadline(project.getDeadline())
                .status(project.getStatus().name())
                .clientId(project.getClient() != null ? project.getClient().getId() : null)
                .clientName(project.getClient() != null ? project.getClient().getName() : null)
                .freelancerId(project.getFreelancer() != null ? project.getFreelancer().getId() : null)
                .freelancerName(project.getFreelancer() != null ? project.getFreelancer().getName() : null)
                .createdAt(project.getCreatedAt())
                .build();
    }
}
