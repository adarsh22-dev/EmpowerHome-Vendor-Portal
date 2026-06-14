import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  Package, 
  BarChart3, 
  ShoppingCart, 
  Truck, 
  TrendingUp,
  Users,
  Tag, 
  CreditCard, 
  BookOpen, 
  MessageSquare, 
  Layers, 
  Warehouse, 
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  ChevronRight,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Globe,
  ShieldCheck,
  Headphones,
  Clock,
  Upload,
  Monitor,
  Smartphone,
  Save,
  RotateCcw,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, VendorStats, VendorSettings } from '../types';
import PerformanceOverview from './PerformanceOverview';
import NotificationsView from './NotificationsView';
import ProductManagement from './ProductManagement';
import VendorProducts from '../pages/vendor/VendorProducts';
import VendorOrders from '../pages/vendor/VendorOrders';
import ShippingOverview from './ShippingOverview';
import PromotionsDiscounts from './PromotionsDiscounts';
import PaymentsHistory from './PaymentsHistory';
import ProductEnquiries from './ProductEnquiries';
import MyVariations from './MyVariations';
import StaffManager from './StaffManager';
import ProductEdit from './ProductEdit';
import ExchangeManagement from './ExchangeManagement';
import VendorGuideView from './VendorGuideView';

interface VendorPortalProps {
  user: any;
  onLogout: () => void;
}

