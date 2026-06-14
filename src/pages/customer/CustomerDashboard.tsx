import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  User, 
  Heart, 
  Bell, 
  ChevronRight, 
  Clock, 
  CreditCard,
  Settings,
  LogOut,
  Truck,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Order, Product, User as UserType } from '../../types';

const CustomerDashboard = ({ user, onLogout, onNavigate }: { user: UserType, onLogout: () => void, onNavigate: (v: string, id?: number) => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Billing', name: 'John Doe', address: '123 Main St, New York, NY 10001', phone: '+1 234 567 890', isDefault: true },
    { id: 2, type: 'Shipping', name: 'John Doe', address: '456 Park Ave, Brooklyn, NY 11201', phone: '+1 234 567 890', isDefault: true }
  ]);

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(setOrders);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm leading-none">{user.name}</p>
            <p className="text-[10px] text-black/40 uppercase tracking-widest mt-1">Customer</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-black text-white shadow-lg' : 'hover:bg-black/5 text-black/60'}`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-auto"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-12"
        >
          {activeTab === 'overview' && (
            <>
              <header>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-black/50 text-sm sm:text-base">Manage your orders, tracking, and account preferences.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Orders', value: orders.length, icon: Package },
                  { label: 'Active Shipments', value: orders.filter(o => o.status === 'shipping').length, icon: Truck },
                  { label: 'Wishlist Items', value: '12', icon: Heart },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center mb-4">
                      <stat.icon className="w-5 h-5 text-black/60" />
                    </div>
                    <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <section className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-black/5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-sm font-bold underline">View All</button>
                </div>
                <div className="divide-y divide-black/5">
                  {orders.length === 0 ? (
                    <div className="p-12 text-center text-black/40">No orders found.</div>
                  ) : (
                    orders.slice(0, 3).map(order => (
                      <div key={order.id} className="p-8 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-black/20" />
                          </div>
                          <div>
                            <p className="font-bold">Order #ORD-{order.id}</p>
                            <p className="text-sm text-black/40">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-black/40">{order.items.length} items</p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            order.status === 'shipping' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-700'
                          }`}>
                            {order.status}
                          </span>
                          <ChevronRight className="w-5 h-5 text-black/20" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}

          {activeTab === 'orders' && (
            <section className="space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Orders</h1>
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 text-[10px] font-bold text-black/40 uppercase tracking-widest border-b border-black/5">
                    <tr>
                      <th className="px-8 py-4">Order</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Total</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-8 py-6 font-bold text-sm">#ORD-{order.id}</td>
                        <td className="px-8 py-6 text-sm text-black/60">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            order.status === 'shipping' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-sm">${order.total.toFixed(2)}</td>
                        <td className="px-8 py-6 text-right">
                          <button className="text-xs font-bold underline hover:text-black/60 transition-colors">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'addresses' && (
            <section className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Addresses</h1>
                <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full">{addr.type}</span>
                      {addr.isDefault && <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Default</span>}
                    </div>
                    <div>
                      <p className="font-bold">{addr.name}</p>
                      <p className="text-sm text-black/50 leading-relaxed">{addr.address}</p>
                      <p className="text-sm text-black/50 mt-2">{addr.phone}</p>
                    </div>
                    <div className="pt-4 border-t border-black/5 flex gap-4">
                      <button className="text-xs font-bold underline">Edit</button>
                      <button className="text-xs font-bold text-red-500 underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Account Settings</h1>
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Full Name</label>
                      <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Email Address</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5" />
                    </div>
                  </div>
                  <div className="pt-8 border-t border-black/5">
                    <h3 className="font-bold mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input type="password" placeholder="Current Password" className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5" />
                      <input type="password" placeholder="New Password" className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5" />
                      <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5" />
                    </div>
                  </div>
                  <div className="pt-8 border-t border-black/5 flex justify-end">
                    <button className="bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-zinc-800 transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'wishlist' && (
            <section className="space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Wishlist</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 1, name: 'Solar Panel 300W', price: 299.00, image: 'https://picsum.photos/seed/solar/400/400', stock: 'In Stock' },
                  { id: 2, name: 'Smart Thermostat', price: 199.00, image: 'https://picsum.photos/seed/thermo/400/400', stock: 'Low Stock' },
                  { id: 3, name: 'Eco Battery Pack', price: 899.00, image: 'https://picsum.photos/seed/battery/400/400', stock: 'In Stock' },
                ].map(item => (
                  <div key={item.id} className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden group">
                    <div className="aspect-square relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-rose-500 hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${item.stock === 'In Stock' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {item.stock}
                      </p>
                      <button className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'payment' && (
            <section className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Payment Methods</h1>
                <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" /> Add New Card
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true, brand: 'https://picsum.photos/seed/visa/40/25' },
                  { id: 2, type: 'Mastercard', last4: '8888', expiry: '08/25', isDefault: false, brand: 'https://picsum.photos/seed/mc/40/25' }
                ].map(card => (
                  <div key={card.id} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <img src={card.brand} alt={card.type} className="h-6 object-contain" referrerPolicy="no-referrer" />
                      {card.isDefault && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Default</span>}
                    </div>
                    <div>
                      <p className="text-lg font-mono tracking-widest text-black/60">•••• •••• •••• {card.last4}</p>
                      <div className="flex gap-8 mt-4">
                        <div>
                          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Expires</p>
                          <p className="text-sm font-bold">{card.expiry}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Card Holder</p>
                          <p className="text-sm font-bold">{user.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-black/5 flex gap-4">
                      <button className="text-xs font-bold underline">Edit</button>
                      <button className="text-xs font-bold text-red-500 underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Placeholder for other tabs */}
          {['other_tab'].includes(activeTab) && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-black/20" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase">{activeTab}</h2>
              <p className="text-black/40 max-w-xs">This section is currently being updated to provide a better experience.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
