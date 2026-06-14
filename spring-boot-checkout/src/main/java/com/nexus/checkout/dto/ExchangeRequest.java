package com.nexus.checkout.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExchangeRequest {
    @NotNull private Long userId;
    @NotNull private Long deviceId;
    @NotBlank private String deviceCondition;
    @NotBlank private String pincode;
}
