package com.nexus.checkout.repository;

import com.nexus.checkout.model.ExchangeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeCategoryRepository extends JpaRepository<ExchangeCategory, Long> {
}
