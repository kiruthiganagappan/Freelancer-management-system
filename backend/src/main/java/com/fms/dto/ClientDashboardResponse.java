package com.fms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDashboardResponse {
    private long totalProjects;
    private long openProjects;
    private long inProgressProjects;
    private long completedProjects;
}
