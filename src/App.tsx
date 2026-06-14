import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  LayoutDashboard,
  Package,
  ClipboardList,
  Settings,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  ShoppingCart,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Heart,
  Bell,
  Globe,
  BarChart2,
  Tag,
  Zap,
  CreditCard,
  Layers,
  Users,
  Store,
  MousePointer2,
  Info,
  Factory,
  Maximize2,
  TrendingUp,
  DollarSign,
  Camera
} from 'lucide-react';
import { Category, Product, CartItem, Order, VendorStats, Promotion, ShippingMethod, WholesaleTier, User } from './types';
import AdminDashboard from './components/AdminDashboard';
import MegaMenu from './components/MegaMenu';
import PromotionsDiscounts from './components/PromotionsDiscounts';
import CreatePromotion from './pages/vendor/CreatePromotion';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorNotifications from './pages/vendor/VendorNotifications';
import VendorAnalytics from './pages/vendor/VendorAnalytics';
import VendorShipping from './pages/vendor/VendorShipping';
import VendorPromotions from './pages/vendor/VendorPromotions';
import VendorPayouts from './pages/vendor/VendorPayouts';
import VendorEnquiries from './pages/vendor/VendorEnquiries';
import VendorVariations from './pages/vendor/VendorVariations';
import VendorStaffManager from './pages/vendor/VendorStaffManager';
import VendorGuide from './pages/vendor/VendorGuide';
import VendorSettings from './pages/vendor/VendorSettings';
import VendorCustomers from './pages/vendor/VendorCustomers';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import WholesalerDashboard from './pages/wholesaler/WholesalerDashboard';
import WholesalerAuthPage from './pages/wholesaler/WholesalerAuthPage';
import ChatBot from './components/ChatBot';
import { BlogPage, BlogPostPage } from './components/Blog';
import VendorCopilot from './components/VendorCopilot';
import VisualSearch from './components/VisualSearch';
import ReviewAnalysis from './components/ReviewAnalysis';
import PredictiveAnalytics from './components/PredictiveAnalytics';
import FraudDetection from './components/FraudDetection';
import PricingEngine from './components/PricingEngine';
import AutonomousSEO from './components/AutonomousSEO';
import SupportAgent from './components/SupportAgent';
import ExpressCheckout from './components/ExpressCheckout';
import RelatedProducts from './components/RelatedProducts';
import InstagramFeed from './components/InstagramFeed';
import FaqSection from './components/FaqSection';

// --- Context ---
const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, q: number) => void;
  clearCart: () => void;
  total: number;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0
});

// --- Components ---

