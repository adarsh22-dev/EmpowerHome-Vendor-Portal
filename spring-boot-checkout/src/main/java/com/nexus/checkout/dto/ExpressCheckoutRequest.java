package com.nexus.checkout.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ExpressCheckoutRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private String paymentMode;

    @Valid
    @NotNull(message = "Customer details are required")
    private CustomerInfo customer;

    @Data
    public static class CustomerInfo {
        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required")
        private String email;

        @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$", message = "Invalid phone number")
        private String phone;

        private String pincode;
        private String address;
        private Long userId;
    }
}
