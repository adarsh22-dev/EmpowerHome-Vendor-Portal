package com.nexus.checkout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ExpressCheckoutResponse {
    private String status;
    private Long orderId;
    private Integer riskScore;
    private String message;
    private String estimatedDelivery;
    private Boolean requiresOTP;
}
