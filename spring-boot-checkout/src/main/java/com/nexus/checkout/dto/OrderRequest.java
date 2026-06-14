package com.nexus.checkout.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    @NotNull private Long userId;
    @NotEmpty private List<OrderItem> items;

    @Data
    public static class OrderItem {
        @NotNull private Long productId;
        @Min(1) private int quantity;
    }
}
