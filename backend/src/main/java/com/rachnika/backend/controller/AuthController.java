package com.rachnika.backend.controller;

import com.rachnika.backend.dto.request.LoginRequest;
import com.rachnika.backend.dto.request.RegisterRequest;
import com.rachnika.backend.dto.response.ApiResponse;
import com.rachnika.backend.entity.User;
import com.rachnika.backend.enums.Role;
import com.rachnika.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * User Registration with Phone, Email, Name, and Password
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest request) {
        String cleanPhone = request.getPhone().replaceAll("\\D", "");
        String cleanEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByPhone(cleanPhone)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.ok("Mobile number is already registered", null));
        }

        if (userRepository.existsByEmail(cleanEmail)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.ok("Email address is already registered", null));
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setPhone(cleanPhone);
        user.setEmail(cleanEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_BUYER);
        user.setVerified(true);

        User savedUser = userRepository.save(user);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", savedUser.getId());
        userData.put("name", savedUser.getName());
        userData.put("phone", savedUser.getPhone());
        userData.put("email", savedUser.getEmail());
        userData.put("role", savedUser.getRole() != null ? savedUser.getRole().name() : "ROLE_BUYER");

        return ResponseEntity.ok(ApiResponse.ok("Registration successful! You can now log in.", userData));
    }

    /**
     * User Login with (Mobile No or Email) + Password
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        String password = request.getPassword();

        // Search by phone or email
        Optional<User> optionalUser = userRepository.findByPhone(identifier.replaceAll("\\D", ""));
        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByEmail(identifier.toLowerCase());
        }

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.ok("Account not found with this mobile number or email", null));
        }

        User user = optionalUser.get();

        // Validate password against hashed password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.ok("Incorrect password. Please try again.", null));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("phone", user.getPhone());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole() != null ? user.getRole().name() : "ROLE_BUYER");

        return ResponseEntity.ok(ApiResponse.ok("Login successful!", userData));
    }
}