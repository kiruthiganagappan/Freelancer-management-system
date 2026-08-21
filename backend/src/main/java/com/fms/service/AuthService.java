package com.fms.service;

import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.dto.RegisterRequest;
import com.fms.entity.User;
import com.fms.enums.Role;
import com.fms.exception.BadRequestException;
import com.fms.exception.UnauthorizedException;
import com.fms.repository.UserRepository;
import com.fms.security.JwtUtil;
import com.fms.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role. Must be ROLE_CLIENT or ROLE_FREELANCER");
        }

        if (role == Role.ROLE_ADMIN) {
            throw new BadRequestException("Admin accounts cannot be self-registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();

        User saved = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(saved);
        String token = jwtUtil.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Your account has been deactivated. Contact the administrator.");
        }

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtUtil.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse adminLogin(LoginRequest request) {
        AuthResponse response = login(request);
        if (!response.getRole().equals(Role.ROLE_ADMIN.name())) {
            throw new UnauthorizedException("This login is reserved for administrators");
        }
        return response;
    }
}
