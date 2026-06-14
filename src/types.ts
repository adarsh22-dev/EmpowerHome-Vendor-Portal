export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  wholesale_price?: number;
  min_wholesale_qty?: number;
  image: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  stock: number;
  stock_status: string;
  vendor_id: number;
  is_featured?: boolean;
  active?: boolean;
  weight?: number;
  dimensions?: { l: number, w: number, h: number };
  tax_status?: string;
  tax_class?: string;
  created_at: string;
  is_exchangeable?: boolean;
  exchange_value_max?: number;
  brand?: string;
  model_name?: string;
  images?: ProductImage[];
  specs?: ProductSpec[];
  videos?: ProductVideo[];
  // New Fields
  policies?: {
    shipping: string;
    refund: string;
    cancellation: string;
  };
  seo?: {
    title: string;
    description: string;
    keywords: string;
  };
  upsell_ids?: number[];
  cross_sell_ids?: number[];
  upsells?: Product[];
  crossSells?: Product[];
  wholesale_tiers?: WholesaleTier[];
  extra_attributes?: { label: string, value: string }[];
  tax?: {
    status: string;
    class: string;
  };
  shipping_details?: {
    weight: number;
    dimensions: { l: number, w: number, h: number };
    class: string;
  };
  vendor_tags?: string[];
  manufacturer_images?: string[];
  manufacturer_videos?: string[];
  origin?: string;
  fragile?: boolean;
  material?: string;
  warranty?: string;
  technical_details?: { label: string, value: string }[];
  additional_details?: string;
  rotation_360_images?: string[];
  variations?: ProductVariation[];
  attributes?: ProductAttribute[];
  exchange_details?: {
    enabled: boolean;
    base_price: number;
    conditions: { name: string, price_modifier: number }[];
  };
}

export interface ProductVariation {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: { name: string, value: string }[];
}

export interface ProductAttribute {
  id: number;
  name: string;
  values: string[];
}

export interface ExchangeSettings {
  enable_exchange: boolean;
  primary_color: string;
  button_text: string;
  currency_symbol: string;
  max_exchange_percentage: number;
  pincode_validation: boolean;
  imei_mandatory: boolean;
  enable_logging: boolean;
  custom_css: string;
}

export interface ExchangeCategory {
  id: number;
  name: string;
  slug: string;
  image?: string;
  active: boolean;
}

export interface ExchangeDevice {
  id: number;
  category_id: number;
  brand: string;
  model: string;
  base_price: number;
  active: boolean;
}

export interface ExchangePincode {
  id: number;
  pincode: string;
  active: boolean;
}

export interface ProductSpec {
  id: number;
  product_id: number;
  label: string;
  value: string;
}

export interface ProductVideo {
  id: number;
  product_id: number;
  url: string;
  title?: string;
  thumbnail?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  type: 'gallery' | '360';
  sort_order: number;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed';
  amount: number;
  expiry_date: string;
  usage_limit: number;
  active: boolean;
}

export interface WholesaleTier {
  id: number;
  product_id: number;
  min_quantity: number;
  max_quantity?: number;
  price: number;
}

export interface ShippingMethod {
  id: number;
  vendor_id: number;
  name: string;
  rate: number;
  min_order_value: number;
  estimated_days: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'vendor' | 'wholesaler' | 'admin' | 'super_admin';
  is_wholesale: boolean;
  loyalty_balance?: number;
  avatar?: string;
}

export interface VendorSettings {
  vendor_id: number;
  store_name: string;
  store_slug: string;
  store_email: string;
  phone: string;
  address: string;
  street?: string;
  street_2?: string;
  city?: string;
  zip?: string;
  country?: string;
  store_logo: string;
  banner_type: 'static' | 'video';
  store_banner: string;
  mobile_banner: string;
  list_banner_type: 'static' | 'video';
  list_banner: string;
  shop_description: string;
  name_position: 'header' | 'banner';
  products_per_page: number;
  hide_email: boolean;
  hide_phone: boolean;
  hide_address: boolean;
  hide_map: boolean;
  hide_about: boolean;
  hide_policy: boolean;
  policy_return: string;
  policy_shipping: string;
  policy_tab_label?: string;
  policy_refund?: string;
  policy_cancellation?: string;
  location_lat?: number;
  location_lng?: number;
  payment_details?: string;
  preferred_payment?: string;
  enable_shipping?: boolean;
  processing_time?: string;
  shipping_type?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  fb_title?: string;
  fb_description?: string;
  fb_image?: string;
  customer_support_email?: string;
  customer_support_phone?: string;
  support_address?: string;
  support_country?: string;
  support_city?: string;
  store_hours?: string;
  enable_store_hours?: boolean;
  disable_purchase_off_time?: boolean;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  discount_code: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
}

export interface VendorStats {
  revenue: number;
  orders: number;
  products: number;
}
