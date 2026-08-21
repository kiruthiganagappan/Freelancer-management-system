package com.fms.service;

import com.fms.dto.ProfileUpdateRequest;
import com.fms.dto.UserResponse;
import com.fms.entity.User;
import com.fms.enums.Role;
import com.fms.exception.UnauthorizedException;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public List<UserResponse> getAllFreelancers() {
        return userRepository.findByRole(Role.ROLE_FREELANCER).stream()
                .filter(User::isActive)
                .map(UserResponse::fromEntity)
                .toList();
    }

    public UserResponse getMyProfile() {
        return UserResponse.fromEntity(currentUserService.getCurrentUser());
    }

    @Transactional
    public UserResponse updateMyProfile(ProfileUpdateRequest request) {
        User user = currentUserService.getCurrentUser();

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        user.setSkills(request.getSkills());
        user.setExperience(request.getExperience());
        user.setBio(request.getBio());
        user.setAvailability(request.getAvailability());

        return UserResponse.fromEntity(userRepository.save(user));
    }

    private void requireRole(User user, Role role) {
        if (user.getRole() != role) {
            throw new UnauthorizedException("This action requires role: " + role);
        }
    }
}
