package com.nexus.checkout.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
@Order(1)
@Slf4j
public class RateLimitingFilter implements Filter {

    private final StringRedisTemplate redis;

    public RateLimitingFilter(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpRes = (HttpServletResponse) response;
        String path = httpReq.getRequestURI();

        if (path.startsWith("/api/express-checkout")) {
            String ip = httpReq.getHeader("X-Forwarded-For");
            if (ip == null) ip = httpReq.getRemoteAddr();

            String key = "ratelimit:checkout:" + ip;
            Long count = redis.opsForValue().increment(key);
            if (count != null && count == 1) {
                redis.expire(key, 60, TimeUnit.SECONDS);
            }

            if (count != null && count > 5) {
                httpRes.setStatus(429);
                httpRes.setContentType("application/json");
                httpRes.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
