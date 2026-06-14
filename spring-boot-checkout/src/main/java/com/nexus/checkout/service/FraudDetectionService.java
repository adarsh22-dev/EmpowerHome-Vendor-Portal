package com.nexus.checkout.service;

import com.nexus.checkout.dto.ExpressCheckoutRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionService {

    private final StringRedisTemplate redis;

    @Value("${fraud.rate-limit.max-orders-per-minute:10}")
    private int maxOrdersPerMinute;

    @Value("${fraud.rate-limit.max-orders-per-email-5min:3}")
    private int maxOrdersPerEmail;

    @Value("${fraud.rate-limit.max-orders-per-ip-minute:5}")
    private int maxOrdersPerIp;

    @Value("${fraud.risk-threshold:50}")
    private int riskThreshold;

    public FraudResult evaluate(ExpressCheckoutRequest request, String ipAddress) {
        int score = 0;
        StringBuilder reasons = new StringBuilder();
        String emailKey = "orders:email:" + request.getCustomer().getEmail();
        String ipKey = "orders:ip:" + ipAddress;
        String globalKey = "orders:global:" + LocalDateTime.now().getMinute();

        Long globalCount = redis.opsForValue().increment(globalKey);
        if (globalCount != null && globalCount == 1) {
            redis.expire(globalKey, 60, TimeUnit.SECONDS);
        }
        if (globalCount != null && globalCount > maxOrdersPerMinute) {
            score += 30;
            reasons.append("High global order velocity. ");
        }

        Long emailCount = redis.opsForValue().increment(emailKey);
        if (emailCount != null && emailCount == 1) {
            redis.expire(emailKey, 300, TimeUnit.SECONDS);
        }
        if (emailCount != null && emailCount > maxOrdersPerEmail) {
            score += 40;
            reasons.append("Duplicate customer detected. ");
        }

        Long ipCount = redis.opsForValue().increment(ipKey);
        if (ipCount != null && ipCount == 1) {
            redis.expire(ipKey, 60, TimeUnit.SECONDS);
        }
        if (ipCount != null && ipCount > maxOrdersPerIp) {
            score += 30;
            reasons.append("IP rate limit exceeded. ");
        }

        boolean isFlagged = score >= riskThreshold;

        log.info("Fraud evaluation: score={}, flagged={}, reasons={}", score, isFlagged, reasons);

        return FraudResult.builder()
                .riskScore(score)
                .isFlagged(isFlagged)
                .requiresOTP(isFlagged && score < 80)
                .reasons(reasons.toString())
                .build();
    }

    @lombok.Builder
    @lombok.Data
    public static class FraudResult {
        private int riskScore;
        private boolean isFlagged;
        private boolean requiresOTP;
        private String reasons;
    }
}