const VendorPortal: React.FC<VendorPortalProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('My Products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [vendorSettings, setVendorSettings] = useState<VendorSettings | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Notifications', icon: Bell },
    { name: 'My Products', icon: Package },
    { name: 'Analytics', icon: TrendingUp },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Shipping', icon: Truck },
    { name: 'Promotions', icon: Tag },
    { name: 'Payouts', icon: CreditCard },
    { name: 'Product Enquiries', icon: MessageSquare },
    { name: 'My Variations', icon: Layers },
    { name: 'Staff Manager', icon: Users },
    { name: 'Vendor Guide', icon: BookOpen },
    { name: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, statRes, settingsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/vendor/stats'),
        fetch('/api/vendor/settings')
      ]);
      const [prodData, catData, statData, settingsData] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        statRes.json(),
        settingsRes.json()
      ]);
      setProducts(prodData);
      setCategories(catData);
      setStats(statData);
      setVendorSettings(settingsData);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (data: any) => {
    try {
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? `/api/products/${data.id}` : '/api/products';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setIsAddProductOpen(false);
        setSelectedProduct(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(`Error saving product: ${err.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <PerformanceOverview />;
      case 'Notifications':
        return <NotificationsView />;
      case 'My Products':
        return <VendorProducts />;
      case 'Analytics':
        return <PerformanceOverview />;
      case 'My Variations':
        return <MyVariations />;
      case 'Orders':
        return <VendorOrders />;
      case 'Shipping':
        return <ShippingOverview />;
      case 'Promotions':
        return <PromotionsDiscounts />;
      case 'Payouts':
        return <PaymentsHistory />;
      case 'Product Enquiries':
        return <ProductEnquiries />;
      case 'Staff Manager':
        return <StaffManager />;
      case 'Exchange Management':
        return <ExchangeManagement />;
      case 'Vendor Guide':
        return <VendorGuideView />;
      case 'Settings':
        return <SettingsView settings={vendorSettings} onSave={fetchData} />;
      default:
        return <PerformanceOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans relative">
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
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-black/5 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs">NC</div>
            <h1 className="font-bold tracking-tighter text-xl">NovaCart AI</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-black/5 rounded-lg lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.name 
                ? 'bg-black text-white shadow-lg shadow-black/10' 
                : 'text-black/60 hover:bg-black/5 hover:text-black'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0) || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.name || 'Vendor'}</p>
              <p className="text-[10px] text-black/40 truncate">{user?.email}</p>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-black/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-black/5 px-4 lg:px-8 py-4 sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-black/5 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg lg:text-xl font-bold tracking-tight truncate">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-black/5 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10 w-48 lg:w-64"
              />
            </div>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors md:hidden">
              <Search className="w-5 h-5 text-black/60" />
            </button>
            <button className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(isAddProductOpen || selectedProduct) && (
          <ProductEdit 
            product={selectedProduct || undefined}
            categories={categories} 
            onClose={() => {
              setIsAddProductOpen(false);
              setSelectedProduct(null);
            }} 
            onSave={handleSaveProduct}
          />
        )}
        {isAddCategoryOpen && (
          <AddCategoryModal 
            onClose={() => setIsAddCategoryOpen(false)} 
            onSuccess={() => {
              setIsAddCategoryOpen(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const VariationsView = () => {
  return <MyVariations />;
};

const SettingsView = ({ settings, onSave }: { settings: VendorSettings | null, onSave: () => void }) => {
  const [activeSubTab, setActiveSubTab] = useState('Store');
  const [formData, setFormData] = useState<Partial<VendorSettings>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const subTabs = [
    { name: 'Store', icon: ImageIcon },
    { name: 'Location', icon: MapPin },
    { name: 'Payment', icon: CreditCard },
    { name: 'Shipping', icon: Truck },
    { name: 'SEO', icon: Globe },
    { name: 'Store Policies', icon: ShieldCheck },
    { name: 'Customer Support', icon: Headphones },
    { name: 'Store Hours', icon: Clock },
  ];

  const calculateCompleteness = () => {
    const fields = ['store_name', 'store_logo', 'store_banner', 'shop_description', 'seo_title'];
    const filled = fields.filter(f => !!(formData as any)[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/vendor/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSubContent = () => {
    switch (activeSubTab) {
      case 'Store':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">General Setting</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Name *</label>
                  <input 
                    type="text" 
                    value={formData.store_name || ''}
                    onChange={(e) => setFormData({...formData, store_name: e.target.value})}
                    placeholder="Enter store name"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Slug *</label>
                  <input 
                    type="text" 
                    value={formData.store_slug || ''}
                    onChange={(e) => setFormData({...formData, store_slug: e.target.value})}
                    placeholder="your-store-slug"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Email</label>
                  <input 
                    type="email" 
                    value={formData.store_email || ''}
                    onChange={(e) => setFormData({...formData, store_email: e.target.value})}
                    placeholder="store@example.com"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Phone</label>
                  <input 
                    type="text" 
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Store Brand Setup</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Logo ?</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-black/5 rounded-2xl flex items-center justify-center overflow-hidden border border-black/5">
                      {formData.store_logo ? (
                        <img src={formData.store_logo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-black/10" />
                      )}
                    </div>
                    <input 
                      type="text" 
                      value={formData.store_logo || ''}
                      onChange={(e) => setFormData({...formData, store_logo: e.target.value})}
                      placeholder="Logo URL"
                      className="flex-1 bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Banner Type</label>
                  <select 
                    value={formData.banner_type || 'static'}
                    onChange={(e) => setFormData({...formData, banner_type: e.target.value as any})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="static">Static Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Banner ?</label>
                  <input 
                    type="text" 
                    value={formData.store_banner || ''}
                    onChange={(e) => setFormData({...formData, store_banner: e.target.value})}
                    placeholder="Banner URL"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Mobile Banner ?</label>
                  <input 
                    type="text" 
                    value={formData.mobile_banner || ''}
                    onChange={(e) => setFormData({...formData, mobile_banner: e.target.value})}
                    placeholder="Mobile Banner URL"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store List Banner Type</label>
                  <select 
                    value={formData.list_banner_type || 'static'}
                    onChange={(e) => setFormData({...formData, list_banner_type: e.target.value as any})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="static">Static Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-xs font-bold text-black/60">Store List Banner ?</label>
                  <input 
                    type="text" 
                    value={formData.list_banner || ''}
                    onChange={(e) => setFormData({...formData, list_banner: e.target.value})}
                    placeholder="List Banner URL"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-xs font-bold text-black/60">Shop Description ?</label>
                  <textarea 
                    value={formData.shop_description || ''}
                    onChange={(e) => setFormData({...formData, shop_description: e.target.value})}
                    placeholder="Write your description here..."
                    className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-32 resize-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Store Visibility Setup</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Name Position ?</label>
                  <select 
                    value={formData.name_position || 'header'}
                    onChange={(e) => setFormData({...formData, name_position: e.target.value as any})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="header">At Header</option>
                    <option value="banner">On Banner</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Products per page ?</label>
                  <input 
                    type="number" 
                    value={formData.products_per_page || 10}
                    onChange={(e) => setFormData({...formData, products_per_page: parseInt(e.target.value)})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Hide Email from Store', key: 'hide_email' },
                    { label: 'Hide Phone from Store', key: 'hide_phone' },
                    { label: 'Hide Address from Store', key: 'hide_address' },
                    { label: 'Hide Map from Store', key: 'hide_map' },
                    { label: 'Hide About from Store', key: 'hide_about' },
                    { label: 'Hide Policy from Store', key: 'hide_policy' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl cursor-pointer hover:bg-black/10 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={!!(formData as any)[item.key]}
                        onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                        className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                      />
                      <span className="text-xs font-bold text-black/60">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
      case 'Location':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Store Address</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Street</label>
                  <input 
                    type="text" 
                    value={formData.street || ''}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                    placeholder="Street address"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Street 2</label>
                  <input 
                    type="text" 
                    value={formData.street_2 || ''}
                    onChange={(e) => setFormData({...formData, street_2: e.target.value})}
                    placeholder="Apartment, suite, etc."
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">City/Town</label>
                  <input 
                    type="text" 
                    value={formData.city || ''}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="City"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Postcode/Zip</label>
                  <input 
                    type="text" 
                    value={formData.zip || ''}
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    placeholder="Zip code"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Country</label>
                  <select 
                    value={formData.country || 'India'}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Store Location</h4>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input 
                      type="text" 
                      placeholder="Search location..." 
                      className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <button type="button" className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">
                    Find Location
                  </button>
                </div>
                <div className="aspect-video bg-black/5 rounded-3xl flex items-center justify-center border border-black/5 text-black/20 font-bold uppercase tracking-widest text-xs">
                  [Map View Placeholder]
                </div>
              </div>
            </section>
          </div>
        );
      case 'Payment':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Preferred Payment Method</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Payment Method</label>
                  <select 
                    value={formData.preferred_payment || ''}
                    onChange={(e) => setFormData({...formData, preferred_payment: e.target.value})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="">Select Method</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        );
      case 'Shipping':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Shipping Settings</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl cursor-pointer hover:bg-black/10 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={!!formData.enable_shipping}
                    onChange={(e) => setFormData({...formData, enable_shipping: e.target.checked})}
                    className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                  />
                  <span className="text-xs font-bold text-black/60">Enable Shipping ?</span>
                </label>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Processing Time ?</label>
                  <select 
                    value={formData.processing_time || ''}
                    onChange={(e) => setFormData({...formData, processing_time: e.target.value})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="">Ready to ship in...</option>
                    <option value="1-3">1-3 business days</option>
                    <option value="3-5">3-5 business days</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Shipping Type ?</label>
                  <select 
                    value={formData.shipping_type || ''}
                    onChange={(e) => setFormData({...formData, shipping_type: e.target.value})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="zone">Shipping by Zone</option>
                    <option value="flat">Flat Rate</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Shipping by Zone</h4>
              </div>
              <div className="p-8 bg-black/5 rounded-3xl text-center">
                <p className="text-sm text-black/40 font-medium">No shipping zone found for configuration. Please contact admin.</p>
              </div>
            </section>
          </div>
        );
      case 'SEO':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">General Setup</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">SEO Title ?</label>
                  <input 
                    type="text" 
                    value={formData.seo_title || ''}
                    onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                    placeholder="SEO Title"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Meta Description ?</label>
                  <textarea 
                    value={formData.seo_description || ''}
                    onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                    placeholder="Meta Description"
                    className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Meta Keywords ?</label>
                  <input 
                    type="text" 
                    value={formData.seo_keywords || ''}
                    onChange={(e) => setFormData({...formData, seo_keywords: e.target.value})}
                    placeholder="Meta Keywords"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Facebook Setup</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Facebook Title</label>
                  <input 
                    type="text" 
                    value={formData.fb_title || ''}
                    onChange={(e) => setFormData({...formData, fb_title: e.target.value})}
                    placeholder="Facebook Title"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Facebook Description</label>
                  <input 
                    type="text" 
                    value={formData.fb_description || ''}
                    onChange={(e) => setFormData({...formData, fb_description: e.target.value})}
                    placeholder="Facebook Description"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="col-span-2 space-y-4">
                  <label className="text-xs font-bold text-black/60">Facebook Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-black/5 rounded-2xl flex items-center justify-center overflow-hidden border border-black/5">
                      {formData.fb_image ? (
                        <img src={formData.fb_image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-black/10" />
                      )}
                    </div>
                    <input 
                      type="text" 
                      value={formData.fb_image || ''}
                      onChange={(e) => setFormData({...formData, fb_image: e.target.value})}
                      placeholder="Image URL"
                      className="flex-1 bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'Store Policies':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Policies Setting</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Policy Tab Label</label>
                  <input 
                    type="text" 
                    value={formData.policy_tab_label || ''}
                    onChange={(e) => setFormData({...formData, policy_tab_label: e.target.value})}
                    placeholder="Policy Tab Label"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Shipping Policy</label>
                  <textarea 
                    value={formData.policy_shipping || ''}
                    onChange={(e) => setFormData({...formData, policy_shipping: e.target.value})}
                    placeholder="Shipping Policy"
                    className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Refund Policy</label>
                  <textarea 
                    value={formData.policy_refund || ''}
                    onChange={(e) => setFormData({...formData, policy_refund: e.target.value})}
                    placeholder="Refund Policy"
                    className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Cancellation Policy</label>
                  <textarea 
                    value={formData.policy_cancellation || ''}
                    onChange={(e) => setFormData({...formData, policy_cancellation: e.target.value})}
                    placeholder="Cancellation Policy"
                    className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                  />
                </div>
              </div>
            </section>
          </div>
        );
      case 'Customer Support':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Support Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Phone</label>
                  <input 
                    type="text" 
                    value={formData.customer_support_phone || ''}
                    onChange={(e) => setFormData({...formData, customer_support_phone: e.target.value})}
                    placeholder="Phone"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Email</label>
                  <input 
                    type="email" 
                    value={formData.customer_support_email || ''}
                    onChange={(e) => setFormData({...formData, customer_support_email: e.target.value})}
                    placeholder="Email"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-black/60">Address 1</label>
                  <input 
                    type="text" 
                    value={formData.support_address || ''}
                    onChange={(e) => setFormData({...formData, support_address: e.target.value})}
                    placeholder="Address"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Country</label>
                  <select 
                    value={formData.support_country || 'India'}
                    onChange={(e) => setFormData({...formData, support_country: e.target.value})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">City/Town</label>
                  <input 
                    type="text" 
                    value={formData.support_city || ''}
                    onChange={(e) => setFormData({...formData, support_city: e.target.value})}
                    placeholder="City"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            </section>
          </div>
        );
      case 'Store Hours':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Store Hours Setting</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl cursor-pointer hover:bg-black/10 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={!!formData.enable_store_hours}
                    onChange={(e) => setFormData({...formData, enable_store_hours: e.target.checked})}
                    className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                  />
                  <span className="text-xs font-bold text-black/60">Enable Store Hours</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl cursor-pointer hover:bg-black/10 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={!!formData.disable_purchase_off_time}
                    onChange={(e) => setFormData({...formData, disable_purchase_off_time: e.target.checked})}
                    className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                  />
                  <span className="text-xs font-bold text-black/60">Disable Purchase Off Time</span>
                </label>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Daily Basis Opening & Closing Hours</h4>
              </div>
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="grid grid-cols-3 items-center gap-6 p-4 bg-black/5 rounded-2xl">
                    <span className="text-xs font-bold text-black/60">{day} Time Slots</span>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/40 uppercase">Opening</label>
                      <input type="time" defaultValue={day === 'Sunday' ? '00:00' : (day === 'Saturday' ? '10:00' : '09:00')} className="w-full bg-white border-none rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-black/10" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/40 uppercase">Closing</label>
                      <input type="time" defaultValue={day === 'Sunday' ? '00:00' : (day === 'Saturday' ? '14:00' : '18:00')} className="w-full bg-white border-none rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-black/10" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'Store':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">General Setting</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Name *</label>
                  <input 
                    type="text" 
                    value={formData.store_name || ''}
                    onChange={(e) => setFormData({...formData, store_name: e.target.value})}
                    placeholder="Enter store name"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Slug *</label>
                  <input 
                    type="text" 
                    value={formData.store_slug || ''}
                    onChange={(e) => setFormData({...formData, store_slug: e.target.value})}
                    placeholder="your-store-slug"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Email</label>
                  <input 
                    type="email" 
                    value={formData.store_email || ''}
                    onChange={(e) => setFormData({...formData, store_email: e.target.value})}
                    placeholder="store@example.com"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/60">Store Phone</label>
                  <input 
                    type="text" 
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Store Brand Setup</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Logo ?</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-black/5 rounded-2xl flex items-center justify-center overflow-hidden border border-black/5">
                      {formData.store_logo ? (
                        <img src={formData.store_logo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-black/10" />
                      )}
                    </div>
                    <input 
                      type="text" 
                      value={formData.store_logo || ''}
                      onChange={(e) => setFormData({...formData, store_logo: e.target.value})}
                      placeholder="Logo URL"
                      className="flex-1 bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Banner Type</label>
                  <select 
                    value={formData.banner_type || 'static'}
                    onChange={(e) => setFormData({...formData, banner_type: e.target.value as any})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="static">Static Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Banner ?</label>
                  <input 
                    type="text" 
                    value={formData.store_banner || ''}
                    onChange={(e) => setFormData({...formData, store_banner: e.target.value})}
                    placeholder="Banner URL"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Mobile Banner ?</label>
                  <input 
                    type="text" 
                    value={formData.mobile_banner || ''}
                    onChange={(e) => setFormData({...formData, mobile_banner: e.target.value})}
                    placeholder="Mobile Banner URL"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store List Banner Type</label>
                  <select 
                    value={formData.list_banner_type || 'static'}
                    onChange={(e) => setFormData({...formData, list_banner_type: e.target.value as any})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="static">Static Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-xs font-bold text-black/60">Store List Banner ?</label>
                  <input 
                    type="text" 
                    value={formData.list_banner || ''}
                    onChange={(e) => setFormData({...formData, list_banner: e.target.value})}
                    placeholder="List Banner URL"
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-xs font-bold text-black/60">Shop Description ?</label>
                  <textarea 
                    value={formData.shop_description || ''}
                    onChange={(e) => setFormData({...formData, shop_description: e.target.value})}
                    placeholder="Write your description here..."
                    className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-32 resize-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Store Visibility Setup</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Store Name Position ?</label>
                  <select 
                    value={formData.name_position || 'header'}
                    onChange={(e) => setFormData({...formData, name_position: e.target.value as any})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  >
                    <option value="header">At Header</option>
                    <option value="banner">On Banner</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60">Products per page ?</label>
                  <input 
                    type="number" 
                    value={formData.products_per_page || 10}
                    onChange={(e) => setFormData({...formData, products_per_page: parseInt(e.target.value)})}
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Hide Email from Store', key: 'hide_email' },
                    { label: 'Hide Phone from Store', key: 'hide_phone' },
                    { label: 'Hide Address from Store', key: 'hide_address' },
                    { label: 'Hide Map from Store', key: 'hide_map' },
                    { label: 'Hide About from Store', key: 'hide_about' },
                    { label: 'Hide Policy from Store', key: 'hide_policy' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl cursor-pointer hover:bg-black/10 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={!!(formData as any)[item.key]}
                        onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                        className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                      />
                      <span className="text-xs font-bold text-black/60">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-black/40">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-bold uppercase tracking-widest">Under Development</p>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-2">
        {subTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveSubTab(tab.name)}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
              activeSubTab === tab.name 
              ? 'bg-black text-white shadow-lg shadow-black/10' 
              : 'text-black/40 hover:bg-black/5 hover:text-black'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white rounded-[32px] border border-black/5 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Profile Completeness</h4>
            <span className="text-sm font-bold">{completeness}%</span>
          </div>
          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mb-6">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              className="h-full bg-black"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest mr-2">Suggestions:</span>
            {[
              { label: 'Add Store Logo', field: 'store_logo' },
              { label: 'Add Store Banner', field: 'store_banner' },
              { label: 'Add Store Description', field: 'shop_description' },
              { label: 'Setup SEO', field: 'seo_title' }
            ].filter(s => !(formData as any)[s.field]).map(s => (
              <span key={s.label} className="text-[10px] font-bold bg-black/5 px-2 py-1 rounded-lg text-black/60">{s.label}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-black/5 shadow-sm p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold tracking-tight">{activeSubTab} Settings</h3>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Settings
            </button>
          </div>

          {renderSubContent()}
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ stats, products }: { stats: VendorStats | null, products: Product[] }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats?.revenue.toFixed(2) || '0.00'}`, icon: CreditCard, color: 'bg-emerald-500' },
          { label: 'Total Orders', value: stats?.orders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
          { label: 'Active Products', value: stats?.products || 0, icon: Package, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
            </div>
            <p className="text-sm font-medium text-black/40 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Recent Products</h3>
            <button className="text-xs font-bold text-black/40 uppercase tracking-widest hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 transition-colors group">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5">
                  <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{product.name}</h4>
                  <p className="text-xs text-black/40">{product.category_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
                  <p className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Sales Analytics</h3>
            <select className="bg-black/5 border-none rounded-lg text-xs font-bold py-1.5 px-3 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-black/5 rounded-t-lg group-hover:bg-black transition-all duration-300 cursor-pointer" 
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${h * 12}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyProductsView = ({ products, categories, onAddProduct, onAddCategory, onDelete, onEdit, onDuplicate }: { products: Product[], categories: Category[], onAddProduct: () => void, onAddCategory: () => void, onDelete: (id: number) => void, onEdit: (p: Product) => void, onDuplicate: (p: Product) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-white border border-black/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10 w-80 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={onAddCategory}
            className="flex items-center gap-2 bg-white border border-black/5 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
          <button 
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 text-[10px] font-bold text-black/40 uppercase tracking-widest">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-black/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                      <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{product.name}</p>
                      <p className="text-[10px] text-black/40 font-mono uppercase">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium bg-black/5 px-3 py-1 rounded-full text-black/60">
                    {product.category_name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
                  {product.wholesale_price && (
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">Wholesale: ${product.wholesale_price.toFixed(2)}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium">{product.stock} units</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60 hover:text-black"
                      title="View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60 hover:text-black"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDuplicate(product)}
                      className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60 hover:text-black"
                      title="Duplicate"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60 hover:text-amber-500"
                      title="Featured Mark"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(product.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-black/60 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddCategoryModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Add Category</h2>
              <p className="text-black/40 text-sm">Create a new department for your products.</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Category Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Smart Home"
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Image URL</label>
              <div className="flex gap-4">
                <input 
                  required
                  type="url" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/cat.jpg"
                  className="flex-1 bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10"
                />
                <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-black/20" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-black/5 text-black py-4 rounded-2xl font-bold hover:bg-black/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={isSubmitting}
              type="submit"
              className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VendorPortal;
