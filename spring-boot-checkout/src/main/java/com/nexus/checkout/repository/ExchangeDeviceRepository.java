package com.nexus.checkout.repository;

import com.nexus.checkout.model.ExchangeDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeDeviceRepository extends JpaRepository<ExchangeDevice, Long> {
    List<ExchangeDevice> findByCategoryId(Long categoryId);
}
