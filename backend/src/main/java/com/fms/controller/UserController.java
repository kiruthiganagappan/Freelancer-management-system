package com.fms.controller;

import com.fms.dto.ProfileUpdateRequest;
import com.fms.dto.UserResponse;
import com.fms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/freelancers")
    public ResponseEntity<List<UserResponse>> getAllFreelancers() {
        return ResponseEntity.ok(userService.getAllFreelancers());
    }

    @GetMapping("/api/profile")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/api/profile")
    public ResponseEntity<UserResponse> updateMyProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateMyProfile(request));
    }
}
