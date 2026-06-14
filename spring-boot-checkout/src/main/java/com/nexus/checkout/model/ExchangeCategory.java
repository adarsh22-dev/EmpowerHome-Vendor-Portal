package com.nexus.checkout.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exchange_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
