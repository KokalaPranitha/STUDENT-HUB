package com.studenthub.service.impl;

import com.studenthub.config.JwtTokenProvider;
import com.studenthub.dto.AuthResponse;
import com.studenthub.dto.LoginRequest;
import com.studenthub.dto.SignUpRequest;
import com.studenthub.entity.User;
import com.studenthub.exception.DuplicateResourceException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.UserRepository;
import com.studenthub.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        // Resolve actual username if email was provided
        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials. Account not found."));

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            String token = tokenProvider.generateToken(authentication);

            return new AuthResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole(),
                    "Login successful"
            );
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid credentials. Incorrect password.", e);
        }
    }

    @Override
    @Transactional
    public AuthResponse register(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername().trim())) {
            throw new DuplicateResourceException("Username '" + signUpRequest.getUsername().trim() + "' is already taken.");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("Email address '" + signUpRequest.getEmail().trim() + "' is already registered.");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername().trim());
        user.setEmail(signUpRequest.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName().trim());
        user.setRole(signUpRequest.getRole() != null && !signUpRequest.getRole().trim().isEmpty()
                ? signUpRequest.getRole().trim()
                : "ROLE_ADMIN");

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenFromUsername(savedUser.getUsername());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole(),
                "User registered successfully"
        );
    }

    @Override
    public AuthResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return new AuthResponse(
                null,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                "Current user details"
        );
    }
}
