package com.nexus.checkout.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exchange_pincodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangePincode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String pincode;

    @Builder.Default
    private Boolean available = true;
}
