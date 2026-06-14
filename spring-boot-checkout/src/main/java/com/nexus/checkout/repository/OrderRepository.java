package com.nexus.checkout.repository;

import com.nexus.checkout.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt > :since")
    long countOrdersSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shippingAddress LIKE %:email% AND o.createdAt > :since")
    long countOrdersByEmailSince(@Param("email") String email, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.ipAddress = :ip AND o.createdAt > :since")
    long countOrdersByIpSince(@Param("ip") String ip, @Param("since") LocalDateTime since);
}
