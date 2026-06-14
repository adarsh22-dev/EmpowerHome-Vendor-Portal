import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

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

  // Gemini AI Chatbot / Shopping Assistant Route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Fetch actual inventory for budget-aware live recommendations
      let productContext = "";
      try {
        const products = db.prepare(`
          SELECT p.id, p.name, p.price, p.description, p.brand, p.model_name, c.name as category_name 
          FROM products p 
          LEFT JOIN categories c ON p.category_id = c.id 
          LIMIT 10
        `).all() as any[];
        
        productContext = "Here is the current live store catalog inventory you can suggest:\n" + products.map(p => 
          `- ID: ${p.id}, "${p.name}" by ${p.brand || 'Nova'} (Category: ${p.category_name || 'General'}, Price: $${p.price}). Description: ${p.description || p.short_description || 'No description'}.`
        ).join("\n");
      } catch (dbErr) {
        console.warn("DB not accessible in chat context, using mock inventory", dbErr);
        productContext = "Available products:\n- ID: 1, Pro Wireless Headphones ($299.99)\n- ID: 5, Nexus Elite Pro Smartphone ($999.99)\n- ID: 2, Ultra Slim Laptop ($1200.00)";
      }

      const systemInstruction = 
        "You are Nova AI, the brilliant, helpful, and highly sophisticated AI Shopping Assistant and virtual operating system concierge of NovaCart AI.\n" +
        "Your goal is to assist customers with budget-aware conversational product discovery, side-by-side comparisons, gift ideas or technical specifications, " +
        "referencing only products from the available catalog when relevant. Use beautiful markdown formatting. Keep your responses highly engaging, modern, and concise.";

      if (ai) {
        // Prepare contents
        const fullPrompt = `${systemInstruction}\n\n${productContext}\n\nUser Question: "${message}"`;
        
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: fullPrompt,
        });

        res.json({ response: response.text });
      } else {
        // Safe, highly contextual fallback when Gemini API Key is not set yet
        let localResponse = `I'm **Nova AI**, your Shopping Assistant! \n\nI can see some amazing products in our catalog like the **Pro Wireless Headphones ($299.99)** and the flagship **Nexus Elite Pro Smartphone ($999.99)**. \n\nWhat are you looking for today? I can help you compare them, plan your budget, or track your orders!`;
        
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("compare") || lowerMsg.includes("headphones") || lowerMsg.includes("phone")) {
          localResponse = `Here is a side-by-side comparison for you:\n\n| Attribute | Pro Wireless Headphones | Nexus Elite Pro Smartphone |\n| --- | --- | --- |\n| **Price** | $299.99 | $999.99 |\n| **Brand** | Nexus | Nexus Elite |\n| **Best For** | High-fidelity audio, calls | Ultra-performance, tasking |\n\n*Note: To enable full live-learning dynamic AI answers, don't forget to configure your \`GEMINI_API_KEY\` in your Settings secrets panel!*`;
        } else if (lowerMsg.includes("budget") || lowerMsg.includes("under") || lowerMsg.includes("laptop")) {
          localResponse = `Based on your request, I highly recommend our **Ultra Slim Laptop** ($1200.00) if you need high performance, or we can look at accessories matching your budget under $300! \n\n*Note: To enable live Gemini AI models, please make sure your \`GEMINI_API_KEY\` is configured in Settings secrets.*`;
        }

        res.json({ 
          response: localResponse,
          isOfflineMock: true 
        });
      }
    } catch (e: any) {
      console.error("Gemini Chat failed:", e);
      res.status(500).json({ error: "Gemini assistant error", details: e.message });
    }
  });

  // AI SEO Studio generation route
  app.post("/api/gemini/seo", async (req, res) => {
    try {
      const { name, category, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Product name is required" });
      }

      const promptMsg = 
        `Generate comprehensive e-commerce SEO optimization metadata for the following product:\n` +
        `Product Name: ${name}\n` +
        `Category: ${category || "General"}\n` +
        `Description: ${description || "No description provided"}\n\n` +
        `Return your response strictly in JSON format as specified below:\n` +
        `{\n` +
        `  "seoTitle": "High CTR Optimized title under 60 chars",\n` +
        `  "seoDescription": "Meta description under 160 chars starting with a verb or value prop",\n` +
        `  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],\n` +
        `  "faqs": [\n` +
        `    {"question": "FAQ Question 1?", "answer": "Detailed answer 1."},\n` +
        `    {"question": "FAQ Question 2?", "answer": "Detailed answer 2."}\n` +
        `  ]\n` +
        `}`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: promptMsg,
          config: {
            responseMimeType: "application/json"
          }
        });

        try {
          const seoResult = JSON.parse(response.text.trim());
          res.json(seoResult);
        } catch (jsonErr) {
          // If structure parsing failed, try searching for the JSON block
          const match = response.text.match(/\{[\s\S]*\}/);
          if (match) {
            res.json(JSON.parse(match[0]));
          } else {
            throw jsonErr;
          }
        }
      } else {
        // High quality local SEO advisor simulation fallback
        const cleanName = name.trim();
        res.json({
          seoTitle: `${cleanName} - Best Price & Quality Online`,
          seoDescription: `Get the highest quality ${cleanName} in ${category || "General"}. Buy now to avail of amazing discounts, verified reviews, and fast shipping!`,
          keywords: [cleanName.toLowerCase(), category?.toLowerCase() || "ecommerce", "best price", "shop online", "premium quality"],
          faqs: [
            { question: `What makes the ${cleanName} unique?`, answer: `This product stands out in the ${category || "General"} category due to its exceptional quality, customer satisfaction, and durable build.` },
            { question: `Is there any warranty on ${cleanName}?`, answer: `Yes, verified purchases come with standard vendor warranty and coverage. Check warranty terms above.` }
          ],
          isOfflineMock: true
        });
      }
    } catch (e: any) {
      console.error("Gemini SEO failed:", e);
      res.status(500).json({ error: "Gemini SEO Assistant error", details: e.message });
    }
  });

  // AI Product Intelligence (Phase 1)
  app.post("/api/gemini/product-intelligence", async (req, res) => {
    try {
      const product = req.body;
      if (!product || !product.name) {
        return res.status(400).json({ error: "Product name is required" });
      }

      const promptMsg = 
        `You are an e-commerce merchandising expert. Given the following product information, generate comprehensive product intelligence.

Product Information:
- Name: ${product.name || ''}
- SKU: ${product.sku || ''}
- Category: ${product.category || product.category_name || 'General'}
- Brand: ${product.brand || ''}
- Model: ${product.model_name || product.model || ''}
- Description: ${product.description || product.short_description || product.shortDesc || ''}
- Price: ${product.price || product.regular_price || 0}
- Sale Price: ${product.sale_price || product.salePrice || ''}
- Stock: ${product.stock || 0}
- Weight: ${product.weight || ''}
- Dimensions: ${product.dimensions || ''}
- Material: ${product.material || ''}
- Warranty: ${product.warranty || ''}
- Origin: ${product.origin || ''}
- Tags: ${Array.isArray(product.vendor_tags || product.tags) ? (product.vendor_tags || product.tags).join(', ') : (product.vendor_tags || product.tags || '')}
- Attributes: ${product.extra_attributes ? (typeof product.extra_attributes === 'string' ? product.extra_attributes : JSON.stringify(product.extra_attributes)) : ''}
- Technical Details: ${product.technical_details ? (typeof product.technical_details === 'string' ? product.technical_details : JSON.stringify(product.technical_details)) : ''}
- Additional Details: ${product.additional_details || ''}
- SEO Title: ${product.seo?.title || product.seo_title || product.seoTitle || ''}
- SEO Description: ${product.seo?.description || product.seo_description || product.seoDesc || ''}
- SEO Keywords: ${product.seo?.keywords || product.seo_keywords || product.metaKeywords || ''}
- Manufacturer Images: ${Array.isArray(product.manufacturer_images) ? product.manufacturer_images.length : (product.manufacturer_images ? product.manufacturer_images.split(',').length : 0)} images
- Manufacturer Videos: ${Array.isArray(product.manufacturer_videos) ? product.manufacturer_videos.length : (product.manufacturer_videos ? product.manufacturer_videos.split(',').length : 0)} videos
- Gallery Images: ${Array.isArray(product.images) ? product.images.length : 0} images

Return valid JSON ONLY with the following structure:
{
  "generatedDescription": "A compelling, detailed product description (150-300 words) optimized for e-commerce conversions",
  "shortDescription": "A concise one-line summary under 150 characters",
  "seoTitle": "SEO-optimized title under 60 characters with primary keyword at the start",
  "seoDescription": "Meta description under 160 characters starting with a verb or value proposition",
  "bulletPoints": ["Feature 1 with benefit", "Feature 2 with benefit", "Feature 3 with benefit", "Feature 4 with benefit", "Feature 5 with benefit"],
  "searchKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "missingAttributes": ["Missing field name 1", "Missing field name 2"],
  "qualityScore": 75,
  "suggestedImprovements": ["Improvement suggestion 1", "Improvement suggestion 2"],
  "duplicateProducts": []
}`;

      // Check for potential duplicates in the database
      let duplicates: any[] = [];
      try {
        const existingProducts = db.prepare("SELECT id, name, sku, price, image FROM products WHERE name LIKE ? OR sku = ?")
          .all(`%${product.name}%`, product.sku || '') as any[];
        duplicates = existingProducts
          .filter((p: any) => String(p.id) !== String(product.id))
          .slice(0, 5);
      } catch (dbErr) {
        console.warn("Could not check duplicates:", dbErr);
      }

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: promptMsg,
          config: {
            responseMimeType: "application/json"
          }
        });

        try {
          const result = JSON.parse(response.text.trim());
          result.duplicateProducts = duplicates;
          res.json(result);
        } catch (jsonErr) {
          const match = response.text.match(/\{[\s\S]*\}/);
          if (match) {
            const result = JSON.parse(match[0]);
            result.duplicateProducts = duplicates;
            res.json(result);
          } else {
            throw jsonErr;
          }
        }
      } else {
        const cleanName = product.name.trim();
        const desc = product.description || product.shortDesc || '';
        const cat = product.category || 'General';
        
        const missingFields: string[] = [];
        if (!product.description && !product.shortDesc) missingFields.push("Description");
        if (!product.brand) missingFields.push("Brand");
        if (!product.material) missingFields.push("Material");
        if (!product.warranty) missingFields.push("Warranty");
        if (!product.origin) missingFields.push("Country of Origin");
        if (!product.weight) missingFields.push("Weight");
        if (!product.dimensions) missingFields.push("Dimensions");
        if (!product.image && (!product.images || product.images.length === 0)) missingFields.push("Product Images");
        if (!product.sku) missingFields.push("SKU");
        if (!product.price) missingFields.push("Price");

        const filledFields = [
          product.name, product.description || product.shortDesc, product.brand,
          product.price, product.sku, product.material, product.warranty,
          product.origin, product.weight, product.dimensions
        ].filter(Boolean).length;
        const totalFields = 10;
        const qualityScore = Math.min(100, Math.round((filledFields / totalFields) * 100));
        
        res.json({
          generatedDescription: desc || `${cleanName} - Premium quality product in the ${cat} category. Engineered for durability and performance, this product delivers exceptional value. Perfect for everyday use with reliable construction and modern design.`,
          shortDescription: desc ? (desc.length > 150 ? desc.substring(0, 147) + '...' : desc) : `Premium ${cleanName} for ${cat} enthusiasts`,
          seoTitle: `${cleanName} - Buy Best ${cat} Online at Best Price`,
          seoDescription: desc ? (desc.length > 160 ? desc.substring(0, 157) + '...' : desc) : `Shop ${cleanName} at the best price. Premium ${cat} product with high quality. Fast shipping & easy returns.`,
          bulletPoints: [
            `High-quality ${cleanName} designed for durability and long-lasting performance`,
            `Perfect for ${cat} applications with premium materials and construction`,
            `Easy to use and maintain - ideal for both beginners and professionals`,
            `Backed by warranty and excellent customer support`,
            `Competitive pricing with great value for money`
          ],
          searchKeywords: [cleanName.toLowerCase(), cat.toLowerCase(), "premium quality", "best price", "shop online", "fast shipping", "buy now"],
          missingAttributes: missingFields,
          qualityScore: qualityScore,
          suggestedImprovements: [
            qualityScore < 100 ? `Add missing fields: ${missingFields.join(', ')}` : "Product is complete",
            qualityScore < 80 ? "Add detailed product description to improve search ranking" : "Description looks good",
            !product.images || product.images.length === 0 ? "Upload high-quality product images to increase conversion" : "Images are present",
            !product.brand ? "Add brand information for better credibility" : "Brand information is set",
            !product.price || product.price <= 0 ? "Set a competitive price" : "Pricing is configured"
          ].filter(s => !s.includes("looks good") && !s.includes("is set") && !s.includes("is configured") && !s.includes("is complete") && !s.includes("are present")),
          duplicateProducts: duplicates
        });
      }
    } catch (e: any) {
      console.error("Product Intelligence failed:", e);
      res.status(500).json({ error: "Product Intelligence error", details: e.message });
    }
  });

  // AI Vendor Copilot (Phase 2)
  app.post("/api/gemini/vendor-copilot", async (req, res) => {
    try {
      const { products } = req.body;
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Product inventory data is required" });
      }

      let ordersData: any[] = [];
      let paymentsData: any[] = [];
      try {
        ordersData = db.prepare("SELECT o.*, oi.product_id, oi.quantity, oi.price as unit_price FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id ORDER BY o.created_at DESC LIMIT 100").all() as any[];
        paymentsData = db.prepare("SELECT * FROM payments WHERE vendor_id = 1 ORDER BY created_at DESC LIMIT 50").all() as any[];
      } catch (dbErr) {
        console.warn("Could not fetch sales data:", dbErr);
      }

      const dataContext = {
        productCount: products.length,
        inventorySummary: {
          totalStock: products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0),
          totalValue: products.reduce((sum: number, p: any) => sum + ((p.stock || 0) * (p.price || 0)), 0),
          lowStockItems: products.filter((p: any) => p.stock <= 10).map((p: any) => ({ name: p.name, stock: p.stock, sku: p.sku })),
          outOfStock: products.filter((p: any) => p.stock === 0 || p.stock_status === 'outofstock').map((p: any) => p.name),
          avgPrice: products.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / products.length,
          priceRange: {
            min: Math.min(...products.map((p: any) => p.price || 0)),
            max: Math.max(...products.map((p: any) => p.price || 0))
          }
        },
        hasSalesData: ordersData.length > 0,
        recentOrders: ordersData.slice(0, 10),
        recentPayments: paymentsData.slice(0, 10),
        products: products.map((p: any) => ({
          id: p.id, name: p.name, sku: p.sku, price: p.price,
          sale_price: p.sale_price, stock: p.stock, stock_status: p.stock_status,
          category: p.category_name || 'General', brand: p.brand || '',
          is_featured: p.is_featured, created_at: p.created_at,
          images: p.image ? 1 : 0
        }))
      };

      const promptMsg = 
        `You are an AI business consultant specializing in e-commerce merchandising and inventory management. Analyze the following vendor data and provide strategic recommendations.

Vendor Data:
${JSON.stringify(dataContext, null, 2)}

Return valid JSON ONLY with the following structure:
{
  "bestTimeForDiscounts": {
    "recommendation": "Clear recommendation on when to run discounts",
    "reasoning": "Detailed reasoning based on data analysis",
    "suggestedDiscount": "e.g. 15-20% off",
    "timing": "e.g. Next 2 weeks, End of month"
  },
  "replenishmentAlerts": [
    {
      "productName": "Product name",
      "currentStock": 5,
      "reorderPoint": 20,
      "recommendedQty": 50,
      "urgency": "high/medium/low",
      "reasoning": "Why this product needs replenishment"
    }
  ],
  "slowMovingStock": [
    {
      "productName": "Product name",
      "stock": 100,
      "price": 29.99,
      "daysInInventory": 90,
      "recommendation": "e.g. Bundle with popular item, reduce price by 20%",
      "reasoning": "Why this product is slow-moving"
    }
  ],
  "pricingSuggestions": [
    {
      "productName": "Product name",
      "currentPrice": 49.99,
      "suggestedPrice": 44.99,
      "reasoning": "Market positioning and margin analysis",
      "expectedImpact": "e.g. +25% volume, +10% revenue"
    }
  ],
  "predictedDemand": [
    {
      "productName": "Product name",
      "currentStock": 30,
      "predictedWeeklyDemand": 15,
      "stockoutRisk": "high/medium/low",
      "recommendedAction": "e.g. Order 60 units within 2 weeks"
    }
  ],
  "competitorBenchmarking": {
    "pricePositioning": "e.g. Premium/Mid-range/Budget compared to market",
    "strengths": ["Strength 1"],
    "weaknesses": ["Weakness 1"],
    "opportunities": ["Opportunity 1"],
    "threats": ["Threat 1"]
  },
  "topOpportunities": [
    {
      "priority": 1,
      "title": "Opportunity title",
      "description": "Detailed description",
      "expectedROI": "e.g. +15% revenue",
      "effort": "low/medium/high",
      "timeline": "e.g. 2-4 weeks"
    }
  ]
}`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: promptMsg,
          config: { responseMimeType: "application/json" }
        });

        try {
          const result = JSON.parse(response.text.trim());
          res.json(result);
        } catch (jsonErr) {
          const match = response.text.match(/\{[\s\S]*\}/);
          if (match) {
            res.json(JSON.parse(match[0]));
          } else {
            throw jsonErr;
          }
        }
      } else {
        const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= 10);
        const outOfStock = products.filter((p: any) => p.stock === 0 || p.stock_status === 'outofstock');
        const wellStocked = products.filter((p: any) => p.stock > 50);
        const totalInv = products.reduce((s: number, p: any) => s + (p.stock || 0), 0);
        const avgStock = products.length > 0 ? totalInv / products.length : 0;

        res.json({
          bestTimeForDiscounts: {
            recommendation: "Run flash sales on weekdays when conversion rates peak",
            reasoning: outOfStock.length > 0
              ? `${outOfStock.length} products are out of stock. Discounts on well-stocked items can clear inventory before seasonal shifts.`
              : `Average stock level is ${avgStock.toFixed(0)} units. Consider running promotions mid-month to boost cash flow.`,
            suggestedDiscount: "15-25% off on slow-moving items",
            timing: "Mid-month, Tue-Thu for maximum visibility"
          },
          replenishmentAlerts: lowStock.length > 0
            ? lowStock.map((p: any) => ({
                productName: p.name,
                currentStock: p.stock,
                reorderPoint: 20,
                recommendedQty: Math.max(50, Math.round(avgStock * 2)),
                urgency: p.stock <= 5 ? 'high' : 'medium',
                reasoning: `Stock level (${p.stock}) is critically low. Based on average inventory of ${Math.round(avgStock)} units across all products, reorder to maintain availability.`
              }))
            : [{
                productName: "All Products",
                currentStock: Math.round(avgStock),
                reorderPoint: 20,
                recommendedQty: 0,
                urgency: "low",
                reasoning: "No products currently below reorder threshold."
              }],
          slowMovingStock: wellStocked.length > 0
            ? wellStocked.slice(0, 3).map((p: any) => ({
                productName: p.name,
                stock: p.stock,
                price: p.price,
                daysInInventory: 60,
                recommendation: p.sale_price ? "Feature in clearance section" : "Reduce price by 15-20% to accelerate turnover",
                reasoning: `Stock level (${p.stock}) is above average (${Math.round(avgStock)}). Consider bundling or discounting.`
              }))
            : [],
          pricingSuggestions: products.slice(0, 3).map((p: any) => ({
            productName: p.name,
            currentPrice: p.price,
            suggestedPrice: p.sale_price ? p.sale_price : Math.round(p.price * 0.9 * 100) / 100,
            reasoning: p.sale_price
              ? `Sale price ($${p.sale_price}) already set. Monitor conversion rate to optimize.`
              : `Price at $${p.price} is above category average. A 10% reduction could increase volume by 15-20%.`,
            expectedImpact: p.sale_price ? "Maintain current pricing strategy" : "+15-20% volume at revised price point"
          })),
          predictedDemand: products.slice(0, 3).map((p: any) => ({
            productName: p.name,
            currentStock: p.stock,
            predictedWeeklyDemand: Math.max(1, Math.round(p.stock * 0.15)),
            stockoutRisk: p.stock <= 10 ? 'high' : p.stock <= 30 ? 'medium' : 'low',
            recommendedAction: p.stock <= 20
              ? `Order ${Math.round(p.stock * 2)} units to maintain 8-week supply`
              : "Current stock levels are adequate"
          })),
          competitorBenchmarking: {
            pricePositioning: products.some((p: any) => p.price > 200) ? "Premium" : products.some((p: any) => p.price > 50) ? "Mid-range" : "Budget-friendly",
            strengths: [
              `${products.length} products in catalog`,
              `Average price point of $${(products.reduce((s: number, p: any) => s + (p.price || 0), 0) / Math.max(1, products.length)).toFixed(2)}`,
              ...(products.some((p: any) => p.is_featured) ? ["Featured products drawing attention"] : [])
            ],
            weaknesses: [
              ...(outOfStock.length > 0 ? [`${outOfStock.length} products out of stock`] : []),
              ...(products.some((p: any) => !p.image) ? ["Products missing images reduce conversion"] : []),
              ...(products.some((p: any) => !p.brand) ? ["Brand information missing on some products"] : [])
            ],
            opportunities: [
              "Bundle slow-moving stock with popular items",
              "Optimize product descriptions for SEO",
              "Expand product categories based on inventory trends"
            ],
            threats: [
              "Price-sensitive market requires competitive pricing",
              "Stockouts may drive customers to competitors"
            ]
          },
          topOpportunities: [
            {
              priority: 1,
              title: outOfStock.length > 0 ? "Restock Out-of-Stock Products" : "Optimize Product Pricing",
              description: outOfStock.length > 0
                ? `${outOfStock.length} products are currently out of stock, representing lost revenue. Prioritize replenishment.`
                : "Review and adjust pricing on overstocked items to improve inventory turnover.",
              expectedROI: "+10-15% revenue recovery",
              effort: "medium",
              timeline: "1-2 weeks"
            },
            {
              priority: 2,
              title: lowStock.length > 0 ? "Replenish Low Stock Items" : "Enhance Product Listings",
              description: lowStock.length > 0
                ? `${lowStock.length} products are near stockout. Prevent lost sales with timely reordering.`
                : "Add detailed descriptions and images to products missing them for better conversion.",
              expectedROI: "+5-10% conversion rate",
              effort: "low",
              timeline: "Ongoing"
            },
            {
              priority: 3,
              title: "Run Targeted Promotion",
              description: "Leverage slow-moving stock for a flash sale or bundle deal to free up warehouse space and improve cash flow.",
              expectedROI: "+8-12% revenue uplift",
              effort: "low",
              timeline: "This month"
            }
          ]
        });
      }
    } catch (e: any) {
      console.error("Vendor Copilot failed:", e);
      res.status(500).json({ error: "Vendor Copilot error", details: e.message });
    }
  });

  // Phase 3 - AI Customer Assistant (conversational shopping, semantic search, comparison)
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { message, history, context } = req.body;
      if (!message) return res.status(400).json({ error: "Message is required" });

      let catalog = "";
      try {
        const products = db.prepare("SELECT p.id, p.name, p.price, p.sale_price, p.description, p.brand, p.stock, p.image, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LIMIT 20").all() as any[];
        catalog = products.map(p => `ID:${p.id} "${p.name}" $${p.price} (${p.category_name||'General'}, Stock:${p.stock})`).join("\n");
      } catch(e) { catalog = "Catalog unavailable"; }

      const promptMsg = `You are an AI shopping assistant. Answer naturally and helpfully.

Catalog:
${catalog}

Conversation history:
${(history||[]).map((m:any)=>`${m.role}: ${m.content}`).join("\n")}

User: ${message}

Help with: product discovery, comparisons, recommendations. Be concise. Return JSON: { "response": "your answer", "products": [product_ids] }`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: promptMsg,
          config: { responseMimeType: "application/json" }
        });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        const lower = message.toLowerCase();
        let response = `I can help you find products in our catalog! Try asking about specific categories or features.`;
        if (lower.includes("laptop") || lower.includes("gaming")) response = `I found some great options! Check our Ultra Slim Laptop ($1,200) for performance, or browse our electronics category for more choices.`;
        else if (lower.includes("compare")) response = `I'd be happy to compare products for you. Which specific products are you interested in?`;
        else if (lower.includes("under") || lower.includes("budget")) response = `Looking for budget-friendly options? We have products starting from $25. Let me know your preferred category!`;
        res.json({ response, products: [] });
      }
    } catch (e: any) {
      res.status(500).json({ error: "Assistant error", details: e.message });
    }
  });

  // Phase 4 - Visual Search
  app.post("/api/gemini/visual-search", async (req, res) => {
    try {
      const { imageUrl, description } = req.body;
      if (!imageUrl) return res.status(400).json({ error: "Image URL is required" });

      let products: any[] = [];
      try {
        products = db.prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LIMIT 20").all() as any[];
      } catch(e) {}

      if (ai) {
        const promptMsg = `Analyze this product image: ${imageUrl}. Description: ${description||''}

Available products: ${JSON.stringify(products.map(p=>({id:p.id,name:p.name,price:p.price,category:p.category_name,image:p.image})))}

Return JSON: { "similarProducts": [{id, name, price, image, matchReason, confidence:0-100}], "colorMatches": ["color1"], "styleRecommendations": ["style1"], "priceAlternatives": [{name, price, diff}] }`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash", contents: promptMsg,
          config: { responseMimeType: "application/json" }
        });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        res.json({
          similarProducts: products.slice(0, 4).map(p=>({id:p.id,name:p.name,price:p.price,image:p.image,matchReason:"Matches your image style",confidence:85})),
          colorMatches: ["Black", "White", "Gray"],
          styleRecommendations: ["Modern", "Minimalist"],
          priceAlternatives: products.slice(1,3).map(p=>({name:p.name,price:p.price,diff:Math.round(((p.price-products[0]?.price||0)/products[0]?.price||1)*100)}))
        });
      }
    } catch (e: any) {
      res.status(500).json({ error: "Visual search error", details: e.message });
    }
  });

  // Phase 5 - Review Analysis & CRUD
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

  app.post("/api/gemini/review-analysis", async (req, res) => {
    try {
      const { product_id, reviews } = req.body;
      let reviewData = reviews;
      if (product_id && !reviews) {
        reviewData = db.prepare("SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ?").all(product_id);
      }
      if (!reviewData || reviewData.length === 0) {
        reviewData = [
          { rating: 5, comment: "Excellent product, highly recommend!", user_name: "John" },
          { rating: 4, comment: "Good quality for the price", user_name: "Sarah" },
          { rating: 3, comment: "Average, expected better", user_name: "Mike" },
          { rating: 2, comment: "Not as described", user_name: "Lisa" },
          { rating: 5, comment: "Perfect, love it!", user_name: "David" }
        ];
      }

      const avgRating = (reviewData.reduce((s:number,r:any)=>s+r.rating,0)/reviewData.length).toFixed(1);

      if (ai) {
        const promptMsg = `Analyze these product reviews and return JSON:
Reviews: ${JSON.stringify(reviewData.map((r:any)=>({rating:r.rating,comment:r.comment})))}

Return: { "topStrengths": ["strength1"], "topWeaknesses": ["weakness1"], "overallSentiment": "positive/negative/mixed", "avgRating": ${avgRating}, "totalReviews": ${reviewData.length}, "mostMentionedIssues": ["issue1"], "buyingRecommendation": "recommend/caution/avoid", "sentimentScore": 0-100, "topComplaints": [{"issue":"...","frequency":5}] }`;

        const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: promptMsg, config: { responseMimeType: "application/json" } });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        const allComments = reviewData.map((r:any)=>r.comment?.toLowerCase()||'');
        const hasQuality = allComments.some((c:string)=>c.includes('quality'));
        const hasPrice = allComments.some((c:string)=>c.includes('price')||c.includes('value'));
        const sentimentScore = Math.round((reviewData.filter((r:any)=>r.rating>=4).length/reviewData.length)*100);
        res.json({
          topStrengths: hasQuality ? ["Product quality", "Value for money", "Durable build"] : ["Good performance", "Customer satisfaction", "Reliability"],
          topWeaknesses: hasPrice ? ["Price point", "Packaging could improve"] : ["Limited color options", "Could include more accessories"],
          overallSentiment: sentimentScore >= 70 ? "positive" : sentimentScore >= 40 ? "mixed" : "negative",
          avgRating: parseFloat(avgRating), totalReviews: reviewData.length,
          sentimentScore, mostMentionedIssues: ["Delivery time", "Packaging quality"],
          buyingRecommendation: avgRating >= '4.0' ? "recommend" : avgRating >= '3.0' ? "consider" : "caution",
          ratingDistribution: { 1: reviewData.filter((r:any)=>r.rating===1).length, 2: reviewData.filter((r:any)=>r.rating===2).length, 3: reviewData.filter((r:any)=>r.rating===3).length, 4: reviewData.filter((r:any)=>r.rating===4).length, 5: reviewData.filter((r:any)=>r.rating===5).length },
          topComplaints: [{issue:"Delivery delays",frequency:3},{issue:"Packaging quality",frequency:2}]
        });
      }
    } catch (e: any) { res.status(500).json({ error: "Review analysis error", details: e.message }); }
  });

  // Phase 6 - Predictive Analytics
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

  app.post("/api/gemini/predictive-analytics", async (req, res) => {
    try {
      const { products, salesData } = req.body;
      let orderData: any[] = [];
      try { orderData = db.prepare("SELECT o.*, oi.product_id, oi.quantity, oi.price as unit_price FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id ORDER BY o.created_at DESC LIMIT 200").all() as any[]; } catch(e) {}
      let productData: any[] = [];
      try { productData = db.prepare("SELECT id, name, price, stock, created_at FROM products").all() as any[]; } catch(e) {}
      const totalRev = orderData.reduce((s,o)=>s+(o.total||0),0);
      const totalOrders = orderData.length;

      if (ai) {
        const promptMsg = `Analyze this e-commerce data and provide predictive analytics. Return JSON.
Products: ${JSON.stringify(productData.slice(0,20))}
Orders: ${JSON.stringify(orderData.slice(0,20))}
Total Revenue: ${totalRev}, Total Orders: ${totalOrders}

Return: { "revenueForecast": {"nextMonth": 50000, "nextQuarter": 150000, "confidence": 0.85}, "churnPrediction": {"currentChurnRate": 5.2, "predictedNextMonth": 4.8, "atRiskCustomers": 12}, "customerLifetimeValue": {"average": 2500, "topPercentile": 15000, "bottomPercentile": 200}, "repeatPurchaseProbability": {"average": 0.35, "highValue": 0.72}, "seasonalDemand": [{"month":"Jan","expectedDemand":85},{"month":"Dec","expectedDemand":150}], "productPopularityTrends": [{"productId":1,"trend":"rising","peakMonth":"Dec"}], "forecastData": [{"label":"Month","value":100}] }`;

        const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: promptMsg, config: { responseMimeType: "application/json" } });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        res.json({
          revenueForecast: { nextMonth: Math.round(totalRev * 1.1), nextQuarter: Math.round(totalRev * 3.2), confidence: 0.82, monthly: Array.from({length:6},(_,i)=>({month:["Jan","Feb","Mar","Apr","May","Jun"][i],forecast:Math.round(30000+Math.random()*40000),lowerBound:Math.round(20000+Math.random()*20000),upperBound:Math.round(40000+Math.random()*40000)})) },
          churnPrediction: { currentChurnRate: 5.2, predictedNextMonth: 4.8, atRiskCustomers: Math.round(totalOrders * 0.1), riskFactors: ["Low engagement","Price sensitivity","Competitor activity"] },
          customerLifetimeValue: { average: totalOrders > 0 ? Math.round(totalRev/totalOrders) : 2500, topPercentile: 15000, bottomPercentile: 200, distribution: [{segment:"High",value:15000,pct:10},{segment:"Medium",value:5000,pct:30},{segment:"Low",value:500,pct:60}] },
          repeatPurchaseProbability: { average: 0.35, highValue: 0.72, lowValue: 0.12, byCategory: [{category:"Electronics",probability:0.45},{category:"Fashion",probability:0.55}] },
          seasonalDemand: Array.from({length:12},(_,i)=>({month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],expectedDemand:Math.round(50+Math.random()*100),peak:i===11})),
          productPopularityTrends: productData.slice(0,5).map(p=>({productId:p.id,productName:p.name,trend:["rising","stable","declining"][Math.floor(Math.random()*3)],peakMonth:"Dec",popularityScore:Math.round(30+Math.random()*70)})),
          forecastData: Array.from({length:12},(_,i)=>({label:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],actual:Math.round(20000+Math.random()*40000),forecast:Math.round(25000+Math.random()*35000)}))
        });
      }
    } catch (e: any) { res.status(500).json({ error: "Predictive analytics error", details: e.message }); }
  });

  // Phase 7 - Fraud Detection
  app.post("/api/gemini/fraud-detection", async (req, res) => {
    try {
      const { reviews, orders, users } = req.body;
      let orderData: any[] = [];
      try { orderData = db.prepare("SELECT o.*, u.email, u.name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 50").all() as any[]; } catch(e) {}
      let reviewData: any[] = [];
      try { reviewData = db.prepare("SELECT r.*, u.name as user_name, u.email FROM reviews r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT 50").all() as any[]; } catch(e) {}
      let userData: any[] = [];
      try { userData = db.prepare("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 50").all() as any[]; } catch(e) {}

      if (ai) {
        const promptMsg = `Analyze for fraud indicators. Return JSON.
Orders: ${JSON.stringify(orderData.slice(0,20))}
Reviews: ${JSON.stringify(reviewData.slice(0,20))}
Users: ${JSON.stringify(userData.slice(0,20))}

Return: { "flaggedReviews": [{"reviewId":1,"reason":"Suspicious pattern","riskScore":85}], "refundAbuseCases": [{"orderId":1,"reason":"Multiple refunds","riskScore":70}], "couponMisuse": [{"code":"SUMMER50","usageCount":150,"expectedCount":20,"riskScore":90}], "suspiciousAccounts": [{"userId":1,"reason":"Created multiple accounts","riskScore":75}], "unusualPurchasingPatterns": [{"userId":1,"pattern":"Rapid bulk purchases","riskScore":65}], "overallFraudScore": 25, "recommendations": ["Review flagged accounts"] }`;

        const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: promptMsg, config: { responseMimeType: "application/json" } });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        res.json({
          flaggedReviews: reviewData.filter((r:any)=>r.rating===1||r.rating===5).slice(0,3).map((r:any)=>({reviewId:r.id,productId:r.product_id,rating:r.rating,reason:r.rating===1?"Extreme negative without detail":r.rating===5?"Suspicious perfect rating":"Unusual pattern",riskScore:r.rating===1?60:40})),
          refundAbuseCases: orderData.filter((o:any)=>o.status==='refunded').slice(0,3).map((o:any)=>({orderId:o.id,amount:o.total,reason:"Multiple refund requests",riskScore:70})),
          couponMisuse: [{code:"WELCOME20",usageCount:45,expectedCount:20,uniqueUsers:12,riskScore:85},{code:"SUMMER50",usageCount:120,expectedCount:30,uniqueUsers:8,riskScore:92}],
          suspiciousAccounts: userData.filter((u:any)=>u.role==='customer').slice(0,2).map((u:any)=>({userId:u.id,email:u.email,reason:"Recently created, no orders",riskScore:45,createdAt:u.created_at})),
          unusualPurchasingPatterns: [{userId:1,pattern:"Multiple purchases of same item in short period",riskScore:65,orderCount:5,timeWindow:"2 hours"}],
          overallFraudScore: 22,
          recommendations: ["Enable email verification for new accounts", "Set rate limits on coupon usage per user", "Review accounts with multiple cancelled orders"]
        });
      }
    } catch (e: any) { res.status(500).json({ error: "Fraud detection error", details: e.message }); }
  });

  // Phase 8 - AI Pricing Engine
  app.post("/api/gemini/pricing-engine", async (req, res) => {
    try {
      const { productId, products } = req.body;
      let productData: any[] = [];
      try { productData = db.prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id").all() as any[]; } catch(e) {}
      let orderData: any[] = [];
      try { orderData = db.prepare("SELECT oi.product_id, SUM(oi.quantity) as total_sold, AVG(oi.price) as avg_sale_price FROM order_items oi GROUP BY oi.product_id").all() as any[]; } catch(e) {}

      if (ai) {
        const promptMsg = `As a pricing strategist, analyze this product catalog and recommend optimal prices. Return JSON.
Products: ${JSON.stringify(productData.slice(0,20))}
Sales: ${JSON.stringify(orderData.slice(0,20))}

Return: { "pricingRecommendations": [{"productId":1,"name":"...","currentPrice":99,"suggestedPrice":89,"minPrice":79,"maxPrice":109,"reasoning":"...","expectedDemandIncrease":"+20%","elasticity":1.5,"competitorPrice":95}], "seasonalAdjustments": [{"season":"Christmas","multiplier":1.15}], "bundleSuggestions": [{"products":[1,2],"bundlePrice":149,"savings":25}] }`;

        const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: promptMsg, config: { responseMimeType: "application/json" } });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        res.json({
          pricingRecommendations: productData.slice(0,5).map(p => ({
            productId: p.id, name: p.name, currentPrice: p.price, suggestedPrice: Math.round(p.price * (p.stock > 50 ? 0.85 : p.stock < 10 ? 1.1 : 0.95) * 100) / 100,
            minPrice: Math.round(p.price * 0.75), maxPrice: Math.round(p.price * 1.2),
            reasoning: p.stock > 50 ? "High inventory - consider discount to clear stock" : p.stock < 10 ? "Low stock - slight increase to maximize margin" : "Balanced pricing for current demand",
            expectedDemandIncrease: p.stock > 50 ? "+25%" : "+10%", elasticity: 1.4, competitorPrice: Math.round(p.price * (0.9 + Math.random() * 0.2))
          })),
          seasonalAdjustments: [{season:"New Year",multiplier:1.1,startDate:"2026-01-01",endDate:"2026-01-15"},{season:"Summer Sale",multiplier:0.85,startDate:"2026-06-01",endDate:"2026-06-30"},{season:"Black Friday",multiplier:0.75,startDate:"2026-11-25",endDate:"2026-11-29"},{season:"Christmas",multiplier:1.15,startDate:"2026-12-15",endDate:"2026-12-25"}],
          bundleSuggestions: productData.length >= 2 ? [{products:[productData[0].id,productData[1].id],productNames:[productData[0].name,productData[1].name],bundlePrice:Math.round((productData[0].price+productData[1].price)*0.8),savings:Math.round((productData[0].price+productData[1].price)*0.2)}] : [],
          marginAnalysis: productData.map(p => ({productId:p.id,name:p.name,currentMargin:35,targetMargin:40,priceHeadroom:Math.round(p.price*0.15)}))
        });
      }
    } catch (e: any) { res.status(500).json({ error: "Pricing engine error", details: e.message }); }
  });

  // Phase 9 - Autonomous SEO
  app.post("/api/gemini/autonomous-seo", async (req, res) => {
    try {
      const { product } = req.body;
      if (!product || !product.name) return res.status(400).json({ error: "Product data required" });

      if (ai) {
        const promptMsg = `Generate comprehensive SEO content for this product. Return JSON.
Product: ${JSON.stringify(product)}

Return: { "seoTitle": "...", "seoDescription": "...", "metaKeywords": [...], "faqs": [{"question":"...","answer":"..."}], "schemaMarkup": {"@context":"https://schema.org","@type":"Product","name":"...","description":"...","offers":{"@type":"Offer","price":"...","priceCurrency":"USD"}}, "blogPost": {"title":"...","excerpt":"...","body":"...","tags":[...]}, "internalLinks": [{"anchor":"...","url":"/products/..."}], "imageAltText": "..." }`;

        const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: promptMsg, config: { responseMimeType: "application/json" } });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        const n = product.name;
        res.json({
          seoTitle: `${n} - Best Price & Quality Online`,
          seoDescription: `Shop the best ${n} at unbeatable prices. Premium quality, fast shipping, and excellent customer service. Buy now!`,
          metaKeywords: [n.toLowerCase(), product.category||'ecommerce', 'best price', 'buy online', 'premium quality'],
          faqs: [
            {question:`What makes ${n} special?`,answer:`${n} stands out for its exceptional quality, durability, and value. Perfect for ${product.category||'general'} use.`},
            {question:`What is the warranty on ${n}?`,answer:`Comes with standard manufacturer warranty. Check product page for specific warranty terms.`},
            {question:`How to care for ${n}?`,answer:`Follow the included care instructions for best results and longevity.`}
          ],
          schemaMarkup: {"@context":"https://schema.org","@type":"Product","name":n,"description":product.description||"","offers":{"@type":"Offer","price":String(product.price||0),"priceCurrency":"USD","availability":"https://schema.org/InStock"},"brand":product.brand||"NovaCart"},
          blogPost: {title:`Why ${n} is a Must-Have in ${new Date().getFullYear()}`,excerpt:`Discover why ${n} is trending this year.`,body:`<h2>Introduction</h2><p>${n} is taking the market by storm. Here's why you need one.</p><h2>Key Features</h2><p>Premium build quality, exceptional performance, and great value.</p><h2>Conclusion</h2><p>Don't miss out on ${n}. Order yours today!</p>`,tags:[n.toLowerCase(),"product review","buying guide",product.category||"ecommerce"]},
          internalLinks: [{anchor:`Best ${product.category||'Products'}`,url:`/category/${(product.category||'general').toLowerCase()}`},{anchor:"Shop Now",url:"/products"}],
          imageAltText: `${n} - Premium ${product.category||'Product'} for Sale`
        });
      }
    } catch (e: any) { res.status(500).json({ error: "Autonomous SEO error", details: e.message }); }
  });

  // Phase 10 - AI Support Agent
  app.post("/api/gemini/support-agent", async (req, res) => {
    try {
      const { message, orderId, action, userId } = req.body;
      if (!message) return res.status(400).json({ error: "Message required" });

      let orderInfo = "";
      if (orderId) {
        try {
          const order = db.prepare("SELECT o.*, u.name as customer_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?").get(orderId) as any;
          if (order) orderInfo = `Order #${order.id}: ${order.status}, $${order.total}, by ${order.customer_name}, ${order.created_at}`;
        } catch(e) {}
      }

      let trackingInfo = "";
      try {
        const shipment = db.prepare("SELECT s.*, o.id as order_id FROM shipments s JOIN orders o ON s.order_id = o.id WHERE o.id = ?").get(orderId||0) as any;
        if (shipment) trackingInfo = `Shipment: ${shipment.carrier}, tracking: ${shipment.tracking_number||'N/A'}, status: ${shipment.status}`;
      } catch(e) {}

      if (ai) {
        const promptMsg = `You are an AI support agent. Handle the customer inquiry professionally.

Order info: ${orderInfo||'N/A'}
Tracking info: ${trackingInfo||'N/A'}
Action requested: ${action||'general'}
Customer message: ${message}

Return JSON: { "response": "helpful reply", "actionTaken": "described action", "needsEscalation": false, "escalationReason": "", "suggestedReplacement": {"productId":1,"name":"","reason":""} }`;

        const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: promptMsg, config: { responseMimeType: "application/json" } });
        try { res.json(JSON.parse(response.text.trim())); }
        catch { const m = response.text.match(/\{[\s\S]*\}/); if(m) res.json(JSON.parse(m[0])); else throw new Error("Parse failed"); }
      } else {
        const lower = message.toLowerCase();
        let response = "", needsEscalation = false, escalationReason = "";
        if (lower.includes("return") || lower.includes("refund")) { response = "I understand you want to return an item. Please provide your order number and I'll initiate the return process."; needsEscalation = true; escalationReason = "Return request requires manual review"; }
        else if (lower.includes("track") || lower.includes("ship") || lower.includes("delivery")) { response = orderInfo ? `Your order #${orderId||'N/A'} is being processed. ${trackingInfo||'Tracking details will be available soon.'}` : "Please provide your order number for tracking information."; }
        else if (lower.includes("replace") || lower.includes("damage")) { response = "I'm sorry about the issue. Let me help you with a replacement. Please share your order number and a photo of the damaged item."; needsEscalation = true; escalationReason = "Replacement request"; }
        else if (lower.includes("cancel")) { response = orderId ? `I can help cancel order #${orderId}. Please confirm you want to proceed with cancellation.` : "Please provide your order number to process a cancellation."; }
        else { response = "I'm here to help! Ask me about order status, returns, replacements, or tracking."; }

        res.json({ response, actionTaken: action||'general', needsEscalation, escalationReason, suggestedReplacement: null });
      }
    } catch (e: any) { res.status(500).json({ error: "Support agent error", details: e.message }); }
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

export default app;

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
