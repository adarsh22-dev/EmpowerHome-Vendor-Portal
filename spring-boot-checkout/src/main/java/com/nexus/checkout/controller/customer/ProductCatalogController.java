package com.nexus.checkout.controller.customer;

import com.nexus.checkout.model.Category;
import com.nexus.checkout.model.ProductRelation;
import com.nexus.checkout.model.WholesalePricingTier;
import com.nexus.checkout.service.customer.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductCatalogController {

    private final CustomerService customerService;

    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "newest") String sort) {
        return ResponseEntity.ok(customerService.getProducts(page, limit, category, search, sort));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return customerService.getProduct(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products/by-ids")
    public ResponseEntity<List<Map<String, Object>>> getProductsByIds(
            @RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(Long::parseLong).collect(Collectors.toList());
        return ResponseEntity.ok(customerService.getProductsByIds(idList));
    }

    @GetMapping("/products/{id}/tiers")
    public ResponseEntity<List<WholesalePricingTier>> getTiers(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getTiers(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(customerService.getCategories());
    }

    @GetMapping("/products/{id}/relations")
    public ResponseEntity<List<ProductRelation>> getProductRelations(
            @PathVariable Long id,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(customerService.getProductRelations(id, type));
    }
}
