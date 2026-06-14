package com.nexus.checkout.controller.customer;

import com.nexus.checkout.dto.OrderRequest;
import com.nexus.checkout.model.Order;
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
public class CustomerOrderController {

    private final CustomerService customerService;

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest req) {
        try {
            return ResponseEntity.ok(customerService.createOrder(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(customerService.getUserOrders(userId));
    }
}
