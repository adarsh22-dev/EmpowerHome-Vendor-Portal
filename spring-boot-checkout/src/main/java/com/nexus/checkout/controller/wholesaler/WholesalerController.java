package com.nexus.checkout.controller.wholesaler;

import com.nexus.checkout.dto.WholesaleBulkOrderRequest;
import com.nexus.checkout.model.WholesalePricingTier;
import com.nexus.checkout.service.wholesaler.WholesalerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WholesalerController {

    private final WholesalerService wholesalerService;

    @GetMapping("/products/{id}/tiers")
    public ResponseEntity<List<WholesalePricingTier>> getTiers(
            @PathVariable Long id) {
        return ResponseEntity.ok(wholesalerService.getTiers(id));
    }

    @PostMapping("/wholesale/bulk-order")
    public ResponseEntity<Map<String, Object>> placeBulkOrder(
            @Valid @RequestBody WholesaleBulkOrderRequest request) {
        try {
            Map<String, Object> result = wholesalerService.placeBulkOrder(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/wholesale/tiers")
    public ResponseEntity<List<WholesalePricingTier>> getAllTiers(
            @RequestParam Long productId) {
        return ResponseEntity.ok(wholesalerService.getTiers(productId));
    }
}
