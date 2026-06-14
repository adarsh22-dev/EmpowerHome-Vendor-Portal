package com.nexus.checkout.repository;

import com.nexus.checkout.model.ExchangePincode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExchangePincodeRepository extends JpaRepository<ExchangePincode, Long> {
    Optional<ExchangePincode> findByPincode(String pincode);
}
