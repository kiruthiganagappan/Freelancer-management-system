package com.fms.dto;

import com.fms.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private String skills;
    private String experience;
    private String bio;
    private String availability;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .skills(user.getSkills())
                .experience(user.getExperience())
                .bio(user.getBio())
                .availability(user.getAvailability())
                .build();
    }
}