const Navbar = ({ onNavigate, view, cartCount, user, onLogout }: { onNavigate: (v: string, id?: number) => void, view: string, cartCount: number, user: User | null, onLogout: () => void }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="px-4 sm:px-6 py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden hover:bg-black/5 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button onClick={() => onNavigate('home')} className="text-xl sm:text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">N</div>
            <span className="hidden xs:inline">NEXUS</span>
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-black/60">
            <button onClick={() => onNavigate('products')} className="hover:text-black transition-colors">Shop All</button>
            <button className="hover:text-black transition-colors">Categories</button>
            {!user && (
              <>
                <button onClick={() => onNavigate('vendor-auth')} className="hover:text-black transition-colors flex items-center gap-2">
                  <Store className="w-4 h-4" /> Sell on Nexus
                </button>
                <button onClick={() => onNavigate('wholesaler-auth')} className="hover:text-black transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" /> Wholesale
                </button>
              </>
            )}
            {user?.role === 'vendor' && (
              <button onClick={() => onNavigate('vendor')} className="hover:text-black transition-colors">Vendor Portal</button>
            )}
            {user?.role === 'customer' && (
              <button onClick={() => onNavigate('customer-dashboard')} className="hover:text-black transition-colors">My Dashboard</button>
            )}
            {user?.role === 'wholesaler' && (
              <button onClick={() => onNavigate('wholesaler-dashboard')} className="hover:text-black transition-colors">Wholesale Portal</button>
            )}
            {user?.role === 'admin' && (
              <button onClick={() => onNavigate('admin')} className="hover:text-black transition-colors font-bold text-black">Admin Panel</button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-black/5 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10 w-64"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full text-[10px] font-bold">
            <Globe className="w-3 h-3" />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          
          <button onClick={() => onNavigate('cart')} className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={() => onNavigate('wishlist')} className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
            <Heart className="w-5 h-5" />
          </button>

          <button className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4 ml-1 sm:ml-2">
              <button onClick={() => onNavigate('profile')} className="flex flex-col items-end hidden md:flex hover:opacity-80 transition-opacity">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 leading-none mb-1">{user.role}</span>
                <span className="text-xs font-bold leading-none">{user.name}</span>
              </button>
              <button onClick={onLogout} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={() => onNavigate('auth')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <UserIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-black/5 mt-4"
          >
            <div className="flex flex-col gap-4 py-6 px-4">
              <button onClick={() => { onNavigate('products'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-lg">Shop All</button>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-left font-bold text-lg">Categories</button>
              <div className="h-px bg-black/5 my-2" />
              {!user && (
                <div className="flex flex-col gap-4">
                  <button onClick={() => { onNavigate('vendor-auth'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-medium">
                    <Store className="w-5 h-5" /> Sell on Nexus
                  </button>
                  <button onClick={() => { onNavigate('wholesaler-auth'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-medium">
                    <Users className="w-5 h-5" /> Wholesale
                  </button>
                </div>
              )}
              {user?.role === 'vendor' && (
                <button onClick={() => { onNavigate('vendor'); setIsMobileMenuOpen(false); }} className="text-left font-medium">Vendor Portal</button>
              )}
              {user?.role === 'customer' && (
                <button onClick={() => { onNavigate('customer-dashboard'); setIsMobileMenuOpen(false); }} className="text-left font-medium">My Dashboard</button>
              )}
              {user?.role === 'wholesaler' && (
                <button onClick={() => { onNavigate('wholesaler-dashboard'); setIsMobileMenuOpen(false); }} className="text-left font-medium">Wholesale Portal</button>
              )}
              {user?.role === 'admin' && (
                <button onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-orange-600">Admin Panel</button>
              )}
              <div className="h-px bg-black/5 my-2" />
              <div className="flex items-center gap-4 px-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full text-[10px] font-bold">
                  <Globe className="w-3 h-3" />
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <button onClick={() => { onNavigate('wishlist'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm font-bold">
                  <Heart className="w-4 h-4" /> Wishlist
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProductCard: React.FC<{ product: Product, onNavigate: (v: string, id?: number) => void, onAddToCart: (p: Product) => void, isWishlisted?: boolean, onToggleWishlist?: (p: Product) => void, isCompared?: boolean, onToggleCompare?: (p: Product) => void }> = ({ product, onNavigate, onAddToCart, isWishlisted, onToggleWishlist, isCompared, onToggleCompare }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-black/5 mb-3 sm:mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {product.wholesale_price && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 h-3" /> WHOLESALE
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-1.5 sm:gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
            className={`p-1.5 sm:p-2 rounded-full shadow-sm transition-all duration-300 ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-black/40 hover:text-rose-500'}`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare?.(product);
            }}
            className={`p-1.5 sm:p-2 rounded-full shadow-sm transition-all duration-300 ${isCompared ? 'bg-black text-white' : 'bg-white text-black/40 hover:text-black'}`}
            title="Compare Product"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('product-detail', product.id);
            }}
            className="p-1.5 sm:p-2 rounded-full bg-white text-black/40 hover:text-orange-600 shadow-sm transition-all duration-300"
            title="360° View"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white text-black p-2 sm:p-3 rounded-full shadow-lg sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <div onClick={() => onNavigate('product-detail', product.id)}>
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <p className="text-[8px] sm:text-[10px] font-bold text-black/40 uppercase tracking-widest">{product.category_name || 'General'}</p>
          {product.brand && <p className="text-[8px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest">{product.brand}</p>}
        </div>
        <h3 className="font-bold text-sm sm:text-lg leading-tight mb-0.5 sm:mb-1 group-hover:text-black transition-colors line-clamp-2">{product.name}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="font-bold text-base sm:text-xl">${(product.price ?? 0).toFixed(2)}</p>
            {product.wholesale_price && (
              <p className="text-emerald-600 font-bold text-[10px] sm:text-sm">Wholesale: ${(product.wholesale_price ?? 0).toFixed(2)}</p>
            )}
          </div>
          <span className={`w-fit text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const ProductSection = ({ title, subtitle, products, onNavigate, onAddToCart, wishlist, onToggleWishlist, compareList, onToggleCompare }: { title: string, subtitle: string, products: Product[], onNavigate: (v: string, id?: number) => void, onAddToCart: (p: Product) => void, wishlist: Product[], onToggleWishlist: (p: Product) => void, compareList: Product[], onToggleCompare: (p: Product) => void }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-4 sm:gap-0">
      <div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm sm:text-base text-black/50">{subtitle}</p>
      </div>
      <button onClick={() => onNavigate('products')} className="w-fit text-sm font-bold underline underline-offset-4 hover:text-black/70 transition-colors">Shop All</button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
      {products.map((p) => (
        <ProductCard 
          key={p.id} 
          product={p} 
          onNavigate={onNavigate} 
          onAddToCart={onAddToCart}
          isWishlisted={wishlist.some(item => item.id === p.id)}
          onToggleWishlist={onToggleWishlist}
          isCompared={compareList.some(item => item.id === p.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  </section>
);

const CompareBar = ({ compareList, onRemove, onClear, onOpen }: { compareList: Product[], onRemove: (p: Product) => void, onClear: () => void, onOpen: () => void }) => {
  if (compareList.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 flex items-center justify-between px-10 border-t border-white/10"
    >
      <div className="flex items-center gap-6">
        <div className="flex -space-x-3">
          {compareList.map(p => (
            <div key={p.id} className="relative group">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full border-2 border-black object-cover" referrerPolicy="no-referrer" />
              <button 
                onClick={() => onRemove(p)}
                className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div>
          <p className="font-bold">{compareList.length} Products Selected</p>
          <p className="text-xs text-white/50">Select up to 4 products to compare</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onClear} className="text-sm font-bold hover:text-white/70">Clear All</button>
        <button 
          onClick={onOpen}
          disabled={compareList.length < 2}
          className={`px-8 py-3 rounded-full font-bold transition-all ${compareList.length >= 2 ? 'bg-white text-black hover:bg-white/90' : 'bg-white/20 text-white/40 cursor-not-allowed'}`}
        >
          Compare Now
        </button>
      </div>
    </motion.div>
  );
};

const CompareModal = ({ compareList, onClose }: { compareList: Product[], onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-8 border-b flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Product Comparison</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-x-auto p-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left border-b bg-black/5 w-48">Feature</th>
                {compareList.map(p => (
                  <th key={p.id} className="p-4 border-b min-w-[250px]">
                    <div className="flex flex-col items-center text-center">
                      <img src={p.image} alt={p.name} className="w-32 h-32 object-cover rounded-xl mb-4" referrerPolicy="no-referrer" />
                      <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                      <p className="text-2xl font-bold">${(p.price ?? 0).toFixed(2)}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="p-4 font-bold border-b bg-black/5">Category</td>
                {compareList.map(p => <td key={p.id} className="p-4 border-b text-center">{p.category_name}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-bold border-b bg-black/5">Brand</td>
                {compareList.map(p => <td key={p.id} className="p-4 border-b text-center">{p.brand || 'Nexus'}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-bold border-b bg-black/5">Stock Status</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 border-b text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold border-b bg-black/5">Wholesale Price</td>
                {compareList.map(p => <td key={p.id} className="p-4 border-b text-center text-emerald-600 font-bold">{p.wholesale_price ? `$${p.wholesale_price.toFixed(2)}` : 'N/A'}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-bold border-b bg-black/5">Min Wholesale Qty</td>
                {compareList.map(p => <td key={p.id} className="p-4 border-b text-center">{p.min_wholesale_qty || 'N/A'}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-bold border-b bg-black/5">Description</td>
                {compareList.map(p => <td key={p.id} className="p-4 border-b text-center text-black/60 leading-relaxed">{p.short_description || p.description}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = ({ onNavigate, products, categories, onAddToCart, wishlist, onToggleWishlist, compareList, onToggleCompare }: { onNavigate: (v: string, id?: number) => void, products: Product[], categories: Category[], onAddToCart: (p: Product) => void, wishlist: Product[], onToggleWishlist: (p: Product) => void, compareList: Product[], onToggleCompare: (p: Product) => void }) => {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const ensureFour = (arr: Product[]): Product[] => {
    let result = [...arr];
    
    // If we have at least 4 items, take exactly 4
    if (result.length >= 4) {
      return result.slice(0, 4);
    }
    
    // If we have fewer than 4, fill with any other products from the all-products pool
    for (const p of products) {
      if (result.length >= 4) break;
      if (!result.some(item => item.id === p.id)) {
        result.push(p);
      }
    }
    
    // If we STILL have fewer than 4 (the total product list is extremely small), duplicate with unique IDs
    let index = 0;
    while (result.length < 4 && result.length > 0) {
      const cloneTarget = result[index % result.length];
      result.push({
        ...cloneTarget,
        id: cloneTarget.id * 1000 + result.length, // Ensure unique React list key
      });
      index++;
    }
    
    // If the database has absolutely zero products, use gorgeous default e-commerce fallback products
    if (result.length === 0) {
      return [
        {
          id: 9901,
          name: "Pro Wireless Noise-Cancelling Headphones",
          sku: "WH-MOCK-01",
          description: "High-fidelity audio with active noise cancellation and 40 hour battery life.",
          short_description: "Premium acoustic performance and ultimate comfort.",
          price: 299.99,
          image: "https://picsum.photos/seed/headphones/600/600",
          stock: 50,
          stock_status: "instock",
          vendor_id: 1,
          created_at: new Date().toISOString(),
          is_featured: true,
          brand: "Nova",
          model_name: "Pro-WH",
          category_id: 1,
          category_name: "Electronics"
        },
        {
          id: 9902,
          name: "Ultra Slim 14\" Lightweight Laptop",
          sku: "LP-MOCK-02",
          description: "Powerful octa-core processor, 16GB RAM, and lightning-fast solid state storage.",
          short_description: "Pro productivity anytime, anywhere.",
          price: 1199.99,
          image: "https://picsum.photos/seed/laptop/600/600",
          stock: 12,
          stock_status: "instock",
          vendor_id: 1,
          created_at: new Date().toISOString(),
          is_featured: true,
          brand: "Nova",
          model_name: "Slim-14",
          category_id: 1,
          category_name: "Electronics"
        },
        {
          id: 9903,
          name: "Smart Amoled Curved Fitness Watch",
          sku: "WT-MOCK-03",
          description: "Track all your workouts, heart rate, sleep metrics, and sync seamlessly with your device.",
          short_description: "Unparalleled fitness tracking with aesthetic design.",
          price: 199.50,
          image: "https://picsum.photos/seed/watch/600/600",
          stock: 85,
          stock_status: "instock",
          vendor_id: 1,
          created_at: new Date().toISOString(),
          is_featured: true,
          brand: "Nova",
          model_name: "FitCurve",
          category_id: 2,
          category_name: "Fashion"
        },
        {
          id: 9904,
          name: "Wireless Charging Multi-Device Dock",
          sku: "DK-MOCK-04",
          description: "Perfect organizing tool to charge your phone, watch, and earbuds at the same time rapidly.",
          short_description: "Sleek, minimalist charging station.",
          price: 49.99,
          image: "https://picsum.photos/seed/dock/600/600",
          stock: 120,
          stock_status: "instock",
          vendor_id: 1,
          created_at: new Date().toISOString(),
          is_featured: true,
          brand: "Nova",
          model_name: "MultiDock",
          category_id: 1,
          category_name: "Electronics"
        }
      ];
    }
    
    return result.slice(0, 4);
  };
  
  const featuredRaw = products.filter(p => p.is_featured);
  const featuredProducts = ensureFour(featuredRaw.length > 0 ? featuredRaw : products);
  
  const bestSellers = ensureFour(products);
  
  const newArrivalsRaw = products.length >= 8 
    ? products.slice(4, 8) 
    : products.length > 4 
      ? products.slice(4, products.length).concat(products.slice(0, 8 - products.length))
      : [...products].reverse();
  const newArrivals = ensureFour(newArrivalsRaw);
  
  const dealOfTheDayRaw = products.length >= 12 
    ? products.slice(8, 12) 
    : [...products].filter((_, i) => i % 2 === 0);
  const dealOfTheDay = ensureFour(dealOfTheDayRaw);
  
  const topSellingRaw = products.length >= 16 
    ? products.slice(12, 16) 
    : [...products].filter((_, i) => i % 2 !== 0);
  const topSelling = ensureFour(topSellingRaw);

  const slides = [
    {
      image: "https://picsum.photos/seed/hero1/1920/1080?blur=2",
      tag: "NEXUS MARKETPLACE • GLOBAL B2B & B2C",
      title: "THE FUTURE OF COMMERCE.",
      desc: "Direct from verified vendors. Wholesale pricing for businesses. Premium quality for everyone."
    },
    {
      image: "https://picsum.photos/seed/hero2/1920/1080?blur=2",
      tag: "EXCLUSIVE DEALS • LIMITED TIME",
      title: "PREMIUM TECH SELECTION.",
      desc: "Upgrade your lifestyle with our curated collection of high-end electronics and smart home devices."
    },
    {
      image: "https://picsum.photos/seed/hero3/1920/1080?blur=2",
      tag: "SUSTAINABLE LIVING • ECO-FRIENDLY",
      title: "GREEN ENERGY SOLUTIONS.",
      desc: "Discover the latest in solar technology and sustainable products for a better tomorrow."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    fetch('/api/promotions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPromos(data);
      })
      .catch(err => console.error("Failed to fetch promos", err));

    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data.slice(0, 3));
      })
      .catch(err => console.error("Failed to fetch blogs", err));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section Slider */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto relative h-[500px] sm:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img 
                src={slides[currentSlide].image} 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
                alt="Hero background"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-24 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 w-fit"
                >
                  {slides[currentSlide].tag}
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] sm:leading-none mb-4 sm:mb-6"
                >
                  {slides[currentSlide].title.split('.').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}{i < arr.length - 1 ? <br /> : ''}
                    </React.Fragment>
                  ))}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-base sm:text-xl max-w-xs sm:max-w-md mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-none"
                >
                  {slides[currentSlide].desc}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  <button 
                    onClick={() => onNavigate('products')}
                    className="bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    Explore Marketplace <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => onNavigate('auth')}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold hover:bg-white/20 transition-colors text-sm sm:text-base"
                  >
                    Become a Vendor
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-12 h-1 rounded-full transition-all ${currentSlide === i ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Guarantees / Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {[
            { icon: ShieldCheck, title: "Verified Vendors", desc: "100% authentic products from certified global suppliers." },
            { icon: Truck, title: "Global Shipping", desc: "Fast, reliable logistics to over 150 countries." },
            { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free 30-day return policy on all items." },
            { icon: ShoppingBag, title: "Wholesale Ready", desc: "Deep discounts for bulk orders and business accounts." },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-50 border border-black/5 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-black text-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <item.icon className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-black/40 text-[10px] sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <ProductSection 
        title="Featured Items" 
        subtitle="Handpicked by our curators for quality and value"
        products={featuredProducts}
        onNavigate={onNavigate}
        onAddToCart={onAddToCart}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        compareList={compareList}
        onToggleCompare={onToggleCompare}
      />

      {/* Promotions Slider (Simple) */}
      {promos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-12 flex flex-col md:flex-row items-center gap-8 sm:gap-12 border border-emerald-100">
            <div className="flex-1 space-y-4 sm:space-y-6 text-center md:text-left">
              <span className="inline-block bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">SPECIAL OFFER</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">{promos[0].title}</h2>
              <p className="text-emerald-900/60 text-base sm:text-lg">{promos[0].description}</p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-fit bg-white border-2 border-dashed border-emerald-200 px-6 py-3 rounded-xl font-mono font-bold text-emerald-700 text-center">
                  {promos[0].discount_code}
                </div>
                <button className="w-full sm:w-fit bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  Claim Discount
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <img src={promos[0].image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-4 sm:gap-0">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Top Categories</h2>
            <p className="text-sm sm:text-base text-black/50">Explore our most popular departments</p>
          </div>
          <button onClick={() => onNavigate('products')} className="w-fit text-sm font-bold underline underline-offset-4">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 4).map((cat) => (
            <div key={cat.id} className="group cursor-pointer" onClick={() => onNavigate('products')}>
              <div className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-black/5 mb-3 sm:mb-4 relative">
                <img src={cat.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">Shop Now</span>
                </div>
              </div>
              <h3 className="font-bold text-base sm:text-lg">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <ProductSection 
        title="Best Sellers" 
        subtitle="Our most popular products right now"
        products={bestSellers}
        onNavigate={onNavigate}
        onAddToCart={onAddToCart}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        compareList={compareList}
        onToggleCompare={onToggleCompare}
      />

      {/* New Arrivals */}
      <ProductSection 
        title="New Arrivals" 
        subtitle="Freshly added to our collection"
        products={newArrivals}
        onNavigate={onNavigate}
        onAddToCart={onAddToCart}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        compareList={compareList}
        onToggleCompare={onToggleCompare}
      />

      {/* Deal of the Day */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-zinc-900 rounded-2xl sm:rounded-[40px] p-6 sm:p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-zinc-900 to-transparent z-10" />
            <img src="https://picsum.photos/seed/deal/800/800" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-20 max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full">
              <Zap className="w-3 h-3 fill-current" /> DEAL OF THE DAY
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">FLASH SALE<br />IS LIVE.</h2>
            <p className="text-white/60 text-lg">Get up to 60% off on selected premium electronics. Limited time only.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <div className="flex gap-3 sm:gap-4">
                {['08', '12', '45'].map((num, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold bg-white/10 backdrop-blur-md border border-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-2">{num}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{['Hrs', 'Min', 'Sec'][i]}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate('products')} className="bg-white text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors text-sm sm:text-base whitespace-nowrap">Shop the Sale</button>
            </div>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <ProductSection 
        title="Top Selling" 
        subtitle="Items that everyone is talking about"
        products={topSelling}
        onNavigate={onNavigate}
        onAddToCart={onAddToCart}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        compareList={compareList}
        onToggleCompare={onToggleCompare}
      />

      {/* More to Explore */}
      <ProductSection 
        title="More to Explore" 
        subtitle="Discover something new today"
        products={dealOfTheDay}
        onNavigate={onNavigate}
        onAddToCart={onAddToCart}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        compareList={compareList}
        onToggleCompare={onToggleCompare}
      />

      {/* Wholesale Banner */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto bg-black text-white rounded-3xl p-6 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-12">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-6">Scale Your Business with Nexus Wholesale.</h2>
            <p className="text-white/60 text-lg mb-8">Access tiered pricing, dedicated account managers, and bulk logistics. Join 50,000+ businesses sourcing from Nexus.</p>
            <div className="flex gap-4">
              <button onClick={() => onNavigate('auth')} className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors">Apply for Wholesale</button>
              <button className="border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">View Pricing</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/10 p-6 rounded-2xl text-center">
              <p className="text-3xl font-bold">40%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Avg. Savings</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl text-center">
              <p className="text-3xl font-bold">24h</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Support Response</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl text-center">
              <p className="text-3xl font-bold">10k+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Suppliers</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl text-center">
              <p className="text-3xl font-bold">Free</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Logistics Audit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Latest Insights</h2>
              <p className="text-black/50">Trends, tips, and news from the Nexus community</p>
            </div>
            <button onClick={() => onNavigate('blog')} className="text-sm font-bold underline underline-offset-4">Read All Posts</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="group cursor-pointer"
                onClick={() => onNavigate('blog-post', blog.slug)}
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-zinc-100">
                  <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">{blog.category}</span>
                  <span className="w-1 h-1 rounded-full bg-black/10"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors">{blog.title}</h3>
                <p className="text-black/50 text-sm line-clamp-2">{blog.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <InstagramFeed />
      <FaqSection />
    </div>
  );
};

const VendorAuthPage = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gst, setGst] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, name, role: 'vendor', storeName, phone, address, gst };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) onLogin(data);
      else setError(data.error || 'Authentication failed');
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent z-10" />
        <img 
          src="https://picsum.photos/seed/vendor/1200/1200" 
          alt="Vendor Portal" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-20 text-white">
          <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xl mb-8">N</div>
          <h1 className="text-6xl font-bold tracking-tighter mb-6 leading-tight">Empower your business with Nexus.</h1>
          <p className="text-xl text-white/60 max-w-md leading-relaxed">Join thousands of successful vendors and reach millions of customers worldwide with our premium marketplace platform.</p>
          
          <div className="grid grid-cols-2 gap-8 mt-16">
            <div>
              <p className="text-3xl font-bold mb-1">0%</p>
              <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Listing Fees</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">24/7</p>
              <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Vendor Support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-2">{isLogin ? 'Vendor Login' : 'Become a Vendor'}</h2>
            <p className="text-black/50">{isLogin ? 'Access your vendor dashboard' : 'Start selling on Nexus today'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100">{error}</div>}
            
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-black/5 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-black/10 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Store Name</label>
                  <input 
                    type="text" 
                    required 
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full bg-black/5 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-black/10 transition-all"
                    placeholder="My Awesome Store"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-black/5 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-black/10 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">GST Number (Optional)</label>
                    <input 
                      type="text" 
                      value={gst}
                      onChange={e => setGst(e.target.value)}
                      className="w-full bg-black/5 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-black/10 transition-all"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Business Address</label>
                  <textarea 
                    required 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-black/5 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-black/10 transition-all min-h-[100px]"
                    placeholder="Full business address..."
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-black/10 transition-all"
                placeholder="vendor@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-black/10 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full bg-black text-white py-5 rounded-xl font-bold hover:bg-black/90 transition-all active:scale-[0.98]">
              {isLogin ? 'Sign In to Dashboard' : 'Create Vendor Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-black/50 mb-4">
              {isLogin ? "Don't have a vendor account?" : "Already have a vendor account?"}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-black font-bold hover:underline underline-offset-4"
            >
              {isLogin ? 'Register as Vendor' : 'Log In to Vendor Portal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductListPage = ({ onNavigate, products, categories, onAddToCart, wishlist, onToggleWishlist, compareList, onToggleCompare }: { onNavigate: (v: string, id?: number) => void, products: Product[], categories: Category[], onAddToCart: (p: Product) => void, wishlist: Product[], onToggleWishlist: (p: Product) => void, compareList: Product[], onToggleCompare: (p: Product) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category_name === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-6 sm:space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`whitespace-nowrap md:block w-fit md:w-full text-left px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${!selectedCategory ? 'bg-black text-white' : 'bg-black/5 md:bg-transparent hover:bg-black/5'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`whitespace-nowrap md:block w-fit md:w-full text-left px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${selectedCategory === cat.name ? 'bg-black text-white' : 'bg-black/5 md:bg-transparent hover:bg-black/5'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Price Range</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-black" />
              <div className="flex justify-between text-sm font-medium">
                <span>$0</span>
                <span>$2000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{selectedCategory || 'All Products'}</h1>
            <p className="text-black/50 font-medium">{filteredProducts.length} items found</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onNavigate={onNavigate} 
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.some(item => item.id === p.id)}
                  onToggleWishlist={onToggleWishlist}
                  isCompared={compareList.some(item => item.id === p.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

const ExchangeModal = ({ product, isOpen, onClose, onSubmit }: { product: Product, isOpen: boolean, onClose: () => void, onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    condition: 'Good',
    issues: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Exchange Your Device</h2>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Old Product Brand</label>
              <input 
                type="text" 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="e.g. Apple, Samsung, Sony"
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Old Product Model</label>
              <input 
                type="text" 
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                placeholder="e.g. iPhone 12, Galaxy S21"
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Condition</label>
              <select 
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
              >
                <option value="Excellent">Excellent (No scratches, like new)</option>
                <option value="Good">Good (Minor scratches, fully functional)</option>
                <option value="Fair">Fair (Visible scratches, fully functional)</option>
                <option value="Damaged">Damaged (Cracked screen or major issues)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Any Issues?</label>
              <textarea 
                value={formData.issues}
                onChange={(e) => setFormData({...formData, issues: e.target.value})}
                placeholder="Describe any functional or cosmetic issues..."
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
              />
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 mb-8">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Estimated Exchange Value</p>
            <p className="text-3xl font-bold text-emerald-900">Up to ${(product.exchange_value_max ?? 0).toFixed(2)}</p>
            <p className="text-[10px] text-emerald-700/60 mt-2">* Final value depends on physical verification.</p>
          </div>
          
          <button 
            onClick={() => onSubmit(formData)}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Submit Exchange Request
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const FullViewModal = ({ imageUrl, isOpen, onClose }: { imageUrl: string, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-10">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-full max-h-full flex items-center justify-center"
      >
        <img 
          src={imageUrl} 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
          referrerPolicy="no-referrer" 
        />
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          <Plus className="w-6 h-6 rotate-45" />
        </button>
      </motion.div>
    </div>
  );
};

const ProductDetailPage = ({ productId, onNavigate, onAddToCart, user, wishlist, onToggleWishlist, compareList, onToggleCompare, platformSettings }: { productId: number, onNavigate: (v: string, id?: number) => void, onAddToCart: (p: Product) => void, user: User | null, wishlist: Product[], onToggleWishlist: (p: Product) => void, compareList: Product[], onToggleCompare: (p: Product) => void, platformSettings?: any }) => {
  const [product, setProduct] = useState<Product & { upsells?: Product[], crossSells?: Product[] } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageTab, setActiveImageTab] = useState<'gallery' | '360' | 'video'>('gallery');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tiers, setTiers] = useState<WholesaleTier[]>([]);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeSubmitted, setExchangeSubmitted] = useState(false);
  const [showFullView, setShowFullView] = useState(false);
  const [showExpressCheckout, setShowExpressCheckout] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(async data => {
        let updatedProduct = { ...data };
        
        // Fallback for upsells if empty: show products from same category
        if ((!data.upsells || data.upsells.length === 0) && data.category_slug) {
          try {
            const res = await fetch(`/api/products?category=${data.category_slug}`);
            const products = await res.json();
            updatedProduct.upsells = products.filter((p: Product) => p.id !== data.id).slice(0, 4);
          } catch (e) {
            console.error("Failed to fetch fallback upsells", e);
          }
        }
        
        // Fallback for crossSells if empty: show featured products
        if (!data.crossSells || data.crossSells.length === 0) {
          try {
            const res = await fetch('/api/products');
            const products = await res.json();
            updatedProduct.crossSells = products.filter((p: Product) => p.is_featured && p.id !== data.id).slice(0, 4);
          } catch (e) {
            console.error("Failed to fetch fallback cross-sells", e);
          }
        }

        setProduct(updatedProduct);
        setSelectedImage(data.image);
      });
    fetch(`/api/products/${productId}/tiers`)
      .then(res => res.json())
      .then(setTiers);
  }, [productId]);

  if (!product) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const isWishlisted = wishlist.some(p => p.id === product.id);
  const isCompared = compareList.some(p => p.id === product.id);

  const galleryImages = product.images?.filter(img => img.type === 'gallery') || [];
  const threeSixtyImages = [
    ...(product.images?.filter(img => img.type === '360') || []).map(img => img.url),
    ...(product.rotation_360_images || [])
  ];
  const videos = product.videos || [];

  const handleExchangeSubmit = async (data: any) => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    try {
      const response = await fetch('/api/exchanges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product?.id,
          old_product_details: data,
          estimated_value: product?.exchange_value_max
        })
      });

      if (response.ok) {
        setExchangeSubmitted(true);
        setShowExchangeModal(false);
      }
    } catch (error) {
      console.error("Failed to submit exchange", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <AnimatePresence>
        {showExchangeModal && product && (
          <ExchangeModal 
            product={product} 
            isOpen={showExchangeModal} 
            onClose={() => setShowExchangeModal(false)} 
            onSubmit={handleExchangeSubmit} 
          />
        )}
        {showFullView && (
          <FullViewModal 
            imageUrl={selectedImage || product.image} 
            isOpen={showFullView} 
            onClose={() => setShowFullView(false)} 
          />
        )}
        {showExpressCheckout && product && (
          <ExpressCheckout
            product={{ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock }}
            onClose={() => setShowExpressCheckout(false)}
            onSuccess={(orderId) => {
              setShowExpressCheckout(false);
              onNavigate('confirmation');
            }}
            user={user}
          />
        )}
      </AnimatePresence>
      <button onClick={() => onNavigate('products')} className="flex items-center gap-2 text-sm font-bold mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 mb-12 sm:mb-20">
        <div className="space-y-4 sm:space-y-6">
          <div 
            className="rounded-2xl sm:rounded-3xl overflow-hidden bg-black/5 aspect-square relative group cursor-zoom-in"
            onMouseMove={(e) => {
              const target = e.currentTarget;
              const img = target.querySelector('img');
              if (img && activeImageTab === 'gallery') {
                const rect = target.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                img.style.transformOrigin = `${x}% ${y}%`;
                img.style.transform = 'scale(2)';
              }
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) {
                img.style.transform = 'scale(1)';
              }
            }}
          >
            {activeImageTab === 'gallery' && (
              <>
                <img src={selectedImage || product.image} className="w-full h-full object-cover transition-transform duration-200 ease-out" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setShowFullView(true)}
                  className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/80 backdrop-blur-md text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Maximize2 className="w-3 h-3" /> Click to see full view
                </button>
              </>
            )}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 sm:gap-3">
              <button 
                onClick={() => onToggleWishlist(product)}
                className={`p-3 sm:p-4 rounded-full shadow-xl transition-all ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-black hover:text-rose-500'}`}
              >
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => onToggleCompare(product)}
                className={`p-3 sm:p-4 rounded-full shadow-xl transition-all ${isCompared ? 'bg-black text-white' : 'bg-white text-black hover:text-black'}`}
              >
                <Layers className={`w-5 h-5 sm:w-6 sm:h-6`} />
              </button>
            </div>
            {activeImageTab === '360' && (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center">
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {threeSixtyImages.length > 0 ? (
                    <img 
                      src={threeSixtyImages[0]} 
                      className="max-w-full max-h-full object-contain animate-pulse" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <RotateCcw className="w-12 h-12 mb-4 animate-spin-slow text-black/20" />
                      <p className="font-bold text-xl text-black">Interactive 360° View</p>
                      <p className="text-sm text-black/40">Drag to rotate the product and see every detail.</p>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <MousePointer2 className="w-3 h-3" /> Drag to Rotate
                </div>
              </div>
            )}
            {activeImageTab === 'video' && videos.length > 0 && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <iframe 
                  src={videos[0].url} 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => {
                setActiveImageTab('gallery');
                setSelectedImage(product.image);
              }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageTab === 'gallery' && selectedImage === product.image ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
            {galleryImages.map((img) => (
              <button 
                key={img.id}
                onClick={() => {
                  setActiveImageTab('gallery');
                  setSelectedImage(img.url);
                }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageTab === 'gallery' && selectedImage === img.url ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setActiveImageTab('gallery')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${activeImageTab === 'gallery' ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'}`}
            >
              Gallery
            </button>
            {threeSixtyImages.length > 0 && (
              <button 
                onClick={() => setActiveImageTab('360')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${activeImageTab === '360' ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'}`}
              >
                360° View
              </button>
            )}
            {videos.length > 0 && (
              <button 
                onClick={() => setActiveImageTab('video')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${activeImageTab === 'video' ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'}`}
              >
                Video
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-black/40 uppercase tracking-widest">{product.category_name}</p>
              {product.brand && (
                <>
                  <span className="w-1 h-1 rounded-full bg-black/10"></span>
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">{product.brand}</p>
                </>
              )}
            </div>
            <p className="text-xs font-bold text-black/20 uppercase tracking-widest">SKU: {product.sku}</p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />)}
            </div>
            <span className="text-black/40 font-medium text-sm sm:text-base">(4.8 / 5.0 based on 124 reviews)</span>
          </div>
          
          <div className="flex items-baseline gap-4 mb-6">
            <p className="text-3xl sm:text-4xl font-bold">${(product.price ?? 0).toFixed(2)}</p>
            {product.sale_price && <p className="text-lg sm:text-xl text-black/20 line-through font-bold">${(product.sale_price ?? 0).toFixed(2)}</p>}
          </div>

          {product.wholesale_price && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-2 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> WHOLESALE B2B SPECIAL
              </div>
              <p className="text-emerald-900 font-bold text-2xl mb-1">${(product.wholesale_price ?? 0).toFixed(2)} <span className="text-sm font-medium text-emerald-700/60">/ unit</span></p>
              <p className="text-emerald-700/60 text-sm mb-4">Minimum order quantity: <span className="font-bold text-emerald-700">{product.min_wholesale_qty} units</span></p>
              
              {tiers.length > 0 && (
                <div className="mt-4 border-t border-emerald-100 pt-4">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Volume Discounts</p>
                  <div className="grid grid-cols-2 gap-2">
                    {tiers.map(tier => (
                      <div key={tier.id} className="bg-white/50 p-2 rounded-lg flex justify-between items-center text-xs">
                        <span className="font-medium">{tier.min_quantity}{tier.max_quantity ? `-${tier.max_quantity}` : '+'} units</span>
                        <span className="font-bold text-emerald-700">${(tier.price ?? 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {product.short_description && (
            <div className="mb-8 p-6 bg-zinc-50 rounded-3xl border border-black/5">
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-3">Product Overview</p>
              <p className="text-black/80 text-lg leading-relaxed font-medium">
                {product.short_description}
              </p>
            </div>
          )}

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {product.material && (
              <div className="bg-zinc-50 p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Material</p>
                <p className="font-bold text-gray-900">{product.material}</p>
              </div>
            )}
            {product.warranty && (
              <div className="bg-zinc-50 p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Warranty</p>
                <p className="font-bold text-gray-900">{product.warranty}</p>
              </div>
            )}
            {product.origin && (
              <div className="bg-zinc-50 p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Origin</p>
                <p className="font-bold text-gray-900 uppercase">{product.origin}</p>
              </div>
            )}
            {product.weight && (
              <div className="bg-zinc-50 p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Weight</p>
                <p className="font-bold text-gray-900">{product.weight} kg</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-black/10 rounded-full px-4 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-black/5 rounded-full">-</button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-black/5 rounded-full">+</button>
            </div>
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Add to Cart <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setShowExpressCheckout(true)}
            className="w-full bg-indigo-600 text-white py-4 rounded-full font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg mb-10 group"
          >
            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Buy Now — Express Checkout
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-2">FAST</span>
          </button>

          {product.variations && (
            <div className="space-y-6 mb-10">
              {product.variations.map((variation: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">{variation.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {variation.options.map((option: string, oIdx: number) => (
                      <button 
                        key={oIdx}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${oIdx === 0 ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {product.is_exchangeable && (
            <div className="bg-zinc-900 text-white rounded-2xl p-6 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold">Exchange Available</h4>
                  <p className="text-xs text-white/60">Get up to ${(product.exchange_value_max ?? 0).toFixed(2)} off</p>
                </div>
              </div>
              <p className="text-sm text-white/80 mb-6">
                Exchange your old {product.category_name?.toLowerCase()} and get an instant discount on this purchase.
              </p>
              {exchangeSubmitted ? (
                <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Exchange Request Submitted!
                </div>
              ) : (
                <button 
                  onClick={() => setShowExchangeModal(true)}
                  className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
                >
                  Check Exchange Value
                </button>
              )}
            </div>
          )}

          {product.category_name === 'Fashion' && (
            <button className="w-full border-2 border-black py-4 rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 mb-10">
              <Package className="w-5 h-5" /> Virtual Try-On (AR)
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-10">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black/40">
              <Truck className="w-5 h-5" />
              <span>Global Shipping</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black/40">
              <ShieldCheck className="w-5 h-5" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {product.specs && product.specs.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {product.specs.map((spec: any, idx: number) => (
              <div key={idx} className="flex justify-between py-4 border-b border-black/5">
                <span className="text-sm font-bold text-black/40 uppercase tracking-widest">{spec.label}</span>
                <span className="text-sm font-bold">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Details Tabs/Sections */}
      <section className="border-t border-black/5 pt-20">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Description</h2>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-6">Long Description</p>
            <div className="prose prose-zinc max-w-none text-black/60 leading-relaxed mb-12">
              {product.description}
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Specifications</h2>
            <p className="text-black/50 leading-relaxed mb-8">
              Detailed technical specifications and features for the {product.name}.
            </p>
            <div className="space-y-4">
              {product.brand && (
                <div className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Brand</span>
                  <span className="text-sm font-bold">{product.brand}</span>
                </div>
              )}
              {product.model_name && (
                <div className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Model</span>
                  <span className="text-sm font-bold">{product.model_name}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Material</span>
                  <span className="text-sm font-bold">{product.material}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Warranty</span>
                  <span className="text-sm font-bold">{product.warranty}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Origin</span>
                  <span className="text-sm font-bold uppercase">{product.origin}</span>
                </div>
              )}
              {product.fragile && (
                <div className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Fragile</span>
                  <span className="text-sm font-bold text-rose-600">Yes (Handle with Care)</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Dimensions</span>
                  <span className="text-sm font-bold">{product.dimensions.l} x {product.dimensions.w} x {product.dimensions.h} cm</span>
                </div>
              )}
              {product.specs?.map((spec) => (
                <div key={spec.id} className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">{spec.label}</span>
                  <span className="text-sm font-bold">{spec.value}</span>
                </div>
              ))}
              {product.technical_details?.map((detail, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-black/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">{detail.label}</span>
                  <span className="text-sm font-bold">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-zinc-50 rounded-3xl p-12">
              <h3 className="text-2xl font-bold mb-8">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold">Premium Quality</h4>
                  <p className="text-sm text-black/50">Built with the highest quality materials for durability and performance.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold">Fast Delivery</h4>
                  <p className="text-sm text-black/50">Quick and secure shipping to your doorstep, wherever you are.</p>
                </div>
              </div>
            </div>

            {product.additional_details && (
              <div className="px-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Info className="w-6 h-6 text-orange-600" /> Additional Information
                </h3>
                <div className="prose prose-zinc max-w-none text-black/60 leading-relaxed">
                  {product.additional_details}
                </div>
              </div>
            )}

            {product.manufacturer_images && product.manufacturer_images.length > 0 && (
              <div className="px-12">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Factory className="w-6 h-6 text-orange-600" /> Manufacturer Content
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {product.manufacturer_images.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-black/5 aspect-video">
                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                {product.manufacturer_videos && product.manufacturer_videos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {product.manufacturer_videos.map((vid: string, i: number) => (
                      <div key={i} className="rounded-2xl overflow-hidden bg-black aspect-video">
                        <iframe 
                          src={vid} 
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {product.policies && (
              <div className="px-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {product.policies.shipping && (
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-black/5">
                    <Truck className="w-6 h-6 text-orange-600 mb-3" />
                    <h4 className="font-bold mb-2">Shipping Policy</h4>
                    <p className="text-xs text-black/50 leading-relaxed">{product.policies.shipping}</p>
                  </div>
                )}
                {product.policies.refund && (
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-black/5">
                    <RotateCcw className="w-6 h-6 text-orange-600 mb-3" />
                    <h4 className="font-bold mb-2">Refund Policy</h4>
                    <p className="text-xs text-black/50 leading-relaxed">{product.policies.refund}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Manufacturer Details */}
      <section className="border-t border-black/5 pt-20">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-bold tracking-tight mb-6">From the Manufacturer</h2>
            <p className="text-black/50 leading-relaxed mb-8">
              Direct insights from the creators of this product. Learn about the craftsmanship, materials, and technology that make this item unique.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Material</span>
                <span className="text-sm font-bold">Premium Grade</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Origin</span>
                <span className="text-sm font-bold">Global Sourcing</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Warranty</span>
                <span className="text-sm font-bold">24 Months</span>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="rounded-3xl overflow-hidden bg-black/5 aspect-video">
              <img src="https://picsum.photos/seed/man1/800/600" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-3xl overflow-hidden bg-black/5 aspect-video">
              <img src="https://picsum.photos/seed/man2/800/600" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="col-span-full rounded-3xl overflow-hidden bg-zinc-900 aspect-[21/9] relative">
              <img src="https://picsum.photos/seed/man3/1200/600?blur=2" className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
                <p className="mt-4 font-bold uppercase tracking-widest text-xs">Watch Product Video</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upsell Section */}
      {platformSettings?.enable_upsell_product_page !== 0 && product.upsells && product.upsells.length > 0 && (
        <div className="mt-20 sm:mt-32">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-2">Upgrade Your Choice</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">You Might Also Like</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {product.upsells.slice(0, platformSettings?.recommendation_limit || 4).map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onNavigate={onNavigate} 
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.some(w => w.id === p.id)}
                onToggleWishlist={onToggleWishlist}
                isCompared={compareList.some(c => c.id === p.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cross-sell Section */}
      {platformSettings?.enable_cross_sell_product_page !== 0 && product.crossSells && product.crossSells.length > 0 && (
        <div className="mt-20 sm:mt-32">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-2">Complete Your Set</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Frequently Bought Together</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {product.crossSells.slice(0, platformSettings?.recommendation_limit || 4).map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onNavigate={onNavigate} 
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.some(w => w.id === p.id)}
                onToggleWishlist={onToggleWishlist}
                isCompared={compareList.some(c => c.id === p.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      )}

      {product && (
        <>
          <RelatedProducts
            productId={product.id}
            relationType="related"
            title="Related Products"
            subtitle="Keep Exploring"
            onNavigate={onNavigate}
            onAddToCart={onAddToCart}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
            compareList={compareList}
            onToggleCompare={onToggleCompare}
            platformSettings={platformSettings}
          />
          <InstagramFeed />
          <FaqSection category="product" title="Product FAQs" subtitle="Got Questions?" />
        </>
      )}
    </div>
  );
};

const CartPage = ({ cart, onUpdateQuantity, onRemove, onNavigate, onAddToCart, wishlist, onToggleWishlist, compareList, onToggleCompare, platformSettings }: { cart: CartItem[], onUpdateQuantity: (id: number, q: number) => void, onRemove: (id: number) => void, onNavigate: (v: string, id?: number) => void, onAddToCart: (p: Product) => void, wishlist: Product[], onToggleWishlist: (p: Product) => void, compareList: Product[], onToggleCompare: (p: Product) => void, platformSettings?: any }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length > 0) {
      const crossSellIds = [...new Set(cart.flatMap(item => item.cross_sell_ids || []))];
      if (crossSellIds.length > 0) {
        fetch(`/api/products/by-ids?ids=${crossSellIds.join(',')}`)
          .then(res => res.json())
          .then(data => {
            const filtered = data.filter((p: Product) => !cart.some(item => item.id === p.id));
            setRecommendations(filtered);
          });
      } else {
        fetch('/api/products')
          .then(res => res.json())
          .then(data => {
            const featured = data.filter((p: Product) => p.is_featured && !cart.some(item => item.id === p.id)).slice(0, 4);
            setRecommendations(featured);
          });
      }
    }
  }, [cart]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 sm:mb-12">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-black/5 rounded-3xl">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-black/20" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => onNavigate('products')} className="bg-black text-white px-8 py-3 rounded-full font-bold">Start Shopping</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
            <div className="lg:col-span-2 space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center border-b border-black/5 pb-8">
                  <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0 cursor-pointer" onClick={() => onNavigate('product', item.id)}>
                    <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg sm:text-xl cursor-pointer hover:text-orange-600 transition-colors" onClick={() => onNavigate('product', item.id)}>{item.name}</h3>
                      <p className="font-bold text-lg sm:text-xl sm:hidden">${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</p>
                    </div>
                    <p className="text-black/40 text-sm mb-4">{item.category_name}</p>
                    <div className="flex items-center justify-between sm:justify-start gap-6">
                      <div className="flex items-center border border-black/10 rounded-full px-3 py-1">
                        <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-black/5 rounded-full">-</button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-black/5 rounded-full">+</button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="font-bold text-xl">${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</p>
                    <p className="text-black/40 text-sm">${(item.price ?? 0).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-black/5 p-8 rounded-3xl h-fit sticky top-24">
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span>${(subtotal ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Tax</span>
                  <span>${((subtotal ?? 0) * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-black/10 pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>${((subtotal ?? 0) * 1.08).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => onNavigate('checkout')} className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>

          {platformSettings?.enable_cross_sell_cart_page !== 0 && recommendations.length > 0 && (
            <div className="mt-20">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-2">Recommended for you</p>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Complete Your Purchase</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {recommendations.slice(0, platformSettings?.recommendation_limit || 4).map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onNavigate={onNavigate} 
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlist.some(w => w.id === p.id)}
                    onToggleWishlist={onToggleWishlist}
                    isCompared={compareList.some(c => c.id === p.id)}
                    onToggleCompare={onToggleCompare}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CheckoutPage = ({ cart, onOrderComplete, onNavigate, onAddToCart, wishlist, onToggleWishlist, compareList, onToggleCompare, platformSettings }: { cart: CartItem[], onOrderComplete: () => void, onNavigate: (v: string, id?: number) => void, onAddToCart: (p: Product) => void, wishlist: Product[], onToggleWishlist: (p: Product) => void, compareList: Product[], onToggleCompare: (p: Product) => void, platformSettings?: any }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal * 1.08;

  useEffect(() => {
    if (cart.length > 0) {
      const crossSellIds = [...new Set(cart.flatMap(item => item.cross_sell_ids || []))];
      
      if (crossSellIds.length > 0) {
        fetch(`/api/products/by-ids?ids=${crossSellIds.join(',')}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setRecommendations(data.filter((p: Product) => !cart.some(item => item.id === p.id)));
          } else {
            // Fallback to featured products
            fetch('/api/products').then(res => res.json()).then(all => {
              setRecommendations(all.filter((p: Product) => p.is_featured && !cart.some(item => item.id === p.id)).slice(0, 4));
            });
          }
        });
      } else {
        // Fallback to featured products
        fetch('/api/products').then(res => res.json()).then(all => {
          setRecommendations(all.filter((p: Product) => p.is_featured && !cart.some(item => item.id === p.id)).slice(0, 4));
        });
      }
    }
  }, [cart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total })
    }).then(() => onOrderComplete());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 sm:mb-12">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</div>
              Shipping Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="text" placeholder="Last Name" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="email" placeholder="Email Address" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="tel" placeholder="Phone Number" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="text" placeholder="Address" className="col-span-2 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="text" placeholder="City" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="text" placeholder="State / Province" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="text" placeholder="Postal Code" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
              <input type="text" placeholder="Country" className="col-span-2 sm:col-span-1 p-4 bg-black/5 border-none rounded-xl focus:ring-2 focus:ring-black/10" required />
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</div>
              Payment Method
            </h2>
            <div className="p-6 border-2 border-black rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-zinc-200 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
                <div>
                  <p className="font-bold">Credit Card</p>
                  <p className="text-sm text-black/40">Ending in 4242</p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </div>
          </section>

          {platformSettings?.enable_cross_sell_checkout_page !== 0 && recommendations.length > 0 && (
            <div className="pt-12 border-t border-black/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Mini Add to Cart</h2>
                <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Quick Add Recommendations</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.slice(0, platformSettings?.recommendation_limit || 4).map(p => (
                  <div key={p.id} className="flex gap-4 p-4 bg-white border border-black/5 rounded-2xl hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                      <img src={p.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate mb-1">{p.name}</h4>
                      <p className="text-sm font-bold mb-3">${(p.price ?? 0).toFixed(2)}</p>
                      <button 
                        type="button"
                        onClick={() => onAddToCart(p)}
                        className="w-full bg-black text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-black/5 p-8 rounded-3xl h-fit">
          <h2 className="text-2xl font-bold mb-8">Review Order</h2>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-black/60">{item.name} x {item.quantity}</span>
                <span className="font-bold">${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-black/10 pt-4 flex justify-between font-bold text-xl">
              <span>Total Amount</span>
              <span>${(total ?? 0).toFixed(2)}</span>
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Vendor Dashboard ---

const VendorDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingPromotion, setIsCreatingPromotion] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'copilot', label: 'AI Copilot', icon: Zap },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'pricing', label: 'Pricing Engine', icon: DollarSign },
    { id: 'seo', label: 'SEO Studio', icon: Search },
    { id: 'reviews', label: 'Review Analysis', icon: Star },
    { id: 'fraud', label: 'Fraud Detection', icon: ShieldCheck },
    { id: 'visual', label: 'Visual Search', icon: Camera },
    { id: 'support', label: 'Support Agent', icon: MessageCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'coupons', label: 'Promotions', icon: Tag },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'enquiries', label: 'Product Enquiries', icon: MessageSquare },
    { id: 'variations', label: 'My Variations', icon: Layers },
    { id: 'staff', label: 'Staff Manager', icon: Users },
    { id: 'guide', label: 'Vendor Guide', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    fetch('/api/vendor/stats').then(res => res.json()).then(setStats);
    fetch('/api/products').then(res => res.json()).then(setProducts);
    fetch('/api/orders').then(res => res.json()).then(setOrders);
    fetch('/api/vendor/shipping').then(res => res.json()).then(setShippingMethods);
  }, []);

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simple CSV parser simulation
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1); // Skip header
      const productsToUpload = lines.map(line => {
        const [name, sku, description, price, stock] = line.split(',');
        return { name, sku, description, price: parseFloat(price), stock: parseInt(stock) };
      }).filter(p => p.name);

      fetch('/api/vendor/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productsToUpload })
      }).then(() => {
        setIsBulkUploading(false);
        fetch('/api/products').then(res => res.json()).then(setProducts);
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex relative">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-black/5 p-6 flex flex-col gap-8 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">V</div>
            NEXUS VENDOR
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-black/5 rounded-lg lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-black text-white shadow-lg' : 'hover:bg-black/5 text-black/60'}`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-black/5 px-4 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-black/5 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-[10px] font-bold">V</div>
        </header>

        <div className="p-4 sm:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 lg:space-y-12">
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Store Overview</h1>
                    <p className="text-black/50 text-sm sm:text-base">Real-time performance metrics for your business.</p>
                  </div>
                  <div className="flex gap-2 sm:gap-4">
                    <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-white border border-black/5 rounded-xl font-bold text-xs sm:text-sm shadow-sm">Export</button>
                    <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg">View Store</button>
                  </div>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: 'Total Revenue', value: `$${(stats?.revenue ?? 0).toFixed(2)}`, trend: '+12.5%' },
                    { label: 'Total Orders', value: stats?.orders ?? 0, trend: '+5.2%' },
                    { label: 'Active Products', value: stats?.products ?? 0, trend: 'Stable' },
                    { label: 'Avg. Rating', value: '4.8', trend: '+0.2' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5 shadow-sm">
                      <p className="text-[10px] sm:text-xs font-bold text-black/40 uppercase tracking-widest mb-2">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-bold mb-2">{stat.value}</p>
                      <p className={`text-[10px] sm:text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-black/40'}`}>{stat.trend} from last month</p>
                    </div>
                  ))}
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-black/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-sm font-bold underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead className="bg-zinc-50 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-4">Order</th>
                          <th className="px-8 py-4">Date</th>
                          <th className="px-8 py-4">Total</th>
                          <th className="px-8 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {(Array.isArray(orders) ? orders : []).slice(0, 5).map(order => (
                          <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-8 py-4 font-medium text-sm">#ORD-{order.id}</td>
                            <td className="px-8 py-4 text-black/60 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-8 py-4 font-bold text-sm">${(order.total ?? 0).toFixed(2)}</td>
                            <td className="px-8 py-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8">
                  <h2 className="text-xl font-bold mb-8">Sales Analytics</h2>
                  <div className="h-64 flex items-end gap-4">
                    {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                      <div key={i} className="flex-1 bg-black/5 rounded-t-lg relative group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="absolute bottom-0 left-0 right-0 bg-black rounded-t-lg group-hover:bg-zinc-700 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'copilot' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <VendorCopilot />
            </motion.div>
          )}

          {activeTab === 'forecasting' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <PredictiveAnalytics />
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <PricingEngine />
            </motion.div>
          )}

          {activeTab === 'seo' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <AutonomousSEO />
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <ReviewAnalysis />
            </motion.div>
          )}

          {activeTab === 'fraud' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <FraudDetection />
            </motion.div>
          )}

          {activeTab === 'visual' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <VisualSearch />
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <SupportAgent />
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorShipping />
            </motion.div>
          )}

          {activeTab === 'coupons' && !isCreatingPromotion && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorPromotions onCreate={() => setIsCreatingPromotion(true)} />
            </motion.div>
          )}

          {activeTab === 'coupons' && isCreatingPromotion && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CreatePromotion onBack={() => setIsCreatingPromotion(false)} />
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorOrders />
            </motion.div>
          )}

          {activeTab === 'enquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorEnquiries />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorSettings />
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorCustomers />
            </motion.div>
          )}

          {['ledger', 'reviews'].includes(activeTab) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-black/20" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase">{activeTab}</h2>
              <p className="text-black/40 max-w-xs">This module is being optimized for your store. Real-time data will appear here shortly.</p>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <VendorProducts />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorAnalytics />
            </motion.div>
          )}

          {activeTab === 'payouts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorPayouts />
            </motion.div>
          )}

          {activeTab === 'variations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorVariations />
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorStaffManager />
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorGuide />
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VendorNotifications />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  </div>
);
};

const AuthPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [role, setRole] = useState<'customer' | 'vendor' | 'wholesaler'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, name, role };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (isAdminLogin && data.role !== 'admin' && data.role !== 'super_admin') {
          setError('Access denied. Admin credentials required.');
          return;
        }
        onLogin(data);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-black/5"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Nexus Marketplace</h1>
          <p className="text-black/50">
            {isAdminLogin ? 'Administrative Control Center' : (isLogin ? 'Welcome back to the future' : 'Join the global ecosystem')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && !isAdminLogin && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/40">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/10" 
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/10" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black/10" 
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button 
            type="submit"
            className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all ${isAdminLogin ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-black text-white hover:bg-zinc-800'}`}
          >
            {isAdminLogin ? 'Admin Login' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4 text-center">
          {!isAdminLogin && (
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          )}
          <button 
            onClick={() => {
              setIsAdminLogin(!isAdminLogin);
              setIsLogin(true);
            }}
            className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors"
          >
            {isAdminLogin ? "Return to User Login" : "Staff & Admin Access"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProfilePage = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [loyalty, setLoyalty] = useState<{ points: any[], balance: number }>({ points: [], balance: 0 });
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user.role === 'customer') {
      fetch(`/api/loyalty/${user.id}`)
        .then(res => res.json())
        .then(setLoyalty);
    } else if (user.role === 'vendor') {
      fetch('/api/vendor/stats')
        .then(res => res.json())
        .then(setStats);
    } else if (user.role === 'admin' || user.role === 'super_admin') {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(setStats);
    }
  }, [user.id, user.role]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden mb-12">
        <div className="h-32 bg-zinc-900" />
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl font-bold">{user.name[0]}</div>}
            </div>
            <div className="flex gap-2">
              <button className="bg-zinc-100 text-black px-6 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors">Edit Profile</button>
              <button onClick={onLogout} className="bg-rose-50 text-rose-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">Logout</button>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
          <p className="text-black/50 mb-6">{user.email}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.role === 'customer' && (
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Loyalty Points</p>
                <p className="text-3xl font-bold text-emerald-900">{loyalty?.balance ?? 0} pts</p>
              </div>
            )}
            {(user.role === 'vendor' || user.role === 'admin' || user.role === 'super_admin') && stats && (
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">
                  {user.role === 'vendor' ? 'Total Revenue' : 'System Revenue'}
                </p>
                <p className="text-3xl font-bold text-orange-900">${stats.revenue?.toFixed(2) || '0.00'}</p>
              </div>
            )}
            <div className="bg-black/5 p-6 rounded-2xl">
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Account Type</p>
              <p className="text-xl font-bold capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="bg-black/5 p-6 rounded-2xl">
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Member Since</p>
              <p className="text-xl font-bold">2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {user.role === 'customer' && (
          <>
            <h2 className="text-2xl font-bold">Loyalty History</h2>
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              {loyalty?.points?.length === 0 ? (
                <div className="p-12 text-center text-black/30">No points earned yet.</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-black/40">
                    <tr>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Points</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {loyalty?.points?.map((p, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 text-sm font-medium">{p.reason}</td>
                        <td className={`px-6 py-4 text-sm font-bold ${p.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {p.points > 0 ? '+' : ''}{p.points}
                        </td>
                        <td className="px-6 py-4 text-sm text-black/40">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {(user.role === 'admin' || user.role === 'super_admin') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-black/5">
              <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-zinc-50 rounded-2xl text-sm font-bold hover:bg-zinc-100 transition-all text-left">Manage Users</button>
                <button className="p-4 bg-zinc-50 rounded-2xl text-sm font-bold hover:bg-zinc-100 transition-all text-left">System Logs</button>
                <button className="p-4 bg-zinc-50 rounded-2xl text-sm font-bold hover:bg-zinc-100 transition-all text-left">Global Settings</button>
                <button className="p-4 bg-zinc-50 rounded-2xl text-sm font-bold hover:bg-zinc-100 transition-all text-left">Database Backup</button>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-black/5">
              <h3 className="text-lg font-bold mb-6">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/40 font-bold uppercase tracking-widest">Database</span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">OPTIMAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/40 font-bold uppercase tracking-widest">API Latency</span>
                  <span className="text-sm font-bold">24ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/40 font-bold uppercase tracking-widest">Active Sessions</span>
                  <span className="text-sm font-bold">1,284</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {user.role === 'vendor' && (
          <div className="bg-white p-8 rounded-3xl border border-black/5">
            <h3 className="text-lg font-bold mb-6">Store Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Total Orders</p>
                <p className="text-2xl font-bold">{stats?.orders || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Products</p>
                <p className="text-2xl font-bold">{stats?.products || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Store Rating</p>
                <p className="text-2xl font-bold">4.9</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Followers</p>
                <p className="text-2xl font-bold">842</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WishlistPage = ({ wishlist, onNavigate, onAddToCart, onToggleWishlist }: { wishlist: Product[], onNavigate: (v: string, id?: number) => void, onAddToCart: (p: Product) => void, onToggleWishlist: (p: Product) => void }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-12">Your Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-black/5 rounded-3xl">
          <Heart className="w-16 h-16 mx-auto mb-6 text-black/20" />
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <button onClick={() => onNavigate('products')} className="bg-black text-white px-8 py-3 rounded-full font-bold">Start Exploring</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onNavigate={onNavigate} 
              onAddToCart={onAddToCart}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [platformSettings, setPlatformSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/platform-settings').then(res => res.json()).then(setPlatformSettings);
    
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetch(`/api/wishlist/${parsedUser.id}`).then(res => res.json()).then(setWishlist);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
    if (userData.role === 'admin') setView('admin');
    else if (userData.role === 'vendor') setView('vendor');
    else setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    setWishlist([]);
    setView('home');
  };

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      setView('auth');
      return;
    }

    const isWishlisted = wishlist.some(p => p.id === product.id);
    if (isWishlisted) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id })
      });
    } else {
      setWishlist(prev => [...prev, product]);
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id })
      });
    }
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) return prev; // Limit to 4 products
      return [...prev, product];
    });
  };

  const handleNavigate = (v: string, idOrSlug?: number | string) => {
    setView(v);
    if (typeof idOrSlug === 'number') setSelectedProductId(idOrSlug);
    if (typeof idOrSlug === 'string') setSelectedBlogSlug(idOrSlug);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, q: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  if (view === 'vendor' && user?.role === 'vendor') {
    return (
      <>
        <VendorDashboard onLogout={handleLogout} />
        <ChatBot onNavigate={handleNavigate} />
      </>
    );
  }

  if (view === 'customer-dashboard' && user?.role === 'customer') {
    return (
      <>
        <CustomerDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
        <ChatBot onNavigate={handleNavigate} />
      </>
    );
  }

  if (view === 'wholesaler-dashboard' && user?.role === 'wholesaler') {
    return (
      <>
        <WholesalerDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
        <ChatBot onNavigate={handleNavigate} />
      </>
    );
  }

  if (view === 'admin' && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar 
          onNavigate={handleNavigate} 
          view={view} 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
          user={user}
          onLogout={handleLogout}
        />
        <AdminDashboard />
      </div>
    );
  }

  if (view === 'auth') {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (view === 'vendor-auth') {
    return <VendorAuthPage onLogin={handleLogin} />;
  }

  if (view === 'wholesaler-auth') {
    return <WholesalerAuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <Navbar 
          onNavigate={handleNavigate} 
          view={view} 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
          user={user}
          onLogout={handleLogout}
        />
        {view === 'home' && <MegaMenu />}
      </header>
      
      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomePage onNavigate={handleNavigate} products={products} categories={categories} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} compareList={compareList} onToggleCompare={toggleCompare} />
            </motion.div>
          )}
          {view === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductListPage onNavigate={handleNavigate} products={products} categories={categories} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} compareList={compareList} onToggleCompare={toggleCompare} />
            </motion.div>
          )}
          {view === 'wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WishlistPage wishlist={wishlist} onNavigate={handleNavigate} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} />
            </motion.div>
          )}
          {view === 'profile' && user && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProfilePage user={user} onLogout={handleLogout} />
            </motion.div>
          )}
          {view === 'product-detail' && selectedProductId && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductDetailPage 
                productId={selectedProductId} 
                onNavigate={handleNavigate} 
                onAddToCart={addToCart} 
                user={user} 
                wishlist={wishlist} 
                onToggleWishlist={toggleWishlist} 
                compareList={compareList} 
                onToggleCompare={toggleCompare}
                platformSettings={platformSettings}
              />
            </motion.div>
          )}
          {view === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CartPage 
                cart={cart} 
                onUpdateQuantity={updateQuantity} 
                onRemove={removeFromCart} 
                onNavigate={handleNavigate}
                onAddToCart={addToCart}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                compareList={compareList}
                onToggleCompare={toggleCompare}
                platformSettings={platformSettings}
              />
            </motion.div>
          )}
          {view === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckoutPage 
                cart={cart} 
                onOrderComplete={() => {
                  setCart([]);
                  setView('confirmation');
                }}
                onNavigate={handleNavigate}
                onAddToCart={addToCart}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                compareList={compareList}
                onToggleCompare={toggleCompare}
                platformSettings={platformSettings}
              />
            </motion.div>
          )}
          {view === 'confirmation' && (
            <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[70vh] flex flex-col items-center justify-center text-center px-4 sm:px-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 sm:mb-8">
                <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Order Confirmed!</h1>
              <p className="text-black/50 text-base sm:text-xl max-w-md mb-8 sm:mb-12">Thank you for your purchase. We've sent a confirmation email to your inbox.</p>
              <button onClick={() => handleNavigate('home')} className="bg-black text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base">Continue Shopping</button>
            </motion.div>
          )}
          {view === 'blog' && (
            <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BlogPage onNavigate={handleNavigate} />
            </motion.div>
          )}
          {view === 'blog-post' && selectedBlogSlug && (
            <motion.div key="blog-post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BlogPostPage slug={selectedBlogSlug} onNavigate={handleNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-zinc-50 border-t border-black/5 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="space-y-6">
            <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">N</div>
              NEXUS
            </div>
            <p className="text-black/50 text-sm leading-relaxed">
              The premier marketplace for innovative products and independent vendors. Built for the future of commerce.
            </p>
            <div className="flex gap-4">
              <img src="https://picsum.photos/seed/visa/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Visa" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/mastercard/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Mastercard" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/paypal/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Paypal" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/applepay/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Apple Pay" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-black/60">
              <li><button onClick={() => handleNavigate('products')}>All Products</button></li>
              <li><button>New Arrivals</button></li>
              <li><button>Featured</button></li>
              <li><button>Sale</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-black/60">
              <li><button>Help Center</button></li>
              <li><button>Shipping Info</button></li>
              <li><button>Returns</button></li>
              <li><button onClick={() => handleNavigate('blog')}>Insights Blog</button></li>
              <li><button>Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-black/60 mb-4">Get the latest updates on new products and upcoming sales.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-white border border-black/10 rounded-lg px-4 py-2 text-sm flex-1" />
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 sm:mt-20 pt-8 border-t border-black/5 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-4 text-[10px] sm:text-xs font-bold text-black/40 uppercase tracking-widest text-center sm:text-left">
          <p>© 2026 NEXUS MARKETPLACE. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <button>Privacy Policy</button>
            <button>Terms of Service</button>
            <button>Cookie Settings</button>
          </div>
        </div>
      </footer>
      <CompareBar 
        compareList={compareList} 
        onRemove={toggleCompare} 
        onClear={() => setCompareList([])} 
        onOpen={() => setShowCompare(true)} 
      />

      {showCompare && (
        <CompareModal 
          compareList={compareList} 
          onClose={() => setShowCompare(false)} 
        />
      )}
      <ChatBot onNavigate={handleNavigate} />
    </div>
  );
}
