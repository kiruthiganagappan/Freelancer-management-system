package com.fms.service;

import com.fms.dto.FreelancerDashboardResponse;
import com.fms.dto.ProposalRequest;
import com.fms.dto.ProposalResponse;
import com.fms.entity.Project;
import com.fms.entity.Proposal;
import com.fms.entity.User;
import com.fms.enums.ProjectStatus;
import com.fms.enums.ProposalStatus;
import com.fms.enums.Role;
import com.fms.exception.BadRequestException;
import com.fms.exception.ResourceNotFoundException;
import com.fms.exception.UnauthorizedException;
import com.fms.repository.ProjectRepository;
import com.fms.repository.ProposalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public ProposalResponse applyForProject(ProposalRequest request) {
        User freelancer = currentUserService.getCurrentUser();
        requireRole(freelancer, Role.ROLE_FREELANCER);

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("You can only apply to OPEN projects");
        }

        if (proposalRepository.existsByFreelancerAndProject(freelancer, project)) {
            throw new BadRequestException("You have already applied for this project");
        }

        Proposal proposal = Proposal.builder()
                .message(request.getMessage())
                .expectedBudget(request.getExpectedBudget())
                .status(ProposalStatus.PENDING)
                .freelancer(freelancer)
                .project(project)
                .build();

        return ProposalResponse.fromEntity(proposalRepository.save(proposal));
    }

    public List<ProposalResponse> getMyApplications() {
        User freelancer = currentUserService.getCurrentUser();
        requireRole(freelancer, Role.ROLE_FREELANCER);
        return proposalRepository.findByFreelancerOrderByCreatedAtDesc(freelancer).stream()
                .map(ProposalResponse::fromEntity)
                .toList();
    }

    public List<ProposalResponse> getProposalsForProject(Long projectId) {
        User client = currentUserService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("You do not own this project");
        }

        return proposalRepository.findByProjectOrderByCreatedAtDesc(project).stream()
                .map(ProposalResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ProposalResponse decideProposal(Long proposalId, String decision) {
        User client = currentUserService.getCurrentUser();
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        Project project = proposal.getProject();
        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("You do not own this project");
        }

        ProposalStatus status;
        try {
            status = ProposalStatus.valueOf(decision);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid decision. Must be ACCEPTED or REJECTED");
        }

        if (status == ProposalStatus.ACCEPTED) {
            if (project.getStatus() != ProjectStatus.OPEN) {
                throw new BadRequestException("Project is no longer open");
            }
            project.setFreelancer(proposal.getFreelancer());
            project.setStatus(ProjectStatus.IN_PROGRESS);
            projectRepository.save(project);

            // reject other pending proposals for this project
            proposalRepository.findByProject(project).forEach(p -> {
                if (!p.getId().equals(proposal.getId()) && p.getStatus() == ProposalStatus.PENDING) {
                    p.setStatus(ProposalStatus.REJECTED);
                    proposalRepository.save(p);
                }
            });
        }

        proposal.setStatus(status);
        return ProposalResponse.fromEntity(proposalRepository.save(proposal));
    }

    public FreelancerDashboardResponse getFreelancerDashboard() {
        User freelancer = currentUserService.getCurrentUser();
        requireRole(freelancer, Role.ROLE_FREELANCER);

        long available = projectRepository.findByStatus(ProjectStatus.OPEN).size();
        long applied = proposalRepository.findByFreelancerOrderByCreatedAtDesc(freelancer).size();
        long assigned = projectRepository.findByFreelancer(freelancer).stream()
                .filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS)
                .count();
        long completed = projectRepository.findByFreelancer(freelancer).stream()
                .filter(p -> p.getStatus() == ProjectStatus.COMPLETED)
                .count();

        return FreelancerDashboardResponse.builder()
                .availableProjects(available)
                .appliedProjects(applied)
                .assignedProjects(assigned)
                .completedProjects(completed)
                .build();
    }

    private void requireRole(User user, Role role) {
        if (user.getRole() != role) {
            throw new UnauthorizedException("This action requires role: " + role);
        }
    }
}
