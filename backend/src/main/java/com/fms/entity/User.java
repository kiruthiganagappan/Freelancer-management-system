package com.fms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fms.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    // Freelancer profile fields
    @Column(length = 1000)
    private String skills;

    private String experience;

    @Column(length = 2000)
    private String bio;

    private String availability;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
