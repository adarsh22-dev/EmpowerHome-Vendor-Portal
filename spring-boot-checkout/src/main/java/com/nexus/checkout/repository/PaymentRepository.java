package com.nexus.checkout.repository;

import com.nexus.checkout.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
}
