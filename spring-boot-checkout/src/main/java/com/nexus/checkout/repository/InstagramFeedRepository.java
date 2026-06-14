package com.nexus.checkout.repository;

import com.nexus.checkout.model.InstagramFeed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstagramFeedRepository extends JpaRepository<InstagramFeed, Long> {
    List<InstagramFeed> findByIsActiveTrueOrderBySortOrderAsc();
}
