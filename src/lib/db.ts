import Database from "better-sqlite3";
import path from "path";

const db = new Database("nexus.db");

// Initialize Database
export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT
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
      vendor_id INTEGER DEFAULT 1,
      is_featured BOOLEAN DEFAULT 0,
      weight REAL,
      length REAL,
      width REAL,
      height REAL,
      tax_status TEXT DEFAULT 'taxable',
      tax_class TEXT DEFAULT 'standard',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'customer',
      is_wholesale BOOLEAN DEFAULT 0,
      loyalty_balance INTEGER DEFAULT 0,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER DEFAULT 1,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS vendor_settings (
      vendor_id INTEGER PRIMARY KEY,
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
      disable_purchase_off_time BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      discount_code TEXT,
      discount_value REAL,
      discount_type TEXT,
      image TEXT,
      active BOOLEAN DEFAULT 1,
      usage_count INTEGER DEFAULT 0,
      start_date DATETIME,
      end_date DATETIME,
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

    CREATE TABLE IF NOT EXISTS vendor_shipping_methods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER,
      name TEXT NOT NULL,
      rate REAL DEFAULT 0,
      min_order_value REAL DEFAULT 0,
      estimated_days TEXT,
      FOREIGN KEY (vendor_id) REFERENCES vendor_settings(vendor_id)
    );
  `);

  // Migration logic for existing tables
  const tables = ['products', 'users', 'vendor_settings'];
  for (const table of tables) {
    const tableInfo = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
    const columns = tableInfo.map(c => c.name);
    
    let requiredColumns: any[] = [];
    if (table === 'products') {
      requiredColumns = [
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
        { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
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
      ];
    } else if (table === 'users') {
      requiredColumns = [
        { name: 'loyalty_balance', type: 'INTEGER DEFAULT 0' },
        { name: 'avatar', type: 'TEXT' }
      ];
    } else if (table === 'vendor_settings') {
      requiredColumns = [
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
      ];
    }

    for (const col of requiredColumns) {
      if (!columns.includes(col.name)) {
        try {
          db.exec(`ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type}`);
        } catch (e) {
          console.error(`Failed to add column ${col.name} to ${table}:`, e);
        }
      }
    }
  }

  // Seed data if empty
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
  }

  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    db.prepare("INSERT INTO users (email, password, name, role) VALUES ('vendor@nexus.com', 'password', 'Nexus Vendor', 'vendor')").run();
    db.prepare("INSERT INTO users (email, password, name, role) VALUES ('admin@nexus.com', 'admin123', 'System Admin', 'admin')").run();
    db.prepare("INSERT INTO users (email, password, name, role) VALUES ('super@nexus.com', 'super123', 'Super Admin', 'super_admin')").run();
  }

  const vendorSettingsCount = db.prepare("SELECT COUNT(*) as count FROM vendor_settings").get() as { count: number };
  if (vendorSettingsCount.count === 0) {
    db.prepare("INSERT INTO vendor_settings (vendor_id, store_name, store_email) VALUES (1, 'Nexus Global Store', 'vendor@nexus.com')").run();
  }
};

export default db;
