package com.nexus.checkout.controller;

import com.nexus.checkout.dto.ExpressCheckoutRequest;
import com.nexus.checkout.dto.ExpressCheckoutResponse;
import com.nexus.checkout.dto.SpamCheckResponse;
import com.nexus.checkout.service.CheckoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/express-checkout")
    public ResponseEntity<ExpressCheckoutResponse> expressCheckout(
            @Valid @RequestBody ExpressCheckoutRequest request,
            HttpServletRequest httpRequest) {

        String ip = httpRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = httpRequest.getRemoteAddr();
        }

        try {
            ExpressCheckoutResponse response = checkoutService.processExpressCheckout(request, ip);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Checkout failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ExpressCheckoutResponse.builder()
                            .status("error")
                            .message(e.getMessage())
                            .build()
            );
        }
    }

    @PostMapping("/check-spam")
    public ResponseEntity<SpamCheckResponse> checkSpam(
            @RequestBody Map<String, String> body) {

        String email = body.getOrDefault("email", "");
        boolean isSpam = email != null && email.contains("spam");
        int recentOrders = isSpam ? 5 : 0;

        return ResponseEntity.ok(SpamCheckResponse.builder()
                .isSpam(isSpam)
                .recentOrders(recentOrders)
                .riskLevel(recentOrders > 3 ? "high" : recentOrders > 0 ? "medium" : "low")
                .build());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "nexus-checkout",
                "status", "UP",
                "version", "1.0.0"
        ));
    }
}
