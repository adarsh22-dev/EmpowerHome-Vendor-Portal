package com.nexus.checkout.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class WholesaleBulkOrderRequest {

    @NotNull
    private Long userId;

    @NotEmpty
    private List<BulkItem> items;

    @Data
    public static class BulkItem {
        @NotNull
        private Long productId;

        @Min(1)
        private int quantity;
    }
}
