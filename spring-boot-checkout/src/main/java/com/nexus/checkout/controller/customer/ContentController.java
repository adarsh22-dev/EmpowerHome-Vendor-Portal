package com.nexus.checkout.controller.customer;

import com.nexus.checkout.model.*;
import com.nexus.checkout.service.customer.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContentController {

    private final CustomerService customerService;

    @GetMapping("/promotions")
    public ResponseEntity<List<Promotion>> getPromotions() {
        return ResponseEntity.ok(customerService.getPromotions());
    }

    @GetMapping("/home-banners")
    public ResponseEntity<List<Banner>> getHomeBanners() {
        return ResponseEntity.ok(customerService.getHomeBanners());
    }

    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getCoupons() {
        return ResponseEntity.ok(customerService.getCoupons());
    }

    @GetMapping("/blogs")
    public ResponseEntity<List<Blog>> getBlogs() {
        return ResponseEntity.ok(customerService.getBlogs());
    }

    @GetMapping("/blogs/{slug}")
    public ResponseEntity<?> getBlogBySlug(@PathVariable String slug) {
        return customerService.getBlogBySlug(slug)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/platform-settings")
    public ResponseEntity<Map<String, Object>> getPlatformSettings() {
        return ResponseEntity.ok(customerService.getPlatformSettings());
    }

    @GetMapping("/instagram-feeds")
    public ResponseEntity<List<InstagramFeed>> getInstagramFeeds() {
        return ResponseEntity.ok(customerService.getInstagramFeeds());
    }

    @GetMapping("/faqs")
    public ResponseEntity<List<Faq>> getFaqs(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(customerService.getFaqs(category));
    }
}
