package com.nexus.checkout.service;

import com.nexus.checkout.dto.ExpressCheckoutRequest;
import com.nexus.checkout.dto.ExpressCheckoutResponse;
import com.nexus.checkout.model.Order;
import com.nexus.checkout.model.OrderStatus;
import com.nexus.checkout.model.Product;
import com.nexus.checkout.repository.OrderRepository;
import com.nexus.checkout.repository.ProductRepository;
import com.nexus.checkout.service.FraudDetectionService.FraudResult;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutService {

    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final FraudDetectionService fraudService;
    private final KafkaEventPublisher eventPublisher;

    @Transactional
    public ExpressCheckoutResponse processExpressCheckout(
            ExpressCheckoutRequest request, String ipAddress) {

        Product product = productRepo.findByIdWithLock(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        FraudResult fraud = fraudService.evaluate(request, ipAddress);

        if (fraud.isFlagged()) {
            return ExpressCheckoutResponse.builder()
                    .status("flagged")
                    .riskScore(fraud.getRiskScore())
                    .message("Order flagged: " + fraud.getReasons())
                    .requiresOTP(fraud.isRequiresOTP())
                    .build();
        }

        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        String shippingJson = String.format(
                "{\"name\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\",\"address\":\"%s\"}",
                request.getCustomer().getName(),
                request.getCustomer().getEmail(),
                request.getCustomer().getPhone(),
                request.getCustomer().getAddress()
        );

        Order order = Order.builder()
                .userId(request.getCustomer().getUserId() != null
                        ? request.getCustomer().getUserId() : 1L)
                .total(total)
                .status(OrderStatus.CONFIRMED)
                .paymentStatus("cod".equals(request.getPaymentMode()) ? "pending" : "paid")
                .paymentMode(request.getPaymentMode())
                .shippingAddress(shippingJson)
                .riskScore(fraud.getRiskScore())
                .ipAddress(ipAddress)
                .build();

        order = orderRepo.save(order);

        product.setStock(product.getStock() - request.getQuantity());
        productRepo.save(product);

        eventPublisher.publishOrderCreated(order);

        log.info("Express order created: #ORD-{} for ${}", order.getId(), total);

        return ExpressCheckoutResponse.builder()
                .status("success")
                .orderId(order.getId())
                .riskScore(fraud.getRiskScore())
                .message(String.format("Order #ORD-%d placed successfully!", order.getId()))
                .estimatedDelivery(LocalDate.now().plusDays(5).toString())
                .build();
    }
}
