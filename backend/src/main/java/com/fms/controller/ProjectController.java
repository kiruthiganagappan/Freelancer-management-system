package com.fms.controller;

import com.fms.dto.ClientDashboardResponse;
import com.fms.dto.ProjectRequest;
import com.fms.dto.ProjectResponse;
import com.fms.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // ===== CLIENT ENDPOINTS =====

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects());
    }

    @GetMapping("/dashboard/client")
    public ResponseEntity<ClientDashboardResponse> getClientDashboard() {
        return ResponseEntity.ok(projectService.getClientDashboard());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ProjectResponse> cancelProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.cancelProject(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ProjectResponse> completeProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.completeProject(id));
    }

    // ===== SHARED / FREELANCER ENDPOINTS =====

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getOpenProjects(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(projectService.getOpenProjects(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<ProjectResponse>> getAssignedProjects() {
        return ResponseEntity.ok(projectService.getAssignedProjects());
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<ProjectResponse> updateProgress(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(projectService.updateProgress(id, body.get("status")));
    }
}
