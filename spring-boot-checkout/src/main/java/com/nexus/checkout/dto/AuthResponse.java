package com.nexus.checkout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String token;
    private Boolean isWholesale;
}
