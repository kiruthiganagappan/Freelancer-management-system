package com.fms.repository;

import com.fms.entity.Project;
import com.fms.entity.Proposal;
import com.fms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByFreelancerOrderByCreatedAtDesc(User freelancer);
    List<Proposal> findByProject(Project project);
    Optional<Proposal> findByFreelancerAndProject(User freelancer, Project project);
    boolean existsByFreelancerAndProject(User freelancer, Project project);
    List<Proposal> findByProjectOrderByCreatedAtDesc(Project project);
}
