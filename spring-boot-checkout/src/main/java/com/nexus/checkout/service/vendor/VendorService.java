package com.nexus.checkout.service.vendor;

import com.nexus.checkout.dto.*;
import com.nexus.checkout.model.*;
import com.nexus.checkout.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final VendorSettingRepository vendorSettingRepo;
    private final PaymentRepository paymentRepo;
    private final ShipmentRepository shipmentRepo;
    private final EnquiryRepository enquiryRepo;
    private final StaffRepository staffRepo;

    public VendorStatsResponse getStats(Long vendorId) {
        List<Order> orders = orderRepo.findAll();
        long totalRevenue = orders.stream()
                .mapToLong(o -> o.getTotal().longValue())
                .sum();
        long totalOrders = orders.size();
        long totalProducts = productRepo.count();
        double avgOrderValue = totalOrders > 0 ? (double) totalRevenue / totalOrders : 0.0;
        return VendorStatsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .averageOrderValue(avgOrderValue)
                .build();
    }

    public List<SalesTrendResponse> getSalesTrends() {
        List<Order> orders = orderRepo.findAll();
        Map<String, SalesTrendResponse> trendMap = new LinkedHashMap<>();
        for (Order o : orders) {
            String month = o.getCreatedAt().toString().substring(0, 7);
            trendMap.merge(month, SalesTrendResponse.builder()
                    .month(month)
                    .revenue(o.getTotal().longValue())
                    .orders(1)
                    .build(), (a, b) -> SalesTrendResponse.builder()
                    .month(month)
                    .revenue(a.getRevenue() + b.getRevenue())
                    .orders(a.getOrders() + b.getOrders())
                    .build());
        }
        return new ArrayList<>(trendMap.values());
    }

    public List<CategorySalesResponse> getCategorySales() {
        List<Order> orders = orderRepo.findAll();
        List<Category> categories = categoryRepo.findAll();
        Map<Long, String> catMap = categories.stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        Map<String, CategorySalesResponse> salesMap = new LinkedHashMap<>();
        salesMap.put("General", CategorySalesResponse.builder()
                .category("General")
                .count(orders.size())
                .revenue(orders.stream().mapToLong(o -> o.getTotal().longValue()).sum())
                .build());
        return new ArrayList<>(salesMap.values());
    }

    public Optional<VendorSetting> getSettings(Long vendorId) {
        return vendorSettingRepo.findByVendorId(vendorId);
    }

    public List<Product> getProducts() {
        return productRepo.findAll();
    }

    public List<Payment> getPayments(Long vendorId) {
        return paymentRepo.findByVendorIdOrderByCreatedAtDesc(vendorId);
    }

    public List<Shipment> getShipments(Long vendorId) {
        return shipmentRepo.findByVendorIdOrderByCreatedAtDesc(vendorId);
    }

    public List<Enquiry> getEnquiries() {
        return enquiryRepo.findAllByOrderByCreatedAtDesc();
    }

    public Enquiry createEnquiry(EnquiryRequest req) {
        Enquiry e = Enquiry.builder()
                .productId(req.getProductId())
                .userId(req.getUserId())
                .message(req.getMessage())
                .build();
        return enquiryRepo.save(e);
    }

    public List<Staff> getStaff() {
        return staffRepo.findAllByOrderByCreatedAtDesc();
    }

    public Product saveProduct(Product product) {
        return productRepo.save(product);
    }

    public Staff createStaff(StaffRequest req) {
        Staff s = Staff.builder()
                .name(req.getName())
                .email(req.getEmail())
                .role(req.getRole())
                .active(req.getActive() != null ? req.getActive() : true)
                .build();
        return staffRepo.save(s);
    }
}
