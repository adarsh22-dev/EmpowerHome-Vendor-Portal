package com.nexus.checkout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CategorySalesResponse {
    private String category;
    private long count;
    private double revenue;
}
