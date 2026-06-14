package com.nexus.checkout.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull private Long productId;
    @NotNull private Long userId;
    @Min(1) @Max(5) private int rating;
    private String comment;
}
