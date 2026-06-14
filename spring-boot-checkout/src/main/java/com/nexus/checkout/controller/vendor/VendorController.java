package com.nexus.checkout.controller.vendor;

import com.nexus.checkout.dto.*;
import com.nexus.checkout.model.*;
import com.nexus.checkout.service.vendor.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping("/stats")
    public ResponseEntity<VendorStatsResponse> getStats(
            @RequestParam(defaultValue = "1") Long vendorId) {
        return ResponseEntity.ok(vendorService.getStats(vendorId));
    }

    @GetMapping("/sales-trends")
    public ResponseEntity<List<SalesTrendResponse>> getSalesTrends() {
        return ResponseEntity.ok(vendorService.getSalesTrends());
    }

    @GetMapping("/category-sales")
    public ResponseEntity<List<CategorySalesResponse>> getCategorySales() {
        return ResponseEntity.ok(vendorService.getCategorySales());
    }

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(
            @RequestParam(defaultValue = "1") Long vendorId) {
        return vendorService.getSettings(vendorId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(Map.of()));
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(vendorService.getProducts());
    }

    @PostMapping("/products/bulk")
    public ResponseEntity<String> bulkCreateProducts(
            @Valid @RequestBody List<BulkProductRequest> products) {

        for (BulkProductRequest p : products) {
            Product product = Product.builder()
                    .name(p.getName())
                    .price(p.getPrice())
                    .stock(p.getStock())
                    .build();
            vendorService.saveProduct(product);
        }
        return ResponseEntity.ok(products.size() + " products created");
    }

    @GetMapping("/shipping")
    public ResponseEntity<List<Map<String, Object>>> getShippingMethods() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getPayments(
            @RequestParam(defaultValue = "1") Long vendorId) {
        return ResponseEntity.ok(vendorService.getPayments(vendorId));
    }

    @GetMapping("/shipments")
    public ResponseEntity<List<Shipment>> getShipments(
            @RequestParam(defaultValue = "1") Long vendorId) {
        return ResponseEntity.ok(vendorService.getShipments(vendorId));
    }

    @GetMapping("/enquiries")
    public ResponseEntity<List<Enquiry>> getEnquiries() {
        return ResponseEntity.ok(vendorService.getEnquiries());
    }

    @PostMapping("/enquiries")
    public ResponseEntity<Enquiry> createEnquiry(
            @Valid @RequestBody EnquiryRequest request) {
        return ResponseEntity.ok(vendorService.createEnquiry(request));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<Staff>> getStaff() {
        return ResponseEntity.ok(vendorService.getStaff());
    }

    @PostMapping("/staff")
    public ResponseEntity<Staff> createStaff(
            @Valid @RequestBody StaffRequest request) {
        return ResponseEntity.ok(vendorService.createStaff(request));
    }

    @GetMapping("/staff/activity")
    public ResponseEntity<List<Map<String, Object>>> getStaffActivity() {
        return ResponseEntity.ok(List.of());
    }
}
