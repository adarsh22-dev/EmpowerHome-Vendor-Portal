package com.nexus.checkout.controller.customer;

import com.nexus.checkout.dto.WishlistRequest;
import com.nexus.checkout.model.WishlistItem;
import com.nexus.checkout.service.customer.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final CustomerService customerService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<WishlistItem>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(customerService.getWishlist(userId));
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@Valid @RequestBody WishlistRequest req) {
        try {
            return ResponseEntity.ok(customerService.addToWishlist(req.getUserId(), req.getProductId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> removeFromWishlist(@RequestBody WishlistRequest req) {
        customerService.removeFromWishlist(req.getUserId(), req.getProductId());
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }
}
