package com.nexus.checkout.repository;

import com.nexus.checkout.model.VendorSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorSettingRepository extends JpaRepository<VendorSetting, Long> {
    Optional<VendorSetting> findByVendorId(Long vendorId);
}
