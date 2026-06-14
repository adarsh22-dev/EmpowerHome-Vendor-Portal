package com.nexus.checkout.service;

import com.nexus.checkout.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaEventPublisher {

    private final KafkaTemplate<String, Object> kafka;

    @Async
    public void publishOrderCreated(Order order) {
        try {
            kafka.send("order.created", String.valueOf(order.getId()), order);
            log.info("Published order.created event for order #{}", order.getId());
        } catch (Exception e) {
            log.error("Failed to publish order.created event", e);
        }
    }
}
