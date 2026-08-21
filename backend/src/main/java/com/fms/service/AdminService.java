package com.fms.service;

import com.fms.dto.AdminDashboardResponse;
import com.fms.dto.ProjectResponse;
import com.fms.dto.UserResponse;
import com.fms.entity.Project;
import com.fms.entity.User;
import com.fms.enums.ProjectStatus;
import com.fms.enums.Role;
import com.fms.exception.BadRequestException;
import com.fms.exception.ResourceNotFoundException;
import com.fms.repository.ProjectRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public AdminDashboardResponse getDashboard() {
        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalClients(userRepository.countByRole(Role.ROLE_CLIENT))
                .totalFreelancers(userRepository.countByRole(Role.ROLE_FREELANCER))
                .totalProjects(projectRepository.count())
                .openProjects(projectRepository.countByStatus(ProjectStatus.OPEN))
                .completedProjects(projectRepository.countByStatus(ProjectStatus.COMPLETED))
                .build();
    }

    public List<UserResponse> getAllUsers(String search, String role) {
        List<User> users;
        if (role != null && !role.isBlank()) {
            users = userRepository.findByRole(Role.valueOf(role));
        } else {
            users = userRepository.findAll();
        }

        if (search != null && !search.isBlank()) {
            String needle = search.toLowerCase();
            users = users.stream()
                    .filter(u -> u.getName().toLowerCase().contains(needle) || u.getEmail().toLowerCase().contains(needle))
                    .toList();
        }

        return users.stream().map(UserResponse::fromEntity).toList();
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new BadRequestException("Admin accounts cannot be deleted");
        }
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse setUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new BadRequestException("Admin account status cannot be changed");
        }
        user.setActive(active);
        return UserResponse.fromEntity(userRepository.save(user));
    }

    public List<ProjectResponse> getAllProjects(String search, String status) {
        List<Project> projects;
        if (status != null && !status.isBlank()) {
            projects = projectRepository.findByStatus(ProjectStatus.valueOf(status));
        } else {
            projects = projectRepository.findAll();
        }

        if (search != null && !search.isBlank()) {
            String needle = search.toLowerCase();
            projects = projects.stream()
                    .filter(p -> p.getTitle().toLowerCase().contains(needle))
                    .toList();
        }
        return projects.stream().map(ProjectResponse::fromEntity).toList();
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        projectRepository.delete(project);
    }
}
