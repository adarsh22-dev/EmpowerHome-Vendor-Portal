package com.nexus.checkout.controller.customer;

import com.nexus.checkout.dto.ReviewRequest;
import com.nexus.checkout.model.Review;
import com.nexus.checkout.service.customer.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@RequestParam Long productId) {
        return ResponseEntity.ok(customerService.getReviews(productId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.ok(customerService.createReview(req));
    }
}
