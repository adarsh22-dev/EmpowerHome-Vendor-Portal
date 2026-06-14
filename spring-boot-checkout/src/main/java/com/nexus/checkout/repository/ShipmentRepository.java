package com.nexus.checkout.repository;

import com.nexus.checkout.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
}
