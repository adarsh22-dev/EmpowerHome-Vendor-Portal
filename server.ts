import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Mock data for demo mode (when DB is unavailable or on Vercel)
const mockData = {
  categories: [
    { id: 1, name: "Electronics", slug: "electronics", image: "https://picsum.photos/seed/elec/400/400" },
    { id: 2, name: "Fashion", slug: "fashion", image: "https://picsum.photos/seed/fashion/400/400" },
    { id: 3, name: "Home & Garden", slug: "home", image: "https://picsum.photos/seed/home/400/400" },
    { id: 4, name: "Grocery & Gourmet", slug: "grocery", image: "https://picsum.photos/seed/grocery/400/400" },
    { id: 5, name: "Beauty & Personal Care", slug: "beauty", image: "https://picsum.photos/seed/beauty/400/400" },
    { id: 6, name: "Sports & Outdoors", slug: "sports", image: "https://picsum.photos/seed/sports/400/400" },
    { id: 7, name: "Kids & Toys", slug: "kids", image: "https://picsum.photos/seed/kids/400/400" },
    { id: 8, name: "Automotive", slug: "automotive", image: "https://picsum.photos/seed/auto/400/400" }
  ],
  products: [
    { id: 1, name: "Pro Wireless Headphones", price: 299.99, image: "https://picsum.photos/seed/hp/600/600", category_id: 1, stock: 50, is_featured: 1 },
    { id: 2, name: "Ultra Slim Laptop", price: 1200.00, image: "https://picsum.photos/seed/laptop/600/600", category_id: 1, stock: 15, is_featured: 1 }
  ],
  promotions: [
    { id: 1, title: "Summer Sale", description: "Up to 50% off", discount_code: "SUMMER50", discount_value: 50, discount_type: "percentage", image: "https://picsum.photos/seed/promo1/800/400" }
  ],
  banners: [
    { id: 1, title: "Future of Tech", subtitle: "Next gen devices", image: "https://picsum.photos/seed/banner1/1920/800", button_text: "Shop Now", button_link: "/products" }
  ],
  users: [
    { id: 1, email: "vendor@nexus.com", name: "Nexus Vendor", role: "vendor" }
  ],
  stats: { revenue: 12500, orders: 45, products: 12, users: 150 }
};

let db: any;
const isDemoMode = process.env.VERCEL === "1";

