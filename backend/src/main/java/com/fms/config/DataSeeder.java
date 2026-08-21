package com.fms.config;

import com.fms.entity.User;
import com.fms.enums.Role;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default admin account on startup so the Admin Login page
 * has credentials to log in with out of the box.
 *
 * Default admin credentials:
 *   email:    admin@fms.com
 *   password: Admin@123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@fms.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@fms.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
        }
    }
}
