package com.nexus.checkout.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BulkProductRequest {
    @NotBlank
    private String name;

    private String sku;
    private String description;

    @Positive
    private BigDecimal price;

    @Positive
    private Integer stock;
}
