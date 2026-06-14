package com.nexus.checkout.service.customer;

import com.nexus.checkout.dto.*;
import com.nexus.checkout.model.*;
import com.nexus.checkout.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final OrderRepository orderRepo;
    private final WishlistRepository wishlistRepo;
    private final ReviewRepository reviewRepo;
    private final BlogRepository blogRepo;
    private final BannerRepository bannerRepo;
    private final PromotionRepository promotionRepo;
    private final CouponRepository couponRepo;
    private final NotificationRepository notificationRepo;
    private final EnquiryRepository enquiryRepo;
    private final ExchangeCategoryRepository exchangeCategoryRepo;
    private final ExchangeDeviceRepository exchangeDeviceRepo;
    private final ExchangePincodeRepository exchangePincodeRepo;
    private final WholesalePricingTierRepository tierRepo;
    private final ProductRelationRepository productRelationRepo;
    private final InstagramFeedRepository instagramFeedRepo;
    private final FaqRepository faqRepo;

    // --- Auth ---
    public AuthResponse register(AuthRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .email(req.getEmail())
                .password(req.getPassword())
                .name(req.getName())
                .role(req.getRole() != null ? req.getRole() : "customer")
                .isWholesale(req.getIsWholesale() != null ? req.getIsWholesale() : false)
                .build();
        user = userRepo.save(user);
        return AuthResponse.builder()
                .id(user.getId()).email(user.getEmail())
                .name(user.getName()).role(user.getRole())
                .isWholesale(user.getIsWholesale())
                .build();
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!user.getPassword().equals(req.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        return AuthResponse.builder()
                .id(user.getId()).email(user.getEmail())
                .name(user.getName()).role(user.getRole())
                .isWholesale(user.getIsWholesale())
                .build();
    }

    // --- Products ---
    public Map<String, Object> getProducts(int page, int limit, String category, String search, String sort) {
        List<Product> all = productRepo.findAll();
        List<Map<String, Object>> list = all.stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId()); m.put("name", p.getName());
            m.put("price", p.getPrice()); m.put("stock", p.getStock());
            m.put("image", p.getImage());
            List<WholesalePricingTier> tiers = tierRepo.findByProductIdOrderByMinQuantityAsc(p.getId());
            m.put("wholesale_tiers", tiers);
            return m;
        }).collect(Collectors.toList());

        int total = list.size();
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, total);
        List<Map<String, Object>> pageData = start < total ? list.subList(start, end) : List.of();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", Map.of(
                "products", pageData,
                "count", total,
                "page", page,
                "limit", limit,
                "totalPages", (int) Math.ceil((double) total / limit)
        ));
        return result;
    }

    public Optional<Map<String, Object>> getProduct(Long id) {
        return productRepo.findById(id).map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId()); m.put("name", p.getName());
            m.put("price", p.getPrice()); m.put("stock", p.getStock());
            m.put("image", p.getImage());
            m.put("wholesale_tiers", tierRepo.findByProductIdOrderByMinQuantityAsc(p.getId()));
            return m;
        });
    }

    public List<Map<String, Object>> getProductsByIds(List<Long> ids) {
        return productRepo.findAllById(ids).stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId()); m.put("name", p.getName());
            m.put("price", p.getPrice()); m.put("stock", p.getStock());
            m.put("image", p.getImage());
            return m;
        }).collect(Collectors.toList());
    }

    public List<WholesalePricingTier> getTiers(Long productId) {
        return tierRepo.findByProductIdOrderByMinQuantityAsc(productId);
    }

    public List<ProductRelation> getProductRelations(Long productId, String type) {
        if (type != null) {
            return productRelationRepo.findByProductIdAndRelationTypeOrderBySortOrderAsc(productId, type);
        }
        return productRelationRepo.findByProductIdOrderBySortOrderAsc(productId);
    }

    // --- Categories ---
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }

    // --- Orders ---
    @Transactional
    public Map<String, Object> createOrder(OrderRequest req) {
        BigDecimal total = BigDecimal.ZERO;
        List<Map<String, Object>> items = new ArrayList<>();

        for (OrderRequest.OrderItem oi : req.getItems()) {
            Product p = productRepo.findById(oi.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + oi.getProductId()));
            if (p.getStock() < oi.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + p.getName());
            }
            BigDecimal lineTotal = p.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity()));
            total = total.add(lineTotal);
            p.setStock(p.getStock() - oi.getQuantity());
            productRepo.save(p);

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("productId", p.getId()); item.put("name", p.getName());
            item.put("quantity", oi.getQuantity()); item.put("price", p.getPrice());
            items.add(item);
        }

        Order order = Order.builder()
                .userId(req.getUserId()).total(total)
                .status(OrderStatus.CONFIRMED).paymentStatus("pending")
                .paymentMode("cod").shippingAddress("{}")
                .build();
        order = orderRepo.save(order);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("orderId", order.getId());
        result.put("total", total);
        result.put("items", items);
        result.put("status", "confirmed");
        result.put("message", "Order #ORD-" + order.getId() + " placed successfully");
        return result;
    }

    public List<Map<String, Object>> getUserOrders(Long userId) {
        return orderRepo.findAll().stream()
                .filter(o -> o.getUserId().equals(userId))
                .map(o -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", o.getId()); m.put("total", o.getTotal());
                    m.put("status", o.getStatus()); m.put("paymentStatus", o.getPaymentStatus());
                    m.put("createdAt", o.getCreatedAt());
                    return m;
                })
                .collect(Collectors.toList());
    }

    // --- Wishlist ---
    public List<WishlistItem> getWishlist(Long userId) {
        return wishlistRepo.findByUserId(userId);
    }

    public WishlistItem addToWishlist(Long userId, Long productId) {
        if (wishlistRepo.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new RuntimeException("Already in wishlist");
        }
        WishlistItem wi = WishlistItem.builder().userId(userId).productId(productId).build();
        return wishlistRepo.save(wi);
    }

    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepo.deleteByUserIdAndProductId(userId, productId);
    }

    // --- Reviews ---
    public List<Review> getReviews(Long productId) {
        return reviewRepo.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review createReview(ReviewRequest req) {
        Review r = Review.builder()
                .productId(req.getProductId()).userId(req.getUserId())
                .rating(req.getRating()).comment(req.getComment())
                .build();
        return reviewRepo.save(r);
    }

    // --- Blogs ---
    public List<Blog> getBlogs() { return blogRepo.findAll(); }
    public Optional<Blog> getBlogBySlug(String slug) { return blogRepo.findBySlug(slug); }

    // --- Banners ---
    public List<Banner> getHomeBanners() {
        return bannerRepo.findAllByOrderByCreatedAtDesc();
    }

    // --- Promotions & Coupons ---
    public List<Promotion> getPromotions() { return promotionRepo.findByIsActiveTrue(); }
    public List<Coupon> getCoupons() { return couponRepo.findByIsActiveTrue(); }

    // --- Notifications ---
    public List<Notification> getNotifications(Long userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // --- Loyalty ---
    public Optional<User> getUser(Long id) { return userRepo.findById(id); }
    public void updateUser(Long id, String name, String avatar) {
        userRepo.findById(id).ifPresent(u -> {
            if (name != null) u.setName(name);
            if (avatar != null) u.setAvatar(avatar);
            userRepo.save(u);
        });
    }

    // --- Enquiries ---
    public List<Enquiry> getEnquiries() { return enquiryRepo.findAllByOrderByCreatedAtDesc(); }

    public Enquiry createEnquiry(EnquiryRequest req) {
        return enquiryRepo.save(Enquiry.builder()
                .productId(req.getProductId()).userId(req.getUserId())
                .message(req.getMessage()).build());
    }

    // --- Exchange ---
    public Map<String, Object> getExchangeSettings() {
        return Map.of("enabled", true, "maxValue", 50000);
    }

    public List<ExchangeCategory> getExchangeCategories() {
        return exchangeCategoryRepo.findAll();
    }

    public List<ExchangeDevice> getExchangeDevices(Long categoryId) {
        return exchangeDeviceRepo.findByCategoryId(categoryId);
    }

    public boolean checkPincode(String pincode) {
        return exchangePincodeRepo.findByPincode(pincode).map(ExchangePincode::getAvailable).orElse(false);
    }

    @Transactional
    public Map<String, Object> createExchange(ExchangeRequest req) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "success");
        result.put("message", "Exchange request submitted for device " + req.getDeviceId());
        result.put("estimatedValue", 5000);
        return result;
    }

    // --- Instagram Feeds ---
    public List<InstagramFeed> getInstagramFeeds() {
        return instagramFeedRepo.findByIsActiveTrueOrderBySortOrderAsc();
    }

    // --- FAQs ---
    public List<Faq> getFaqs(String category) {
        if (category != null) return faqRepo.findByCategoryAndIsActiveTrueOrderBySortOrderAsc(category);
        return faqRepo.findByIsActiveTrueOrderBySortOrderAsc();
    }

    // --- Platform Settings ---
    public Map<String, Object> getPlatformSettings() {
        Map<String, Object> settings = new LinkedHashMap<>();
        settings.put("storeName", "Nexus Store");
        settings.put("currency", "USD");
        settings.put("deliveryCharge", 0);
        settings.put("freeDeliveryMin", 299);
        return settings;
    }
}
