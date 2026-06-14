package com.nexus.checkout.repository;

import com.nexus.checkout.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findAllByOrderByCreatedAtDesc();
}
