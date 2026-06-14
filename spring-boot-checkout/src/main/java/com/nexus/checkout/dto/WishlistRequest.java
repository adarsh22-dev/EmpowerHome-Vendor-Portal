package com.nexus.checkout.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistRequest {
    @NotNull private Long userId;
    @NotNull private Long productId;
}
