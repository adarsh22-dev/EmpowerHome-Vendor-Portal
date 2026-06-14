package com.nexus.checkout.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StaffRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String role;
    private Boolean active;
}
