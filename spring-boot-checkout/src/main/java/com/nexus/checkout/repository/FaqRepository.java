package com.nexus.checkout.repository;

import com.nexus.checkout.model.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByIsActiveTrueOrderBySortOrderAsc();
    List<Faq> findByCategoryAndIsActiveTrueOrderBySortOrderAsc(String category);
}
