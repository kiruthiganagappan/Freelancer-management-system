package com.fms.entity;

import com.fms.enums.ProposalStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "proposals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2000)
    private String message;

    private Double expectedBudget;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProposalStatus status = ProposalStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
