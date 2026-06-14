package com.nexus.checkout.controller.customer;

import com.nexus.checkout.dto.AuthRequest;
import com.nexus.checkout.dto.AuthResponse;
import com.nexus.checkout.security.JwtTokenProvider;
import com.nexus.checkout.service.customer.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CustomerService customerService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest req) {
        try {
            AuthResponse resp = customerService.register(req);
            String token = tokenProvider.generateToken(resp.getId(), resp.getEmail(), resp.getRole());
            resp.setToken(token);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        try {
            AuthResponse resp = customerService.login(req);
            String token = tokenProvider.generateToken(resp.getId(), resp.getEmail(), resp.getRole());
            resp.setToken(token);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
