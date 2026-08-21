package com.fms.entity;

import com.fms.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;

    private Double budget;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private User freelancer;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