if (isDemoMode) {
  console.log("Running in Demo Mode (Mock Data)");
  db = {
    prepare: (sql: string) => ({
      all: (...args: any[]) => {
        const lowerSql = sql.toLowerCase();
        if (lowerSql.includes("from categories")) return mockData.categories;
        if (lowerSql.includes("from products")) return mockData.products;
        if (lowerSql.includes("from users")) return mockData.users;
        if (lowerSql.includes("from promotions")) return mockData.promotions;
        if (lowerSql.includes("from home_banners")) return mockData.banners;
        return [];
      },
      get: () => {
        const lowerSql = sql.toLowerCase();
        if (lowerSql.includes("from users")) return mockData.users[0];
        if (lowerSql.includes("from platform_settings")) return { id: 1, site_name: "Nexus Marketplace" };
        return null;
      },
      run: () => ({ lastInsertRowid: 1 })
    }),
    exec: () => {},
    transaction: (cb: any) => cb
  };
} else {
  const { default: Database } = await import("better-sqlite3");
  const dbPath = path.join(__dirname, "nexus.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
}

// Initialize Database Schema
async function initDb() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'customer',
        avatar TEXT,
        loyalty_balance INTEGER DEFAULT 0,
        is_wholesale BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE,
        description TEXT,
        short_description TEXT,
        price REAL NOT NULL,
        sale_price REAL,
        wholesale_price REAL,
        min_wholesale_qty INTEGER DEFAULT 1,
        image TEXT,
        category_id INTEGER,
        stock INTEGER DEFAULT 0,
        stock_status TEXT DEFAULT 'instock',
        is_featured BOOLEAN DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        vendor_id INTEGER DEFAULT 1,
        weight REAL,
        length REAL,
        width REAL,
        height REAL,
        tax_status TEXT DEFAULT 'taxable',
        tax_class TEXT DEFAULT 'standard',
        is_exchangeable BOOLEAN DEFAULT 0,
        exchange_value_max REAL,
        brand TEXT,
        model_name TEXT,
        policies TEXT,
        seo TEXT,
        upsell_ids TEXT,
        cross_sell_ids TEXT,
        wholesale_tiers TEXT,
        extra_attributes TEXT,
        tax TEXT,
        shipping_details TEXT,
        vendor_tags TEXT,
        manufacturer_images TEXT,
        technical_details TEXT,
        additional_details TEXT,
        rotation_360_images TEXT,
        variations TEXT,
        attributes TEXT,
        exchange_details TEXT,
        shipping_policy TEXT,
        return_policy TEXT,
        warranty_info TEXT,
        seo_title TEXT,
        seo_description TEXT,
        manufacturer_videos TEXT,
        origin TEXT,
        fragile BOOLEAN DEFAULT 0,
        material TEXT,
        warranty TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );

      CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        url TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS product_specs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS product_videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        url TEXT NOT NULL,
        title TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        shipping_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        user_id INTEGER,
        product_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS loyalty_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        points INTEGER NOT NULL,
        action TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        image TEXT,
        author TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS promotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER DEFAULT 1,
        title TEXT NOT NULL,
        description TEXT,
        discount_code TEXT,
        discount_value REAL,
        discount_type TEXT,
        image TEXT,
        start_date DATETIME,
        end_date DATETIME,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_spend REAL,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        user_id INTEGER,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS vendor_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        vendor_id INTEGER DEFAULT 1,
        store_name TEXT,
        store_slug TEXT,
        store_email TEXT,
        phone TEXT,
        address TEXT,
        street TEXT,
        street_2 TEXT,
        city TEXT,
        zip TEXT,
        country TEXT,
        store_logo TEXT,
        banner_type TEXT DEFAULT 'static',
        store_banner TEXT,
        mobile_banner TEXT,
        list_banner_type TEXT DEFAULT 'static',
        list_banner TEXT,
        shop_description TEXT,
        name_position TEXT DEFAULT 'header',
        products_per_page INTEGER DEFAULT 10,
        hide_email BOOLEAN DEFAULT 0,
        hide_phone BOOLEAN DEFAULT 0,
        hide_address BOOLEAN DEFAULT 0,
        hide_map BOOLEAN DEFAULT 0,
        hide_about BOOLEAN DEFAULT 0,
        hide_policy BOOLEAN DEFAULT 0,
        policy_return TEXT,
        policy_shipping TEXT,
        policy_tab_label TEXT,
        policy_refund TEXT,
        policy_cancellation TEXT,
        location_lat REAL,
        location_lng REAL,
        payment_details TEXT,
        preferred_payment TEXT,
        enable_shipping BOOLEAN DEFAULT 0,
        processing_time TEXT,
        shipping_type TEXT,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT,
        fb_title TEXT,
        fb_description TEXT,
        fb_image TEXT,
        customer_support_email TEXT,
        customer_support_phone TEXT,
        support_address TEXT,
        support_country TEXT,
        support_city TEXT,
        store_hours TEXT,
        enable_store_hours BOOLEAN DEFAULT 0,
        disable_purchase_off_time BOOLEAN DEFAULT 0,
        FOREIGN KEY (vendor_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS vendor_shipping_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER DEFAULT 1,
        name TEXT NOT NULL,
        rate REAL NOT NULL,
        min_order_value REAL DEFAULT 0,
        estimated_days TEXT,
        FOREIGN KEY (vendor_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS wholesale_pricing_tiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        min_quantity INTEGER NOT NULL,
        max_quantity INTEGER,
        price REAL NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS exchange_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        enable_exchange BOOLEAN DEFAULT 1,
        primary_color TEXT DEFAULT '#000000',
        button_text TEXT DEFAULT 'Exchange Now',
        currency_symbol TEXT DEFAULT '$',
        max_exchange_percentage INTEGER DEFAULT 50,
        pincode_validation BOOLEAN DEFAULT 1,
        imei_mandatory BOOLEAN DEFAULT 1,
        enable_logging BOOLEAN DEFAULT 0,
        custom_css TEXT
      );

      CREATE TABLE IF NOT EXISTS exchange_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        active BOOLEAN DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS exchange_devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        base_price REAL NOT NULL,
        active BOOLEAN DEFAULT 1,
        FOREIGN KEY (category_id) REFERENCES exchange_categories(id)
      );

      CREATE TABLE IF NOT EXISTS exchange_pincodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pincode TEXT UNIQUE NOT NULL,
        active BOOLEAN DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS exchange_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER,
        old_product_details TEXT,
        estimated_value REAL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS staff_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER DEFAULT 1,
        display_name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vendor_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS staff_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_id INTEGER,
        vendor_id INTEGER DEFAULT 1,
        action TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES staff_accounts(id),
        FOREIGN KEY (vendor_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        message TEXT,
        type TEXT DEFAULT 'info',
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS platform_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        site_name TEXT DEFAULT 'Nexus Marketplace',
        site_description TEXT,
        site_logo TEXT,
        primary_color TEXT DEFAULT '#000000',
        enable_loyalty BOOLEAN DEFAULT 1,
        loyalty_rate REAL DEFAULT 0.05,
        enable_exchange_system BOOLEAN DEFAULT 1,
        enable_vendor_portal BOOLEAN DEFAULT 1,
        enable_wholesaler_portal BOOLEAN DEFAULT 1,
        enable_upsell_product_page INTEGER DEFAULT 1,
        enable_cross_sell_product_page INTEGER DEFAULT 1,
        enable_cross_sell_cart_page INTEGER DEFAULT 1,
        enable_cross_sell_checkout_page INTEGER DEFAULT 1,
        recommendation_limit INTEGER DEFAULT 4
      );

      CREATE TABLE IF NOT EXISTS product_relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        related_product_id INTEGER NOT NULL,
        relation_type TEXT NOT NULL CHECK(relation_type IN ('related','cross_sell','upsell')),
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (related_product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS instagram_feeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        link TEXT,
        caption TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS home_banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        subtitle TEXT,
        image TEXT NOT NULL,
        button_text TEXT,
        button_link TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS footer_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        label TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS mega_menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        category_id INTEGER,
        parent_id INTEGER,
        icon TEXT,
        link TEXT,
        is_featured BOOLEAN DEFAULT 0,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        vendor_id INTEGER DEFAULT 1,
        amount REAL NOT NULL,
        fee REAL NOT NULL,
        net_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payout_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (vendor_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS shipments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        vendor_id INTEGER DEFAULT 1,
        carrier TEXT NOT NULL,
        tracking_number TEXT,
        status TEXT DEFAULT 'pending',
        shipping_date DATETIME,
        estimated_delivery DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (vendor_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS product_enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER DEFAULT 1,
        product_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_phone TEXT,
        type TEXT NOT NULL,
        message TEXT,
        quantity INTEGER,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vendor_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    // Migrations for existing tables
    const migrations = [
      {
        table: 'products',
        columns: [
          { name: 'sku', type: 'TEXT UNIQUE' },
          { name: 'short_description', type: 'TEXT' },
          { name: 'sale_price', type: 'REAL' },
          { name: 'wholesale_price', type: 'REAL' },
          { name: 'min_wholesale_qty', type: 'INTEGER DEFAULT 1' },
          { name: 'stock_status', type: 'TEXT DEFAULT "instock"' },
          { name: 'is_featured', type: 'BOOLEAN DEFAULT 0' },
          { name: 'weight', type: 'REAL' },
          { name: 'length', type: 'REAL' },
          { name: 'width', type: 'REAL' },
          { name: 'height', type: 'REAL' },
          { name: 'tax_status', type: 'TEXT DEFAULT "taxable"' },
          { name: 'tax_class', type: 'TEXT DEFAULT "standard"' },
          { name: 'is_exchangeable', type: 'BOOLEAN DEFAULT 0' },
          { name: 'exchange_value_max', type: 'REAL' },
          { name: 'brand', type: 'TEXT' },
          { name: 'model_name', type: 'TEXT' },
          { name: 'policies', type: 'TEXT' },
          { name: 'seo', type: 'TEXT' },
          { name: 'upsell_ids', type: 'TEXT' },
          { name: 'cross_sell_ids', type: 'TEXT' },
          { name: 'wholesale_tiers', type: 'TEXT' },
          { name: 'extra_attributes', type: 'TEXT' },
          { name: 'tax', type: 'TEXT' },
          { name: 'shipping_details', type: 'TEXT' },
          { name: 'vendor_tags', type: 'TEXT' },
          { name: 'manufacturer_images', type: 'TEXT' },
          { name: 'technical_details', type: 'TEXT' },
          { name: 'additional_details', type: 'TEXT' },
          { name: 'rotation_360_images', type: 'TEXT' },
          { name: 'variations', type: 'TEXT' },
          { name: 'attributes', type: 'TEXT' },
          { name: 'exchange_details', type: 'TEXT' },
          { name: 'is_active', type: 'INTEGER DEFAULT 1' },
          { name: 'shipping_policy', type: 'TEXT' },
          { name: 'return_policy', type: 'TEXT' },
          { name: 'warranty_info', type: 'TEXT' },
          { name: 'seo_title', type: 'TEXT' },
          { name: 'seo_description', type: 'TEXT' },
          { name: 'manufacturer_videos', type: 'TEXT' },
          { name: 'origin', type: 'TEXT' },
          { name: 'fragile', type: 'BOOLEAN DEFAULT 0' },
          { name: 'material', type: 'TEXT' },
          { name: 'warranty', type: 'TEXT' }
        ]
      },
      {
        table: 'users',
        columns: [
          { name: 'loyalty_balance', type: 'INTEGER DEFAULT 0' },
          { name: 'avatar', type: 'TEXT' },
          { name: 'role', type: "TEXT DEFAULT 'customer'" },
          { name: 'is_wholesale', type: 'BOOLEAN DEFAULT 0' },
          { name: 'name', type: 'TEXT' }
        ]
      },
      {
        table: 'vendor_settings',
        columns: [
          { name: 'store_slug', type: 'TEXT' },
          { name: 'street', type: 'TEXT' },
          { name: 'street_2', type: 'TEXT' },
          { name: 'city', type: 'TEXT' },
          { name: 'zip', type: 'TEXT' },
          { name: 'country', type: 'TEXT' },
          { name: 'store_logo', type: 'TEXT' },
          { name: 'banner_type', type: 'TEXT DEFAULT "static"' },
          { name: 'store_banner', type: 'TEXT' },
          { name: 'mobile_banner', type: 'TEXT' },
          { name: 'list_banner_type', type: 'TEXT DEFAULT "static"' },
          { name: 'list_banner', type: 'TEXT' },
          { name: 'shop_description', type: 'TEXT' },
          { name: 'name_position', type: 'TEXT DEFAULT "header"' },
          { name: 'products_per_page', type: 'INTEGER DEFAULT 10' },
          { name: 'hide_email', type: 'BOOLEAN DEFAULT 0' },
          { name: 'hide_phone', type: 'BOOLEAN DEFAULT 0' },
          { name: 'hide_address', type: 'BOOLEAN DEFAULT 0' },
          { name: 'hide_map', type: 'BOOLEAN DEFAULT 0' },
          { name: 'hide_about', type: 'BOOLEAN DEFAULT 0' },
          { name: 'hide_policy', type: 'BOOLEAN DEFAULT 0' },
          { name: 'policy_tab_label', type: 'TEXT' },
          { name: 'policy_refund', type: 'TEXT' },
          { name: 'policy_cancellation', type: 'TEXT' },
          { name: 'location_lat', type: 'REAL' },
          { name: 'location_lng', type: 'REAL' },
          { name: 'payment_details', type: 'TEXT' },
          { name: 'preferred_payment', type: 'TEXT' },
          { name: 'enable_shipping', type: 'BOOLEAN DEFAULT 0' },
          { name: 'processing_time', type: 'TEXT' },
          { name: 'shipping_type', type: 'TEXT' },
          { name: 'seo_title', type: 'TEXT' },
          { name: 'seo_description', type: 'TEXT' },
          { name: 'seo_keywords', type: 'TEXT' },
          { name: 'fb_title', type: 'TEXT' },
          { name: 'fb_description', type: 'TEXT' },
          { name: 'fb_image', type: 'TEXT' },
          { name: 'customer_support_email', type: 'TEXT' },
          { name: 'customer_support_phone', type: 'TEXT' },
          { name: 'support_address', type: 'TEXT' },
          { name: 'support_country', type: 'TEXT' },
          { name: 'support_city', type: 'TEXT' },
          { name: 'store_hours', type: 'TEXT' },
          { name: 'enable_store_hours', type: 'BOOLEAN DEFAULT 0' },
          { name: 'disable_purchase_off_time', type: 'BOOLEAN DEFAULT 0' }
        ]
      }
    ];

    for (const migration of migrations) {
      const tableInfo = db.prepare(`PRAGMA table_info(${migration.table})`).all() as any[];
      const existingCols = tableInfo.map(c => c.name);
      for (const col of migration.columns) {
        if (!existingCols.includes(col.name)) {
          try {
            db.exec(`ALTER TABLE ${migration.table} ADD COLUMN ${col.name} ${col.type}`);
          } catch (e) {
            console.error(`Failed to add column ${col.name} to ${migration.table}:`, e);
          }
        }
      }
    }

    // Seeding
    if (!isDemoMode) {
      const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
      if (categoryCount.count === 0) {
        const insertCategory = db.prepare("INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)");
        const categoriesToSeed = [
          ["Electronics", "electronics", "elec"],
          ["Fashion", "fashion", "fashion"],
          ["Home & Garden", "home", "home"],
          ["Grocery & Gourmet", "grocery", "grocery"],
          ["Beauty & Personal Care", "beauty", "beauty"],
          ["Sports & Outdoors", "sports", "sports"],
          ["Kids & Toys", "kids", "kids"],
          ["Automotive", "automotive", "auto"]
        ];
        for (const [name, slug, seed] of categoriesToSeed) {
          insertCategory.run(name, slug, `https://picsum.photos/seed/${seed}/400/400`);
        }
      }

      const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
      if (productCount.count === 0) {
        const insertProduct = db.prepare("INSERT INTO products (name, sku, description, short_description, price, wholesale_price, min_wholesale_qty, image, category_id, stock, is_featured, is_exchangeable, exchange_value_max, brand, model_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        insertProduct.run("Pro Wireless Headphones", "WH-001", "High-fidelity audio with noise cancellation.", "Premium noise-cancelling headphones.", 299.99, 199.99, 10, "https://picsum.photos/seed/hp/600/600", 1, 50, 1, 1, 50.00, "Nexus", "Pro-WH1");
        insertProduct.run("Ultra Slim Laptop", "LP-001", "Powerful performance in a thin frame.", "13-inch ultra-portable laptop.", 1200.00, 950.00, 3, "https://picsum.photos/seed/laptop/600/600", 1, 15, 1, 1, 300.00, "Nexus", "Slim-LP1");
        insertProduct.run("Minimalist Watch", "WT-001", "Elegant design for every occasion.", "Classic leather strap watch.", 129.50, 85.00, 20, "https://picsum.photos/seed/watch/600/600", 2, 100, 1, 0, 0, "Nexus", "Watch-M1");
        insertProduct.run("Cotton T-Shirt", "TS-001", "100% organic cotton, breathable and soft.", "Essential everyday tee.", 25.00, 12.00, 50, "https://picsum.photos/seed/tee/600/600", 2, 500, 0, 0, 0, "Nexus", "Tee-C1");
        
        // Detailed Demo Product
        const detailedProductResult = insertProduct.run(
          "Nexus Elite Pro Smartphone", 
          "NX-ELITE-001", 
          "The ultimate smartphone experience with the latest technology. Featuring a stunning 6.7-inch AMOLED display, powerful octa-core processor, and a revolutionary triple-lens camera system.", 
          "The most powerful Nexus smartphone ever.", 
          999.99, 750.00, 5, "https://picsum.photos/seed/smartphone/800/800", 1, 100, 1, 1, 400.00, "Nexus", "Elite Pro"
        );
        const detailedProductId = detailedProductResult.lastInsertRowid;

        const variations = [
          { name: "Color", options: ["Midnight Black", "Arctic Silver", "Royal Gold"] },
          { name: "Storage", options: ["128GB", "256GB", "512GB"] }
        ];
        db.prepare("UPDATE products SET variations = ? WHERE id = ?").run(JSON.stringify(variations), detailedProductId);

        const techDetails = [
          { label: "Display", value: "6.7-inch AMOLED, 120Hz" },
          { label: "Processor", value: "Nexus G3 Octa-core" },
          { label: "RAM", value: "12GB LPDDR5" },
          { label: "Battery", value: "5000mAh, 65W Charging" }
        ];
        const insertSpec = db.prepare("INSERT INTO product_specs (product_id, label, value) VALUES (?, ?, ?)");
        for (const spec of techDetails) {
          insertSpec.run(detailedProductId, spec.label, spec.value);
        }
      }

      const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
      if (userCount.count === 0) {
        db.prepare("INSERT INTO users (email, password, name, role) VALUES ('vendor@nexus.com', 'password', 'Nexus Vendor', 'vendor')").run();
        db.prepare("INSERT INTO users (email, password, name, role) VALUES ('admin@nexus.com', 'admin123', 'System Admin', 'admin')").run();
        db.prepare("INSERT INTO users (email, password, name, role) VALUES ('super@nexus.com', 'super123', 'Super Admin', 'super_admin')").run();
      }

      const bannerCount = db.prepare("SELECT COUNT(*) as count FROM home_banners").get() as { count: number };
      if (bannerCount.count === 0) {
        db.prepare("INSERT INTO home_banners (title, subtitle, image, button_text, button_link) VALUES (?, ?, ?, ?, ?)")
          .run("Future of Technology", "Experience the next generation of smart devices.", "https://picsum.photos/seed/banner1/1920/800", "Shop Now", "/products");
      }

      const settingsCount = db.prepare("SELECT COUNT(*) as count FROM platform_settings").get() as { count: number };
      if (settingsCount.count === 0) {
        db.prepare("INSERT INTO platform_settings (id) VALUES (1)").run();
      }
      
      const vendorSettingsCount = db.prepare("SELECT COUNT(*) as count FROM vendor_settings").get() as { count: number };
      if (vendorSettingsCount.count === 0) {
        db.prepare("INSERT INTO vendor_settings (vendor_id, store_name, store_email) VALUES (1, 'Nexus Global Store', 'vendor@nexus.com')").run();
      }

      // Seed blogs
      const insertBlog = db.prepare("INSERT OR IGNORE INTO blogs (title, slug, content, excerpt, image, author, category) VALUES (?, ?, ?, ?, ?, ?, ?)");
      insertBlog.run(
        "The Future of E-commerce in 2026",
        "future-of-ecommerce-2026",
        "As we move into 2026, the landscape of e-commerce continues to evolve at a rapid pace. Artificial intelligence, virtual reality try-ons, and dynamic value chains are transforming how users discover products and interact with global supply networks. NovaCart is leading this charge by offering a fully conversational OS styled with slate metrics.",
        "Exploring the key trends shaping the future of online shopping.",
        "https://picsum.photos/seed/blog1/1200/600",
        "Alex Rivera",
        "Technology"
      );
      insertBlog.run(
        "Mastering Your Marketplace Storefront",
        "mastering-marketplace-storefront",
        "Seeding products is only the first step. To truly excel as an online retailer, you must curate high-converting product edit metadata, optimize titles Tag-by-Tag utilizing SEO tools, and implement friendly customer service channels. Live chatbot engagement tools can elevate your brand conversion rate by over forty percent.",
        "Practical strategies to elevate your store listing engagement and convert casual browsers into repetitive shoppers.",
        "https://picsum.photos/seed/blog2/1200/600",
        "Sophia Chen",
        "Business"
      );
      insertBlog.run(
        "Sustainable Supply Chain Practices",
        "sustainable-supply-chain-practices",
        "In an era of rising ecological consciousness, consumers expect clean, eco-friendly pathways from the farm to the door. We explore optimized local routing logic, zero-flicker recycled minimalist shipping packaging, and transparent carbon offset reporting built seamlessly into your dashboard.",
        "How green energy and zero-waste packaging logistics can build reliable buyer trust and brand authenticity.",
        "https://picsum.photos/seed/blog3/1200/600",
        "Marcus Thorne",
        "Sustainability"
      );

      // Seed exchange categories and devices
      const exCatCount = db.prepare("SELECT COUNT(*) as count FROM exchange_categories").get() as { count: number };
      if (exCatCount.count === 0) {
        const result = db.prepare("INSERT INTO exchange_categories (name, slug, active) VALUES (?, ?, ?)").run("Smartphones", "smartphones", 1);
        db.prepare("INSERT INTO exchange_devices (category_id, brand, model, base_price, active) VALUES (?, ?, ?, ?, ?)").run(result.lastInsertRowid, "Apple", "iPhone 15 Pro", 800, 1);
        db.prepare("INSERT INTO exchange_devices (category_id, brand, model, base_price, active) VALUES (?, ?, ?, ?, ?)").run(result.lastInsertRowid, "Samsung", "Galaxy S24 Ultra", 750, 1);
      }

      // Seed promotions
      const promoCount = db.prepare("SELECT COUNT(*) as count FROM promotions").get() as { count: number };
      if (promoCount.count === 0) {
        db.prepare(`
          INSERT INTO promotions (title, description, discount_code, discount_value, discount_type, image)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          "Summer Sale 2026",
          "Get ready for the summer with our exclusive deals.",
          "SUMMER26",
          20,
          "percentage",
          "https://picsum.photos/seed/promo1/1200/400"
        );
      }

      // Seed Instagram feeds
      const igCount = db.prepare("SELECT COUNT(*) as count FROM instagram_feeds").get() as { count: number };
      if (igCount.count === 0) {
        const insertIg = db.prepare("INSERT INTO instagram_feeds (image_url, link, caption, sort_order) VALUES (?, ?, ?, ?)");
        insertIg.run("https://picsum.photos/seed/ig1/400/400", "https://instagram.com", "New arrivals dropping soon", 1);
        insertIg.run("https://picsum.photos/seed/ig2/400/400", "https://instagram.com", "Behind the scenes", 2);
        insertIg.run("https://picsum.photos/seed/ig3/400/400", "https://instagram.com", "Customer favorites", 3);
        insertIg.run("https://picsum.photos/seed/ig4/400/400", "https://instagram.com", "Style inspo", 4);
        insertIg.run("https://picsum.photos/seed/ig5/400/400", "https://instagram.com", "Limited edition", 5);
        insertIg.run("https://picsum.photos/seed/ig6/400/400", "https://instagram.com", "Shop the look", 6);
      }

      // Seed FAQs
      const faqCount = db.prepare("SELECT COUNT(*) as count FROM faqs").get() as { count: number };
      if (faqCount.count === 0) {
        const insertFaq = db.prepare("INSERT INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)");
        insertFaq.run("What payment methods do you accept?", "We accept Visa, Mastercard, RuPay, UPI (GPay/PhonePe), and Cash on Delivery.", "general", 1);
        insertFaq.run("How long does shipping take?", "Standard shipping takes 3-5 business days. Express shipping is available within 24-48 hours.", "general", 2);
        insertFaq.run("What is your return policy?", "You can return any item within 30 days of delivery for a full refund. Items must be unused and in original packaging.", "general", 3);
        insertFaq.run("Do you offer wholesale pricing?", "Yes! Sign up for a wholesale account to access tiered pricing on bulk orders. Discounts start at quantities of 10+ units.", "general", 4);
        insertFaq.run("Is this product covered by warranty?", "All products come with a standard 1-year manufacturer warranty covering manufacturing defects.", "product", 5);
        insertFaq.run("Can I exchange this product?", "Yes, we offer exchange within 7 days of delivery. The product must be in original condition with all accessories.", "product", 6);
        insertFaq.run("How do I track my order?", "Once shipped, you will receive a tracking link via email and SMS. You can also track orders from your account dashboard.", "general", 7);
        insertFaq.run("Do you ship internationally?", "Yes, we ship to over 50 countries worldwide. International shipping takes 7-14 business days.", "general", 8);
      }

      // Seed product relations
      const relationCount = db.prepare("SELECT COUNT(*) as count FROM product_relations").get() as { count: number };
      if (relationCount.count === 0) {
        const insertRel = db.prepare("INSERT INTO product_relations (product_id, related_product_id, relation_type, sort_order) VALUES (?, ?, ?, ?)");
        insertRel.run(1, 2, "related", 1);
        insertRel.run(1, 5, "related", 2);
        insertRel.run(2, 1, "related", 1);
        insertRel.run(2, 5, "related", 2);
        insertRel.run(5, 1, "related", 1);
        insertRel.run(5, 2, "related", 2);
        insertRel.run(1, 3, "upsell", 1);
        insertRel.run(1, 4, "cross_sell", 1);
        insertRel.run(2, 5, "upsell", 1);
        insertRel.run(5, 3, "cross_sell", 1);
      }
    }
  } catch (e) {
    console.error("Database initialization failed:", e);
  }
}

const parseProduct = (product: any) => {
  if (!product) return null;
  const jsonFields = [
    'policies', 'seo', 'upsell_ids', 'cross_sell_ids', 'wholesale_tiers', 
    'extra_attributes', 'tax', 'shipping_details', 'vendor_tags', 
    'manufacturer_images', 'technical_details', 'rotation_360_images', 
    'variations', 'attributes', 'exchange_details'
  ];
  jsonFields.forEach(field => {
    if (product[field] && typeof product[field] === 'string' && product[field].trim() !== '') {
      try {
        product[field] = JSON.parse(product[field]);
      } catch (e) {
        product[field] = [];
      }
    } else if (product[field] === '' || product[field] === null) {
      const listFields = ['upsell_ids', 'cross_sell_ids', 'wholesale_tiers', 'extra_attributes', 'vendor_tags', 'manufacturer_images', 'rotation_360_images', 'variations', 'attributes'];
      if (listFields.includes(field)) product[field] = [];
    }
  });
  return product;
};

async function startServer() {
  await initDb();

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    try {
      const { email, password, name, role, is_wholesale } = req.body;
      const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (existingUser) return res.status(400).json({ error: "Email already exists" });
      
      const result = db.prepare("INSERT INTO users (email, password, name, role, is_wholesale) VALUES (?, ?, ?, ?, ?)")
        .run(email, password, name, role || 'customer', is_wholesale ? 1 : 0);
      
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to register" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Promotion Routes
  app.get("/api/promotions", (req, res) => {
    try {
      const promos = db.prepare("SELECT * FROM promotions WHERE active = 1").all();
      res.json(promos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  });

  app.get("/api/home-banners", (req, res) => {
    try {
      const banners = db.prepare("SELECT * FROM home_banners WHERE is_active = 1").all();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  app.get("/api/coupons", (req, res) => {
    try {
      const coupons = db.prepare("SELECT * FROM coupons WHERE active = 1").all();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  });

  app.get("/api/reviews", (req, res) => {
    try {
      const { product_id } = req.query;
      let query = "SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id";
      const params: any[] = [];
      if (product_id) { query += " WHERE r.product_id = ?"; params.push(product_id); }
      query += " ORDER BY r.created_at DESC";
      res.json(db.prepare(query).all(...params));
    } catch (error) { res.status(500).json({ error: "Failed to fetch reviews" }); }
  });

  app.post("/api/reviews", (req, res) => {
    try {
      const { product_id, user_id, rating, comment } = req.body;
      if (!product_id || !rating) return res.status(400).json({ error: "product_id and rating required" });
      const result = db.prepare("INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)").run(product_id, user_id||1, rating, comment||'');
      res.json({ id: result.lastInsertRowid });
    } catch (error) { res.status(500).json({ error: "Failed to create review" }); }
  });

  app.get("/api/vendor/sales-trends", (req, res) => {
    try {
      const monthlyData = db.prepare(`
        SELECT strftime('%m', o.created_at) as month, strftime('%Y', o.created_at) as year, SUM(o.total) as total, COUNT(*) as count
        FROM orders o GROUP BY year, month ORDER BY year, month
      `).all();
      if (monthlyData.length === 0) {
        const months = Array.from({length:12},(_,i)=>({month:(i+1).toString().padStart(2,'0'),year:'2026',total:Math.round(50000+Math.random()*50000),count:Math.round(10+Math.random()*40)}));
        res.json(months);
      } else res.json(monthlyData);
    } catch (error) { res.status(500).json({ error: "Failed to fetch sales trends" }); }
  });

  app.get("/api/vendor/category-sales", (req, res) => {
    try {
      const data = db.prepare(`
        SELECT c.name as name, COUNT(oi.id) as count, SUM(oi.quantity * oi.price) as revenue
        FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN categories c ON p.category_id = c.id
        GROUP BY c.name ORDER BY revenue DESC
      `).all();
      if (data.length === 0) {
        res.json([{name:"Electronics",count:45,revenue:54000},{name:"Fashion",count:30,revenue:28000},{name:"Home",count:20,revenue:15000},{name:"Sports",count:15,revenue:12000}]);
      } else res.json(data);
    } catch (error) { res.status(500).json({ error: "Failed to fetch category sales" }); }
  });

  // User Profile Routes
  app.get("/api/users/:id", (req, res) => {
    try {
      const user = db.prepare("SELECT id, email, name, role, avatar, loyalty_balance, is_wholesale, created_at FROM users WHERE id = ?").get(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  app.put("/api/users/:id", (req, res) => {
    try {
      const { name, avatar } = req.body;
      db.prepare("UPDATE users SET name = ?, avatar = ? WHERE id = ?").run(name, avatar, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // Admin Routes
  app.get("/api/admin/stats", (req, res) => {
    try {
      const revenue = db.prepare("SELECT SUM(total) as total FROM orders").get() as { total: number };
      const orders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
      const products = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
      const users = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
      res.json({
        revenue: revenue.total || 0,
        orders: orders.count,
        products: products.count,
        users: users.count
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/users", (req, res) => {
    try {
      const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Product Routes
  app.get("/api/products", (req, res) => {
    try {
      const { category, search, featured } = req.query;
      let query = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id";
      const params: any[] = [];
      const conditions: string[] = [];

      if (category) {
        conditions.push("c.slug = ?");
        params.push(category);
      }
      if (search) {
        conditions.push("p.name LIKE ?");
        params.push(`%${search}%`);
      }
      if (featured === 'true') {
        conditions.push("p.is_featured = 1");
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      const products = db.prepare(query).all(...params).map(p => parseProduct(p));
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    try {
      const product = db.prepare("SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?").get(req.params.id) as any;
      if (!product) return res.status(404).json({ error: "Product not found" });
      
      const parsedProduct = parseProduct(product);
      const images = db.prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC").all(req.params.id);
      const specs = db.prepare("SELECT * FROM product_specs WHERE product_id = ?").all(req.params.id);
      const videos = db.prepare("SELECT * FROM product_videos WHERE product_id = ?").all(req.params.id);
      
      res.json({ ...parsedProduct, images, specs, videos });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product details" });
    }
  });

  // Category Routes
  app.get("/api/categories", (req, res) => {
    try {
      const categories = db.prepare("SELECT * FROM categories").all();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Order Routes
  app.post("/api/orders", (req, res) => {
    try {
      const { user_id, items, total, shipping_address } = req.body;
      const transaction = db.transaction(() => {
        const result = db.prepare("INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)").run(user_id, total, shipping_address);
        const orderId = result.lastInsertRowid;
        const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        for (const item of items) {
          insertItem.run(orderId, item.id, item.quantity, item.price);
        }
        return orderId;
      });
      const orderId = transaction();
      res.json({ orderId });
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/user/:userId", (req, res) => {
    try {
      const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  // Wishlist Routes
  app.get("/api/wishlist/:userId", (req, res) => {
    try {
      const items = db.prepare(`
        SELECT p.* FROM wishlist w 
        JOIN products p ON w.product_id = p.id 
        WHERE w.user_id = ?
      `).all(req.params.userId);
      res.json(items.map(p => parseProduct(p)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", (req, res) => {
    try {
      const { user_id, product_id } = req.body;
      db.prepare("INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)").run(user_id, product_id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist", (req, res) => {
    try {
      const { user_id, product_id } = req.body;
      db.prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?").run(user_id, product_id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  // Exchange Routes
  app.get("/api/exchange/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM exchange_settings WHERE id = 1").get();
      res.json(settings || { enable_exchange: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange settings" });
    }
  });

  app.post("/api/exchanges", (req, res) => {
    try {
      const { user_id, product_id, old_product_details, estimated_value } = req.body;
      const result = db.prepare(`
        INSERT INTO exchange_requests (user_id, product_id, old_product_details, estimated_value)
        VALUES (?, ?, ?, ?)
      `).run(user_id, product_id, JSON.stringify(old_product_details), estimated_value);
      res.json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit exchange request" });
    }
  });

  app.get("/api/exchange/categories", (req, res) => {
    try {
      const categories = db.prepare("SELECT * FROM exchange_categories").all();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange categories" });
    }
  });

  app.get("/api/exchange/devices", (req, res) => {
    try {
      const devices = db.prepare("SELECT * FROM exchange_devices").all();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange devices" });
    }
  });

  app.get("/api/exchange/pincodes", (req, res) => {
    try {
      const pincodes = db.prepare("SELECT * FROM exchange_pincodes").all();
      res.json(pincodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange pincodes" });
    }
  });

  // Staff Management Routes
  app.get("/api/staff", (req, res) => {
    try {
      const staff = db.prepare("SELECT * FROM staff_accounts WHERE vendor_id = 1").all();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff accounts" });
    }
  });

  app.post("/api/staff", (req, res) => {
    try {
      const { display_name, username, password } = req.body;
      const result = db.prepare("INSERT INTO staff_accounts (vendor_id, display_name, username, password) VALUES (1, ?, ?, ?)")
        .run(display_name, username, password);
      res.json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create staff account" });
    }
  });

  app.get("/api/staff/activity", (req, res) => {
    try {
      const activity = db.prepare(`
        SELECT sa.*, s.display_name as staff_name 
        FROM staff_activity sa 
        JOIN staff_accounts s ON sa.staff_id = s.id 
        WHERE sa.vendor_id = 1 
        ORDER BY sa.created_at DESC
      `).all();
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff activity" });
    }
  });

  // Payments & Shipments
  app.get("/api/payments", (req, res) => {
    try {
      const payments = db.prepare("SELECT * FROM payments WHERE vendor_id = 1 ORDER BY created_at DESC").all();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.get("/api/shipments", (req, res) => {
    try {
      const shipments = db.prepare(`
        SELECT s.*, u.name as customer_name 
        FROM shipments s 
        JOIN orders o ON s.order_id = o.id 
        JOIN users u ON o.user_id = u.id 
        WHERE s.vendor_id = 1 
        ORDER BY s.created_at DESC
      `).all();
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  });

  // Enquiries
  app.get("/api/enquiries", (req, res) => {
    try {
      const enquiries = db.prepare(`
        SELECT pe.*, p.name as product_name 
        FROM product_enquiries pe 
        JOIN products p ON pe.product_id = p.id 
        WHERE pe.vendor_id = 1 
        ORDER BY pe.created_at DESC
      `).all();
      res.json(enquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enquiries" });
    }
  });

  app.post("/api/enquiries", (req, res) => {
    try {
      const { product_id, customer_name, customer_email, customer_phone, type, message, quantity } = req.body;
      const result = db.prepare(`
        INSERT INTO product_enquiries (vendor_id, product_id, customer_name, customer_email, customer_phone, type, message, quantity) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?)
      `).run(product_id, customer_name, customer_email, customer_phone, type, message, quantity);
      res.json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create enquiry" });
    }
  });

  // Blogs
  app.get("/api/blogs", (req, res) => {
    try {
      const blogs = db.prepare("SELECT * FROM blogs ORDER BY created_at DESC").all();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:slug", (req, res) => {
    try {
      const blog = db.prepare("SELECT * FROM blogs WHERE slug = ?").get(req.params.slug);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
      res.json(blog);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog" });
    }
  });

  // Loyalty
  app.get("/api/loyalty/:userId", (req, res) => {
    try {
      const points = db.prepare("SELECT * FROM loyalty_points WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
      const user = db.prepare("SELECT loyalty_balance FROM users WHERE id = ?").get(req.params.userId) as { loyalty_balance: number } | undefined;
      res.json({ points: points || [], balance: user?.loyalty_balance || 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loyalty points" });
    }
  });

  // Vendor Routes
  app.get("/api/vendor/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM vendor_settings WHERE vendor_id = 1").get();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor settings" });
    }
  });

  app.get("/api/vendor/stats", (req, res) => {
    try {
      const revenue = db.prepare("SELECT SUM(total) as total FROM orders").get() as { total: number };
      const orders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
      const products = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
      res.json({
        revenue: revenue.total || 0,
        orders: orders.count,
        products: products.count,
        avgOrderValue: orders.count > 0 ? (revenue.total / orders.count) : 0
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor stats" });
    }
  });

  // Notifications
  app.get("/api/notifications/:userId", (req, res) => {
    try {
      const notifications = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Platform Settings
  app.get("/api/platform-settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM platform_settings WHERE id = 1").get();
      res.json(settings || { site_name: "Nexus Marketplace" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch platform settings" });
    }
  });

  // Missing API routes referenced by frontend
  app.get("/api/products/:id/tiers", (req, res) => {
    try {
      const tiers = db.prepare("SELECT * FROM wholesale_pricing_tiers WHERE product_id = ?").all(req.params.id);
      res.json(tiers);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/products/by-ids", (req, res) => {
    try {
      const ids = (req.query.ids as string || "").split(",").filter(Boolean).map(Number);
      if (ids.length === 0) return res.json([]);
      const placeholders = ids.map(() => "?").join(",");
      const products = db.prepare(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id IN (${placeholders})`).all(...ids);
      res.json(products.map(p => parseProduct(p)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/vendor/products/bulk", (req, res) => {
    try {
      const { products: bulkProducts } = req.body;
      if (!bulkProducts || !Array.isArray(bulkProducts)) return res.status(400).json({ error: "Products array required" });
      const insert = db.prepare("INSERT INTO products (name, sku, description, price, stock, vendor_id) VALUES (?, ?, ?, ?, ?, 1)");
      const inserted = [];
      for (const p of bulkProducts) {
        const result = insert.run(p.name, p.sku || null, p.description || null, p.price || 0, p.stock || 0);
        inserted.push(result.lastInsertRowid);
      }
      res.json({ inserted: inserted.length });
    } catch (error) {
      res.status(500).json({ error: "Bulk upload failed" });
    }
  });

  app.get("/api/vendor/shipping", (req, res) => {
    try {
      const methods = db.prepare("SELECT * FROM vendor_shipping_methods WHERE vendor_id = 1").all();
      res.json(methods);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/orders", (req, res) => {
    try {
      const orders = db.prepare("SELECT o.*, u.name as customer_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC").all();
      res.json(orders);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/notifications", (req, res) => {
    try {
      const notifications = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50").all();
      res.json(notifications);
    } catch (error) {
      res.json([]);
    }
  });

  app.put("/api/notifications/read-all", (req, res) => {
    try {
      db.prepare("UPDATE notifications SET is_read = 1").run();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notifications as read" });
    }
  });

  app.get("/api/admin/banners", (req, res) => {
    try {
      const banners = db.prepare("SELECT * FROM home_banners ORDER BY created_at DESC").all();
      res.json(banners);
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/admin/products", (req, res) => {
    try {
      const products = db.prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC").all();
      res.json(products.map(p => parseProduct(p)));
    } catch (error) {
      res.json([]);
    }
  });

  app.get("/api/admin/orders", (req, res) => {
    try {
      const orders = db.prepare("SELECT o.*, u.name as customer_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC").all();
      res.json(orders);
    } catch (error) {
      res.json([]);
    }
  });

  // GoKwik-like Express Checkout & Spam Prevention
  app.post("/api/express-checkout", async (req, res) => {
    try {
      const { product_id, quantity, customer, payment_mode } = req.body;
      if (!product_id || !customer) return res.status(400).json({ error: "Missing required fields" });

      // Spam order detection
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      const recentOrders = db.prepare(
        "SELECT COUNT(*) as count FROM orders WHERE created_at > ?"
      ).get(oneMinuteAgo) as { count: number };

      let riskScore = 0;
      if (recentOrders.count > 10) riskScore += 30;
      
      // Check for duplicate customer (same name+email in last 5 min)
      const duplicateCustomer = db.prepare(
        "SELECT COUNT(*) as count FROM orders WHERE shipping_address LIKE ? AND created_at > ?"
      ).get(`%${customer.email}%`, new Date(Date.now() - 300000).toISOString()) as { count: number };
      if (duplicateCustomer.count > 3) riskScore += 40;

      // Check IP-based rate limiting
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const ordersFromIp = db.prepare(
        "SELECT COUNT(*) as count FROM orders WHERE shipping_address LIKE ? AND created_at > ?"
      ).get(`%${ip}%`, new Date(Date.now() - 60000).toISOString()) as { count: number };
      if (ordersFromIp.count > 5) riskScore += 30;

      if (riskScore > 50) {
        return res.json({
          status: "flagged",
          riskScore,
          message: "Order flagged for manual review due to suspicious activity.",
          requiresOTP: true
        });
      }

      // Create express order
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(product_id) as any;
      if (!product) return res.status(404).json({ error: "Product not found" });
      if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });

      const orderResult = db.prepare(
        "INSERT INTO orders (user_id, total, status, payment_status, shipping_address) VALUES (?, ?, ?, ?, ?)"
      ).run(customer.userId || 1, product.price * quantity, "confirmed", payment_mode === 'cod' ? 'pending' : 'paid', JSON.stringify(customer));

      const orderId = orderResult.lastInsertRowid;
      db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)")
        .run(orderId, product_id, quantity, product.price);
      db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(quantity, product_id);

      res.json({
        status: "success",
        orderId,
        riskScore,
        message: `Order #ORD-${orderId} placed successfully!`,
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
      });
    } catch (e: any) {
      res.status(500).json({ error: "Checkout failed", details: e.message });
    }
  });

  app.post("/api/check-spam", (req, res) => {
    try {
      const { email, ip } = req.body;
      const fiveMinAgo = new Date(Date.now() - 300000).toISOString();
      const recentFromEmail = db.prepare(
        "SELECT COUNT(*) as count FROM orders WHERE shipping_address LIKE ? AND created_at > ?"
      ).get(`%${email || ''}%`, fiveMinAgo) as { count: number };

      res.json({
        isSpam: recentFromEmail.count > 3,
        recentOrders: recentFromEmail.count,
        riskLevel: recentFromEmail.count > 5 ? "high" : recentFromEmail.count > 2 ? "medium" : "low"
      });
    } catch {
      res.json({ isSpam: false, recentOrders: 0, riskLevel: "low" });
    }
  });

  app.get("/api/products/:id/relations", (req, res) => {
    try {
      const { type } = req.query;
      let query = "SELECT r.*, p.name, p.price, p.image, p.stock FROM product_relations r JOIN products p ON r.related_product_id = p.id WHERE r.product_id = ?";
      const params: any[] = [req.params.id];
      if (type) { query += " AND r.relation_type = ?"; params.push(type); }
      query += " ORDER BY r.sort_order ASC";
      const relations = db.prepare(query).all(...params);
      res.json(relations);
    } catch { res.status(500).json({ error: "Failed to fetch relations" }); }
  });

  app.get("/api/instagram-feeds", (req, res) => {
    try {
      const feeds = db.prepare("SELECT * FROM instagram_feeds WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 6").all();
      res.json(feeds);
    } catch { res.json([]); }
  });

  app.get("/api/faqs", (req, res) => {
    try {
      const { category } = req.query;
      let query = "SELECT * FROM faqs WHERE is_active = 1";
      const params: any[] = [];
      if (category) { query += " AND category = ?"; params.push(category); }
      query += " ORDER BY sort_order ASC";
      res.json(db.prepare(query).all(...params));
    } catch { res.json([]); }
  });

  // Vite/Static Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = parseInt(process.env.PORT || "3000", 10);
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

await startServer();
export default app;
