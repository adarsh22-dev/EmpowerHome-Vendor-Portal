package com.nexus.checkout.repository;

import com.nexus.checkout.model.ProductRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRelationRepository extends JpaRepository<ProductRelation, Long> {
    List<ProductRelation> findByProductIdOrderBySortOrderAsc(Long productId);
    List<ProductRelation> findByProductIdAndRelationTypeOrderBySortOrderAsc(Long productId, String relationType);
}
