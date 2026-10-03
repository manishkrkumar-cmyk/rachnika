package com.rachnika.backend.service;

import com.rachnika.backend.dto.request.LoginRequest;
import com.rachnika.backend.dto.request.RegisterRequest;
import com.rachnika.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}