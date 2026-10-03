package com.rachnika.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    private String email; // Added to resolve line 53

    private String phone;

    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;
}