package com.nexus.checkout.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@Order(0)
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter implements Filter {

    private final JwtTokenProvider tokenProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpReq = (HttpServletRequest) request;
        String authHeader = httpReq.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = tokenProvider.validateToken(token);
            if (claims != null) {
                httpReq.setAttribute("userId", claims.get("userId", Long.class));
                httpReq.setAttribute("userRole", claims.get("role", String.class));
                httpReq.setAttribute("userEmail", claims.getSubject());
            }
        }

        chain.doFilter(request, response);
    }
}
