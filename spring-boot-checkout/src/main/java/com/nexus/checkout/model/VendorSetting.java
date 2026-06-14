package com.nexus.checkout.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "store_email")
    private String storeEmail;

    @Column(name = "store_address", columnDefinition = "TEXT")
    private String storeAddress;

    @Column(name = "store_banner")
    private String storeBanner;

    @Column(columnDefinition = "TEXT")
    private String policies;
}
