package com.rachnika.backend.service.impl;

import com.rachnika.backend.dto.request.LoginRequest;
import com.rachnika.backend.dto.request.RegisterRequest;
import com.rachnika.backend.dto.response.AuthResponse;
import com.rachnika.backend.entity.User;
import com.rachnika.backend.enums.Role;
import com.rachnika.backend.exception.BadRequestException;
import com.rachnika.backend.exception.ResourceNotFoundException;
import com.rachnika.backend.repository.UserRepository;
import com.rachnika.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.ROLE_BUYER)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);

        return AuthResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .token("mock-jwt-token-" + saved.getId())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials!");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token("mock-jwt-token-" + user.getId())
                .build();
    }
}