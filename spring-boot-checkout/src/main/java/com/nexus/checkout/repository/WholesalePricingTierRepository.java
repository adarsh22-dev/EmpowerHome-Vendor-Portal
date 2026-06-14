package com.nexus.checkout.repository;

import com.nexus.checkout.model.WholesalePricingTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WholesalePricingTierRepository extends JpaRepository<WholesalePricingTier, Long> {
    List<WholesalePricingTier> findByProductIdOrderByMinQuantityAsc(Long productId);
}
