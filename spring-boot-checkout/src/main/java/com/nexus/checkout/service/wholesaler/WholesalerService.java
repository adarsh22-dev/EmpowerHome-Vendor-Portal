package com.nexus.checkout.service.wholesaler;

import com.nexus.checkout.dto.WholesaleBulkOrderRequest;
import com.nexus.checkout.model.*;
import com.nexus.checkout.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WholesalerService {

    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final WholesalePricingTierRepository tierRepo;

    public List<WholesalePricingTier> getTiers(Long productId) {
        return tierRepo.findByProductIdOrderByMinQuantityAsc(productId);
    }

    @Transactional
    public Map<String, Object> placeBulkOrder(WholesaleBulkOrderRequest request) {
        List<Map<String, Object>> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (WholesaleBulkOrderRequest.BulkItem item : request.getItems()) {
            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            List<WholesalePricingTier> tiers = tierRepo.findByProductIdOrderByMinQuantityAsc(product.getId());
            BigDecimal unitPrice = product.getPrice();

            for (WholesalePricingTier tier : tiers) {
                if (item.getQuantity() >= tier.getMinQuantity() &&
                        (tier.getMaxQuantity() == null || item.getQuantity() <= tier.getMaxQuantity())) {
                    unitPrice = tier.getPrice();
                    break;
                }
            }

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);

            product.setStock(product.getStock() - item.getQuantity());
            productRepo.save(product);

            Map<String, Object> itemMap = new LinkedHashMap<>();
            itemMap.put("productId", product.getId());
            itemMap.put("name", product.getName());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("unitPrice", unitPrice);
            itemMap.put("lineTotal", lineTotal);
            items.add(itemMap);
        }

        String shippingJson = "{\"userId\":" + request.getUserId() + "}";
        Order order = Order.builder()
                .userId(request.getUserId())
                .total(total)
                .status(OrderStatus.CONFIRMED)
                .paymentStatus("pending")
                .paymentMode("wholesale")
                .shippingAddress(shippingJson)
                .build();
        order = orderRepo.save(order);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("orderId", order.getId());
        response.put("total", total);
        response.put("items", items);
        response.put("status", "confirmed");
        response.put("message", "Bulk order #ORD-" + order.getId() + " placed successfully");
        return response;
    }
}
