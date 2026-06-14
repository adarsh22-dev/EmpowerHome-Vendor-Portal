package com.nexus.checkout.service.admin;

import com.nexus.checkout.dto.AdminStatsResponse;
import com.nexus.checkout.model.*;
import com.nexus.checkout.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final BannerRepository bannerRepo;
    private final CategoryRepository categoryRepo;
    private final StaffRepository staffRepo;
    private final ReviewRepository reviewRepo;
    private final EnquiryRepository enquiryRepo;
    private final NotificationRepository notificationRepo;
    private final BlogRepository blogRepo;
    private final PaymentRepository paymentRepo;
    private final ShipmentRepository shipmentRepo;

    public AdminStatsResponse getStats() {
        List<Order> allOrders = orderRepo.findAll();
        long totalRevenue = allOrders.stream()
                .mapToLong(o -> o.getTotal().longValue())
                .sum();
        return AdminStatsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(allOrders.size())
                .totalProducts(productRepo.count())
                .totalUsers(userRepo.count())
                .build();
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public List<Banner> getAllBanners() {
        return bannerRepo.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }
}
