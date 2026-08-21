package com.fms.repository;

import com.fms.entity.Project;
import com.fms.entity.User;
import com.fms.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClient(User client);
    List<Project> findByClientOrderByCreatedAtDesc(User client);
    List<Project> findByFreelancer(User freelancer);
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByClientAndStatus(User client, ProjectStatus status);
    long countByClient(User client);
    long countByClientAndStatus(User client, ProjectStatus status);
    long countByStatus(ProjectStatus status);
    List<Project> findByTitleContainingIgnoreCase(String title);
}
