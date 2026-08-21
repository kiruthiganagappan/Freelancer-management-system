package com.fms.repository;

import com.fms.entity.User;
import com.fms.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    List<User> findByRoleAndNameContainingIgnoreCaseOrRoleAndEmailContainingIgnoreCase(
            Role role1, String name, Role role2, String email);
}
