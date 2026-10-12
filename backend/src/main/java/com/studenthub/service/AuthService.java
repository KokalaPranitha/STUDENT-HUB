package com.studenthub.service;

import com.studenthub.dto.AuthResponse;
import com.studenthub.dto.LoginRequest;
import com.studenthub.dto.SignUpRequest;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse register(SignUpRequest signUpRequest);
    AuthResponse getCurrentUser(String username);
}
