package com.nexus.checkout.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnquiryRequest {
    private Long productId;
    private Long userId;

    @NotBlank
    private String message;
}
