import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Plus, 
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  UserPlus,
  Truck,
  RotateCcw,
  Percent,
  Ticket,
  MessageSquare,
  Layout,
  Star,
  Megaphone,
  FileCode,
  CreditCard,
  Ban,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Edit,
  Building2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ExchangeManagement from './ExchangeManagement';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, trend, icon }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-black/5 rounded-lg">
        {icon}
      </div>
      <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {change}
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const salesData = [
  { name: 'Mon', sales: 4500, orders: 45 },
  { name: 'Tue', sales: 6000, orders: 60 },
  { name: 'Wed', sales: 4000, orders: 40 },
  { name: 'Thu', sales: 8000, orders: 80 },
  { name: 'Fri', sales: 5500, orders: 55 },
  { name: 'Sat', sales: 9000, orders: 90 },
  { name: 'Sun', sales: 7000, orders: 70 },
];

const categoryData = [
  { name: 'Electronics', value: 400, color: '#000000' },
  { name: 'Fashion', value: 300, color: '#4F46E5' },
  { name: 'Home', value: 300, color: '#10B981' },
  { name: 'Beauty', value: 200, color: '#F59E0B' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    button_text: '',
    button_link: '',
    is_active: true
  });
  const [vendors, setVendors] = useState<any[]>([
    { id: 1, name: 'SolarTech Pro', store: 'Solar Solutions', status: 'active', commission: 10, tier: 'Premium', performance: 4.8, joined: '2024-01-15' },
    { id: 2, name: 'EcoHome', store: 'Eco Living', status: 'pending', commission: 12, tier: 'Basic', performance: 0, joined: '2024-03-01' },
    { id: 3, name: 'PowerMax', store: 'Power Systems', status: 'suspended', commission: 15, tier: 'Enterprise', performance: 4.2, joined: '2023-11-20' },
  ]);
  const [stats, setStats] = useState<any>({
    revenue: 125430,
    orders: 1240,
    products: 450,
    users: 890,
    activeVendors: 45,
    pendingPayouts: 12400,
    refundRequests: 8,
    commissionEarned: 15600
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchProducts();
    fetchOrders();
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error('Failed to fetch banners');
    }
  };

  const handleSaveBanner = async () => {
    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerForm)
      });
      if (res.ok) {
        fetchBanners();
        setIsBannerModalOpen(false);
        setEditingBanner(null);
        setBannerForm({ title: '', subtitle: '', image: '', button_text: '', button_link: '', is_active: true });
      }
    } catch (err) {
      console.error('Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBanners();
    } catch (err) {
      console.error('Failed to delete banner');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${(stats.revenue || 0).toLocaleString()}`} 
          change="+12.5%" 
          trend="up" 
          icon={<BarChart3 className="w-5 h-5 text-gray-700" />} 
        />
        <StatCard 
          title="Active Vendors" 
          value={stats.activeVendors || 0} 
          change="+4.2%" 
          trend="up" 
          icon={<Truck className="w-5 h-5 text-gray-700" />} 
        />
        <StatCard 
          title="Commission Earned" 
          value={`$${(stats.commissionEarned || 0).toLocaleString()}`} 
          change="+15.4%" 
          trend="up" 
          icon={<Percent className="w-5 h-5 text-gray-700" />} 
        />
        <StatCard 
          title="Pending Payouts" 
          value={`$${(stats.pendingPayouts || 0).toLocaleString()}`} 
          change="-2.1%" 
          trend="down" 
          icon={<CreditCard className="w-5 h-5 text-gray-700" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Sales Analytics</h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#000000" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
            <button className="text-sm font-medium text-gray-500 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Solar Panel 300W', sales: 124, revenue: '$12,400', trend: '+12%' },
              { name: 'Smart Hub Pro', sales: 98, revenue: '$8,820', trend: '+8%' },
              { name: 'Eco Battery Pack', sales: 85, revenue: '$17,000', trend: '+15%' },
              { name: 'Wireless Camera', sales: 72, revenue: '$5,040', trend: '-2%' },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg border border-black/5 flex items-center justify-center font-bold text-gray-400">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                  <p className={`text-[10px] font-bold ${product.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {product.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Selling Vendors</h3>
            <button className="text-sm font-medium text-gray-500 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {vendors.slice(0, 4).map((v, i) => (
              <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg border border-black/5 flex items-center justify-center font-bold text-gray-400">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{v.store}</p>
                    <p className="text-xs text-gray-500">{v.tier} Tier</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">$45,200</p>
                  <div className="flex gap-0.5 justify-end">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-2 h-2 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">New Users</h3>
            <button className="text-sm font-medium text-gray-500 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-black/5 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    user.role === 'vendor' ? 'bg-indigo-100 text-indigo-700' : 
                    user.role === 'wholesaler' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-bottom border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-gray-900">User Management</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 w-full"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-colors">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Loyalty</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    user.role === 'vendor' ? 'bg-indigo-100 text-indigo-700' : 
                    user.role === 'wholesaler' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.loyalty_balance || 0} pts
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Product Inventory</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-colors">
            Bulk Approval
          </button>
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-black/5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.vendor_name || 'Nexus Store'}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.stock} in stock
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    product.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {product.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"><XCircle className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Pending Returns</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Avg. Order Value</p>
          <p className="text-2xl font-bold">$142.50</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Split Orders</p>
          <p className="text-2xl font-bold">45</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Order Management</h3>
          <div className="flex gap-2">
            <select className="text-sm border-none bg-gray-50 rounded-xl px-4 py-2 outline-none">
              <option>Filter by Vendor</option>
              {vendors.map(v => <option key={v.id}>{v.store}</option>)}
            </select>
            <select className="text-sm border-none bg-gray-50 rounded-xl px-4 py-2 outline-none">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Refunded</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Commission</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold">#{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.customer_name || 'Guest'}</td>
                  <td className="px-6 py-4 text-sm">{order.vendor_name || 'Nexus'}</td>
                  <td className="px-6 py-4 text-sm font-bold">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-bold">${(order.total * 0.1).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Update Status"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" title="Refund"><RotateCcw className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVendors = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Pending Approvals</p>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">KYC Verified</p>
          <p className="text-2xl font-bold">38/45</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Premium Tier</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Avg. Rating</p>
          <p className="text-2xl font-bold">4.6</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Vendor Management</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium">Onboarding Checklist</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Vendor / Store</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Commission</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{v.store}</p>
                        <p className="text-xs text-gray-500">{v.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      v.tier === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 
                      v.tier === 'Premium' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>{v.tier}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{v.commission}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold">{v.performance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      v.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      v.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Approve"><CheckCircle2 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" title="Suspend"><Ban className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors" title="View Profile"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors"><MessageSquare className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCommission = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Global Commission</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Rate (%)</label>
              <div className="flex gap-4">
                <input type="number" defaultValue={10} className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 outline-none" />
                <button className="px-6 py-3 bg-black text-white rounded-xl font-bold">Update</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Payout Scheduler</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold">Auto-Payout</p>
                  <p className="text-xs text-gray-500">Every 15th of month</p>
                </div>
              </div>
              <button className="text-xs font-bold text-indigo-600">Change</button>
            </div>
            <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
              Process Manual Payouts
            </button>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tax & GST</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">GST Deduction</span>
              <span className="text-sm font-bold">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">TDS</span>
              <span className="text-sm font-bold">1%</span>
            </div>
            <button className="w-full py-3 border border-black/5 rounded-xl text-sm font-bold hover:bg-gray-50">Generate GST Reports</button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5">
          <h3 className="text-lg font-bold text-gray-900">Category-wise Commission</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Electronics', 'Fashion', 'Home', 'Beauty'].map(cat => (
            <div key={cat} className="p-4 bg-gray-50 rounded-xl border border-black/5">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{cat}</p>
              <div className="flex items-center gap-2">
                <input type="number" defaultValue={12} className="w-16 bg-white border border-black/5 rounded-lg px-2 py-1 text-sm font-bold" />
                <span className="text-sm font-bold">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const [platformSettings, setPlatformSettings] = useState({
    enable_upsell_product_page: true,
    enable_cross_sell_product_page: true,
    enable_cross_sell_cart_page: true,
    enable_cross_sell_checkout_page: true,
    recommendation_limit: 4
  });

  useEffect(() => {
    fetch('/api/platform-settings')
      .then(res => res.json())
      .then(data => {
        if (data) setPlatformSettings(data);
      });
  }, []);

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      const res = await fetch('/api/platform-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        setPlatformSettings(newSettings);
        alert('Settings updated successfully');
      }
    } catch (err) {
      console.error('Failed to update settings');
    }
  };

  const renderMarketing = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ... existing stat cards ... */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Ticket className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold">Coupons</h4>
          </div>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold">Flash Sales</h4>
          </div>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold">Campaigns</h4>
          </div>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold">Referrals</h4>
          </div>
          <p className="text-2xl font-bold">156</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Product Recommendations</h3>
            <p className="text-sm text-gray-500">Configure upsells and cross-sells across the platform</p>
          </div>
          <button 
            onClick={() => handleUpdateSettings(platformSettings)}
            className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Save Changes
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-50 rounded-2xl border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Product Page Upsells</span>
              <button 
                onClick={() => setPlatformSettings({...platformSettings, enable_upsell_product_page: !platformSettings.enable_upsell_product_page})}
                className={`w-10 h-5 rounded-full relative transition-colors ${platformSettings.enable_upsell_product_page ? 'bg-black' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${platformSettings.enable_upsell_product_page ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-500">Show "You Might Also Like" on product details</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Product Page Cross-sells</span>
              <button 
                onClick={() => setPlatformSettings({...platformSettings, enable_cross_sell_product_page: !platformSettings.enable_cross_sell_product_page})}
                className={`w-10 h-5 rounded-full relative transition-colors ${platformSettings.enable_cross_sell_product_page ? 'bg-black' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${platformSettings.enable_cross_sell_product_page ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-500">Show "Frequently Bought Together" on product details</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Cart Page Cross-sells</span>
              <button 
                onClick={() => setPlatformSettings({...platformSettings, enable_cross_sell_cart_page: !platformSettings.enable_cross_sell_cart_page})}
                className={`w-10 h-5 rounded-full relative transition-colors ${platformSettings.enable_cross_sell_cart_page ? 'bg-black' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${platformSettings.enable_cross_sell_cart_page ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-500">Show recommendations in shopping cart</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Checkout Cross-sells</span>
              <button 
                onClick={() => setPlatformSettings({...platformSettings, enable_cross_sell_checkout_page: !platformSettings.enable_cross_sell_checkout_page})}
                className={`w-10 h-5 rounded-full relative transition-colors ${platformSettings.enable_cross_sell_checkout_page ? 'bg-black' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${platformSettings.enable_cross_sell_checkout_page ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-500">Show recommendations during checkout</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-black/5">
          <label className="block text-sm font-bold mb-2">Recommendation Limit</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" 
              max="12" 
              value={platformSettings.recommendation_limit}
              onChange={(e) => setPlatformSettings({...platformSettings, recommendation_limit: parseInt(e.target.value)})}
              className="flex-1 accent-black" 
            />
            <span className="w-12 text-center font-bold bg-black text-white rounded-lg py-1">{platformSettings.recommendation_limit}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ... existing banner and newsletter sections ... */}
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Banner Management</h3>
          <div className="space-y-4">
            {banners.map(banner => (
              <div key={banner.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-black/5">
                <div className="w-20 h-12 bg-white rounded-lg border border-black/5 overflow-hidden">
                  <img src={banner.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{banner.title}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingBanner(banner);
                      setBannerForm({
                        title: banner.title || '',
                        subtitle: banner.subtitle || '',
                        image: banner.image || '',
                        button_text: banner.button_text || '',
                        button_link: banner.button_link || '',
                        is_active: !!banner.is_active
                      });
                      setIsBannerModalOpen(true);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => {
                setEditingBanner(null);
                setBannerForm({ title: '', subtitle: '', image: '', button_text: '', button_link: '', is_active: true });
                setIsBannerModalOpen(true);
              }}
              className="w-full py-4 border-2 border-dashed border-black/5 rounded-xl text-sm font-bold text-gray-400 hover:border-black/10 hover:text-black transition-all"
            >
              + Add New Banner
            </button>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Newsletter & Push</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send Push Notification</label>
              <textarea placeholder="Notification message..." className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm min-h-[100px]" />
              <button className="mt-4 w-full py-3 bg-black text-white rounded-xl font-bold">Send to All Users</button>
            </div>
            <div className="pt-6 border-t border-black/5">
              <button className="w-full py-3 border border-black/5 rounded-xl text-sm font-bold hover:bg-gray-50">Manage Newsletter Subscribers</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Support Command Center</h3>
        <div className="flex gap-2">
          <select className="text-sm border-none bg-gray-50 rounded-xl px-4 py-2 outline-none">
            <option>All Tickets</option>
            <option>Customer Tickets</option>
            <option>Vendor Tickets</option>
          </select>
          <select className="text-sm border-none bg-gray-50 rounded-xl px-4 py-2 outline-none">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">User Type</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {[
              { id: 'TK-1024', subject: 'Payment Failed', type: 'Customer', assigned: 'Sarah K.', priority: 'High', status: 'Open' },
              { id: 'TK-1025', subject: 'Verification Issue', type: 'Vendor', assigned: 'Mike R.', priority: 'Medium', status: 'In Progress' },
              { id: 'TK-1026', subject: 'Refund Request', type: 'Customer', assigned: 'Unassigned', priority: 'High', status: 'Open' },
            ].map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold">{ticket.id}</td>
                <td className="px-6 py-4 text-sm">{ticket.subject}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ticket.type === 'Vendor' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {ticket.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{ticket.assigned}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ticket.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-bold text-indigo-600 hover:underline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCMS = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Homepage Builder</h3>
          <div className="space-y-4">
            {['Hero Slider', 'Featured Categories', 'Flash Sale Section', 'Best Sellers Grid', 'Wholesale Banner'].map(section => (
              <div key={section} className="p-4 bg-gray-50 rounded-xl border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-bold">{section}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><ArrowUpRight className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Global CMS Settings</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 bg-gray-50 rounded-2xl border border-black/5 hover:bg-gray-100 transition-colors text-center">
                <FileCode className="w-6 h-6 mx-auto mb-3 text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Blog Posts</span>
              </button>
              <button className="p-6 bg-gray-50 rounded-2xl border border-black/5 hover:bg-gray-100 transition-colors text-center">
                <MessageSquare className="w-6 h-6 mx-auto mb-3 text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-widest">FAQ</span>
              </button>
            </div>
            <div className="space-y-4 pt-6 border-t border-black/5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Custom Header Code</label>
                <textarea className="w-full bg-zinc-900 text-emerald-400 font-mono text-xs p-4 rounded-xl min-h-[80px]" defaultValue="<script>/* Analytics */</script>" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Custom Footer Code</label>
                <textarea className="w-full bg-zinc-900 text-emerald-400 font-mono text-xs p-4 rounded-xl min-h-[80px]" defaultValue="<!-- Custom CSS -->" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Customer Management</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-64" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Orders</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4">Loyalty Pts</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.filter(u => u.role === 'customer').map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">12 Orders</td>
                <td className="px-6 py-4 text-sm font-bold">$1,240.00</td>
                <td className="px-6 py-4 text-sm">{u.loyalty_balance || 450}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Clock className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"><Ban className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Review Moderation</h3>
        <div className="flex gap-2">
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> 3 Reported Reviews
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {[
              { id: 1, product: 'Solar Panel', customer: 'John D.', rating: 5, comment: 'Excellent quality!', status: 'approved' },
              { id: 2, product: 'Smart Hub', customer: 'Sarah M.', rating: 1, comment: 'Fake product, do not buy!', status: 'reported' },
              { id: 3, product: 'Eco Battery', customer: 'Mike R.', rating: 4, comment: 'Good value for money.', status: 'pending' },
            ].map(review => (
              <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold">{review.product}</td>
                <td className="px-6 py-4 text-sm">{review.customer}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{review.comment}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                    review.status === 'reported' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">General Platform Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Marketplace Name</label>
              <input type="text" defaultValue="Nexus Marketplace" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Support Email</label>
              <input type="email" defaultValue="support@nexus.com" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-bold">Maintenance Mode</p>
                <p className="text-xs text-gray-500">Disable marketplace for all users</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Security & Authentication</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-bold">Two-Factor Auth</p>
                <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
              </div>
              <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Session Timeout (Minutes)</label>
              <input type="number" defaultValue={60} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">API & Integrations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg border border-black/5 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Stripe Integration</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Connected</p>
                </div>
              </div>
              <button className="text-xs font-bold text-gray-400 hover:text-black">Configure</button>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg border border-black/5 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">ShipStation API</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Connected</p>
                </div>
              </div>
              <button className="text-xs font-bold text-gray-400 hover:text-black">Configure</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">System Logs</h3>
          <div className="space-y-3">
            {[
              { event: 'Admin Login', user: 'admin@nexus.com', time: '2 mins ago' },
              { event: 'Settings Updated', user: 'admin@nexus.com', time: '1 hour ago' },
              { event: 'New Vendor Approved', user: 'system', time: '3 hours ago' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-900">{log.event}</span>
                <span className="text-gray-400">{log.time}</span>
              </div>
            ))}
            <button className="w-full mt-4 py-3 border border-black/5 rounded-xl text-xs font-bold hover:bg-gray-50">View All System Logs</button>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:bg-zinc-900 transition-all">
          Save Global Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-black/5 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Nexus Admin</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg lg:hidden"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'orders', icon: ShoppingCart, label: 'Orders' },
              { id: 'vendors', icon: Truck, label: 'Vendors' },
              { id: 'commission', icon: Percent, label: 'Commission' },
              { id: 'marketing', icon: Megaphone, label: 'Marketing' },
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'support', icon: MessageSquare, label: 'Support & Tickets' },
              { id: 'reviews', icon: Star, label: 'Reviews & Ratings' },
              { id: 'cms', icon: Layout, label: 'CMS & Builder' },
              { id: 'exchange', icon: RotateCcw, label: 'Exchange System' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-black/5">
            <button 
              onClick={() => {
                setActiveTab('settings');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-black/5 rounded-lg lg:hidden"
            >
              <Layout className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden sm:block p-2 text-gray-400 hover:text-black transition-colors">
              <Clock className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-black/5" />
          </div>
        </header>

        <main className="p-4 sm:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'vendors' && renderVendors()}
              {activeTab === 'commission' && renderCommission()}
              {activeTab === 'marketing' && renderMarketing()}
              {activeTab === 'support' && renderSupport()}
              {activeTab === 'cms' && renderCMS()}
              {activeTab === 'customers' && renderCustomers()}
              {activeTab === 'reviews' && renderReviews()}
              {activeTab === 'settings' && renderSettings()}
              {activeTab === 'exchange' && <ExchangeManagement />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h3>
                  <button onClick={() => setIsBannerModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Banner Image URL</label>
                    <input 
                      type="text" 
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Title</label>
                      <input 
                        type="text" 
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Subtitle</label>
                      <input 
                        type="text" 
                        value={bannerForm.subtitle}
                        onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Button Text</label>
                      <input 
                        type="text" 
                        value={bannerForm.button_text}
                        onChange={(e) => setBannerForm({...bannerForm, button_text: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Button Link</label>
                      <input 
                        type="text" 
                        value={bannerForm.button_link}
                        onChange={(e) => setBannerForm({...bannerForm, button_link: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none text-sm" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Active Status</p>
                      <p className="text-xs text-gray-500">Enable or disable this banner</p>
                    </div>
                    <button 
                      onClick={() => setBannerForm({...bannerForm, is_active: !bannerForm.is_active})}
                      className={`w-12 h-6 rounded-full relative transition-colors ${bannerForm.is_active ? 'bg-black' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${bannerForm.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={() => setIsBannerModalOpen(false)}
                    className="flex-1 py-4 border border-black/5 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveBanner}
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
                  >
                    {editingBanner ? 'Save Changes' : 'Add Banner'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
