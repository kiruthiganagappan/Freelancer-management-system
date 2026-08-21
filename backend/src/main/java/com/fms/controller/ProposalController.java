package com.fms.controller;

import com.fms.dto.FreelancerDashboardResponse;
import com.fms.dto.ProposalRequest;
import com.fms.dto.ProposalResponse;
import com.fms.service.ProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;

    @PostMapping
    public ResponseEntity<ProposalResponse> applyForProject(@Valid @RequestBody ProposalRequest request) {
        return ResponseEntity.ok(proposalService.applyForProject(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProposalResponse>> getMyApplications() {
        return ResponseEntity.ok(proposalService.getMyApplications());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProposalResponse>> getProposalsForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(proposalService.getProposalsForProject(projectId));
    }

    @PutMapping("/{id}/decision")
    public ResponseEntity<ProposalResponse> decideProposal(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(proposalService.decideProposal(id, body.get("status")));
    }

    @GetMapping("/dashboard/freelancer")
    public ResponseEntity<FreelancerDashboardResponse> getFreelancerDashboard() {
        return ResponseEntity.ok(proposalService.getFreelancerDashboard());
    }
}
