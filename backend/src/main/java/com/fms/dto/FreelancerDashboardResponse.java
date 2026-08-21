package com.fms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerDashboardResponse {
    private long availableProjects;
    private long appliedProjects;
    private long assignedProjects;
    private long completedProjects;
}
