package com.nexus.checkout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SpamCheckResponse {
    private boolean isSpam;
    private int recentOrders;
    private String riskLevel;
}
