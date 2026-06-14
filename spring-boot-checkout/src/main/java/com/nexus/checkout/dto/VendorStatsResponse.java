package com.nexus.checkout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class VendorStatsResponse {
    private long totalRevenue;
    private long totalOrders;
    private long totalProducts;
    private double averageOrderValue;
}
