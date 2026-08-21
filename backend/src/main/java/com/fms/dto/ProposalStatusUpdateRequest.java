package com.fms.dto;

import lombok.Data;

@Data
public class ProposalStatusUpdateRequest {
    private String status; // ACCEPTED or REJECTED
}
