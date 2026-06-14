package com.nexus.checkout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SalesTrendResponse {
    private String month;
    private long revenue;
    private long orders;
}
