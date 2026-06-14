package com.nexus.checkout.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "wholesale_pricing_tiers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WholesalePricingTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "min_quantity", nullable = false)
    private Integer minQuantity;

    @Column(name = "max_quantity")
    private Integer maxQuantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
