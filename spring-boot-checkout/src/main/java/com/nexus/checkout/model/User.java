package com.nexus.checkout.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;

    @Column(length = 20)
    @Builder.Default
    private String role = "customer";

    private String avatar;

    @Column(name = "loyalty_balance")
    @Builder.Default
    private Integer loyaltyBalance = 0;

    @Column(name = "is_wholesale")
    @Builder.Default
    private Boolean isWholesale = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
