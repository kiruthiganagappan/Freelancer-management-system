package com.fms.controller;

import com.fms.dto.AdminDashboardResponse;
import com.fms.dto.ProjectResponse;
import com.fms.dto.StatusUpdateRequest;
import com.fms.dto.UserResponse;
import com.fms.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(adminService.getAllUsers(search, role));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> setUserStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(adminService.setUserStatus(id, request.isActive()));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.getAllProjects(search, status));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        adminService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
