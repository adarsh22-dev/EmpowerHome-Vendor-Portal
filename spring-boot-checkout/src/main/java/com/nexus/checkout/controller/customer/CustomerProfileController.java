package com.nexus.checkout.controller.customer;

import com.nexus.checkout.dto.EnquiryRequest;
import com.nexus.checkout.dto.ExchangeRequest;
import com.nexus.checkout.model.*;
import com.nexus.checkout.service.customer.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final CustomerService customerService;

    // --- Users ---
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return customerService.getUser(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        customerService.updateUser(id, body.get("name"), body.get("avatar"));
        return ResponseEntity.ok(Map.of("message", "User updated"));
    }

    // --- Notifications ---
    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(customerService.getNotifications(userId));
    }

    // --- Loyalty ---
    @GetMapping("/loyalty/{userId}")
    public ResponseEntity<?> getLoyalty(@PathVariable Long userId) {
        return customerService.getUser(userId)
                .map(u -> ResponseEntity.ok(Map.of("balance", u.getLoyaltyBalance())))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Enquiries ---
    @GetMapping("/enquiries")
    public ResponseEntity<List<Enquiry>> getEnquiries() {
        return ResponseEntity.ok(customerService.getEnquiries());
    }

    @PostMapping("/enquiries")
    public ResponseEntity<Enquiry> createEnquiry(@Valid @RequestBody EnquiryRequest req) {
        return ResponseEntity.ok(customerService.createEnquiry(req));
    }

    // --- Exchange ---
    @GetMapping("/exchange/settings")
    public ResponseEntity<Map<String, Object>> getExchangeSettings() {
        return ResponseEntity.ok(customerService.getExchangeSettings());
    }

    @GetMapping("/exchange/categories")
    public ResponseEntity<List<ExchangeCategory>> getExchangeCategories() {
        return ResponseEntity.ok(customerService.getExchangeCategories());
    }

    @GetMapping("/exchange/devices")
    public ResponseEntity<List<ExchangeDevice>> getExchangeDevices(
            @RequestParam(required = false) Long categoryId) {
        if (categoryId == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(customerService.getExchangeDevices(categoryId));
    }

    @GetMapping("/exchange/pincodes")
    public ResponseEntity<?> checkPincode(@RequestParam String pincode) {
        boolean available = customerService.checkPincode(pincode);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PostMapping("/exchanges")
    public ResponseEntity<Map<String, Object>> createExchange(
            @Valid @RequestBody ExchangeRequest req) {
        return ResponseEntity.ok(customerService.createExchange(req));
    }
}
