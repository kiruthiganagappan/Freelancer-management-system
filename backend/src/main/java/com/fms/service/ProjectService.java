package com.fms.service;

import com.fms.dto.ClientDashboardResponse;
import com.fms.dto.ProjectRequest;
import com.fms.dto.ProjectResponse;
import com.fms.entity.Project;
import com.fms.entity.User;
import com.fms.enums.ProjectStatus;
import com.fms.enums.Role;
import com.fms.exception.BadRequestException;
import com.fms.exception.ResourceNotFoundException;
import com.fms.exception.UnauthorizedException;
import com.fms.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CurrentUserService currentUserService;

@Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        User client = currentUserService.getCurrentUser();
        requireRole(client, Role.ROLE_CLIENT);

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .budget(request.getBudget())
                .deadline(request.getDeadline())
                .status(ProjectStatus.OPEN)
                .client(client)
                .build();

        return ProjectResponse.fromEntity(projectRepository.save(project));
    }

    public List<ProjectResponse> getMyProjects() {
        User client = currentUserService.getCurrentUser();
        requireRole(client, Role.ROLE_CLIENT);
        return projectRepository.findByClientOrderByCreatedAtDesc(client).stream()
                .map(ProjectResponse::fromEntity)
                .toList();
    }

    public ClientDashboardResponse getClientDashboard() {
        User client = currentUserService.getCurrentUser();
        requireRole(client, Role.ROLE_CLIENT);

        long total = projectRepository.countByClient(client);
        long open = projectRepository.countByClientAndStatus(client, ProjectStatus.OPEN);
        long inProgress = projectRepository.countByClientAndStatus(client, ProjectStatus.IN_PROGRESS);
        long completed = projectRepository.countByClientAndStatus(client, ProjectStatus.COMPLETED);

        return ClientDashboardResponse.builder()
                .totalProjects(total)
                .openProjects(open)
                .inProgressProjects(inProgress)
                .completedProjects(completed)
                .build();
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = findProjectOrThrow(id);
        return ProjectResponse.fromEntity(project);
    }

@Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        User client = currentUserService.getCurrentUser();
        Project project = findProjectOrThrow(id);
        ensureOwner(project, client);

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("Only OPEN projects can be edited");
        }

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setDeadline(request.getDeadline());

        return ProjectResponse.fromEntity(projectRepository.save(project));
    }

@Transactional
    public void deleteProject(Long id) {
        User client = currentUserService.getCurrentUser();
        Project project = findProjectOrThrow(id);
        ensureOwner(project, client);
        projectRepository.delete(project);
    }

@Transactional
    public ProjectResponse cancelProject(Long id) {
        User client = currentUserService.getCurrentUser();
        Project project = findProjectOrThrow(id);
        ensureOwner(project, client);

        if (project.getStatus() == ProjectStatus.COMPLETED) {
            throw new BadRequestException("Completed projects cannot be cancelled");
        }

        project.setStatus(ProjectStatus.CANCELLED);
        return ProjectResponse.fromEntity(projectRepository.save(project));
    }

@Transactional
    public ProjectResponse completeProject(Long id) {
        User client = currentUserService.getCurrentUser();
        Project project = findProjectOrThrow(id);
        ensureOwner(project, client);

        if (project.getStatus() != ProjectStatus.IN_PROGRESS) {
            throw new BadRequestException("Only IN_PROGRESS projects can be marked completed");
        }

        project.setStatus(ProjectStatus.COMPLETED);
        return ProjectResponse.fromEntity(projectRepository.save(project));
    }

    public List<ProjectResponse> getOpenProjects(String search) {
        List<Project> projects = (search == null || search.isBlank())
                ? projectRepository.findByStatus(ProjectStatus.OPEN)
                : projectRepository.findByTitleContainingIgnoreCase(search).stream()
                    .filter(p -> p.getStatus() == ProjectStatus.OPEN)
                    .toList();
        return projects.stream().map(ProjectResponse::fromEntity).toList();
    }

    public List<ProjectResponse> getAssignedProjects() {
        User freelancer = currentUserService.getCurrentUser();
        requireRole(freelancer, Role.ROLE_FREELANCER);
        return projectRepository.findByFreelancer(freelancer).stream()
                .map(ProjectResponse::fromEntity)
                .toList();
    }

@Transactional
    public ProjectResponse updateProgress(Long id, String statusStr) {
        User freelancer = currentUserService.getCurrentUser();
        Project project = findProjectOrThrow(id);

        if (project.getFreelancer() == null || !project.getFreelancer().getId().equals(freelancer.getId())) {
            throw new UnauthorizedException("You are not assigned to this project");
        }

        ProjectStatus newStatus;
        try {
            newStatus = ProjectStatus.valueOf(statusStr);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status value");
        }

        if (newStatus != ProjectStatus.IN_PROGRESS && newStatus != ProjectStatus.COMPLETED) {
            throw new BadRequestException("Freelancers may only set status to IN_PROGRESS or COMPLETED");
        }

        project.setStatus(newStatus);
        return ProjectResponse.fromEntity(projectRepository.save(project));
    }

    Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private void ensureOwner(Project project, User client) {
        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("You do not own this project");
        }
    }

    private void requireRole(User user, Role role) {
        if (user.getRole() != role) {
            throw new UnauthorizedException("This action requires role: " + role);
        }
    }
}
