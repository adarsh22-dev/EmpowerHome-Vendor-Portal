import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Package, 
  CreditCard, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShoppingCart,
  Truck,
  Percent,
  Download,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { Order, User } from '../../types';

import WholesalerBulkOrder from './WholesalerBulkOrder';

const WholesalerDashboard = ({ user, onLogout, onNavigate }: { user: User, onLogout: () => void, onNavigate: (v: string, id?: number) => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [specialPricing, setSpecialPricing] = useState([
    { id: 1, product: 'Solar Panel 300W', regular: 299, wholesale: 249, minQty: 10 },
    { id: 2, product: 'Smart Thermostat Pro', regular: 199, wholesale: 159, minQty: 5 },
    { id: 3, product: 'Lithium Battery 100Ah', regular: 899, wholesale: 749, minQty: 2 }
  ]);
  const [ledger, setLedger] = useState([
    { id: 1, date: '2024-02-15', description: 'Order #ORD-101', amount: -2490, balance: 47510 },
    { id: 2, date: '2024-02-10', description: 'Payment Received', amount: 5000, balance: 50000 },
    { id: 3, date: '2024-01-20', description: 'Credit Limit Approved', amount: 50000, balance: 50000 }
  ]);

  const fetchOrders = () => {
    fetch('/api/orders').then(res => res.json()).then(setOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'bulk-order', label: 'Bulk Order', icon: ShoppingCart },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'pricing', label: 'Special Pricing', icon: Percent },
    { id: 'ledger', label: 'Account Ledger', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-black/5 p-6 flex flex-col gap-8 transition-transform duration-300 ease-in-out flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm leading-none truncate max-w-[120px]">{user.name}</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">Wholesaler</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-black/5 rounded-lg md:hidden"
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-indigo-50 text-black/60'}`}
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
      <main className="flex-1 min-w-0 overflow-y-auto bg-zinc-50">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-black/5 px-4 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-black/5 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label || 'Overview'}
            </span>
          </div>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">{user.name.charAt(0)}</div>
        </header>

        <div className="p-4 sm:p-8 lg:p-12">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8 sm:space-y-12"
          >
            {activeTab === 'overview' && (
              <>
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Business Portal</h1>
                    <p className="text-black/50 text-sm sm:text-base">Manage your bulk purchases and wholesale account.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('bulk-order')}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Quick Bulk Order
                  </button>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: 'Credit Limit', value: '$50,000', icon: CreditCard },
                    { label: 'Available Credit', value: '$32,450', icon: TrendingUp },
                    { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: Clock },
                    { label: 'Total Volume', value: '$124,000', icon: TrendingUp },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm">
                      <p className="text-[8px] sm:text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <section className="bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-black/5 flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-bold">Recent Shipments</h2>
                      <button onClick={() => setActiveTab('orders')} className="text-xs sm:text-sm font-bold text-indigo-600 underline">Track All</button>
                    </div>
                    <div className="p-6 sm:p-8 space-y-6">
                    {orders.filter(o => o.status === 'shipping').length === 0 ? (
                      <p className="text-center text-black/40 py-4">No active shipments.</p>
                    ) : (
                      orders.filter(o => o.status === 'shipping').map(order => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">#ORD-{order.id}</p>
                              <p className="text-xs text-black/40">Expected in 2 days</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">In Transit</span>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-black/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Account Documents</h2>
                    <button className="text-sm font-bold text-indigo-600 underline">View All</button>
                  </div>
                  <div className="p-8 space-y-6">
                    {[
                      { name: 'Invoice_Feb_2024.pdf', date: 'Feb 12, 2024' },
                      { name: 'Wholesale_Agreement.pdf', date: 'Jan 01, 2024' },
                      { name: 'Tax_Exemption_Cert.pdf', date: 'Dec 15, 2023' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-black/40">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{doc.name}</p>
                            <p className="text-xs text-black/40">{doc.date}</p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-zinc-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-black/40" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTab === 'bulk-order' && (
            <WholesalerBulkOrder onOrderComplete={() => { setActiveTab('orders'); fetchOrders(); }} />
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Order History</h2>
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-zinc-50 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 sm:px-8 py-4">Order ID</th>
                        <th className="px-6 sm:px-8 py-4">Date</th>
                        <th className="px-6 sm:px-8 py-4">Total</th>
                        <th className="px-6 sm:px-8 py-4">Status</th>
                        <th className="px-6 sm:px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-12 text-center text-black/40">No orders found.</td>
                        </tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-6 sm:px-8 py-4 font-medium">#ORD-{order.id}</td>
                            <td className="px-6 sm:px-8 py-4 text-sm text-black/60">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-6 sm:px-8 py-4 font-bold">${(order.total || 0).toFixed(2)}</td>
                            <td className="px-6 sm:px-8 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-indigo-100 text-indigo-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 sm:px-8 py-4 text-right">
                              <button className="text-indigo-600 font-bold text-sm hover:underline">View Details</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Special Wholesale Pricing</h2>
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-zinc-50 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 sm:px-8 py-4">Product</th>
                        <th className="px-6 sm:px-8 py-4">Regular Price</th>
                        <th className="px-6 sm:px-8 py-4">Your Price</th>
                        <th className="px-6 sm:px-8 py-4">Min Qty</th>
                        <th className="px-6 sm:px-8 py-4 text-right">Savings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {specialPricing.map(item => (
                        <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 sm:px-8 py-6 font-bold text-sm">{item.product}</td>
                          <td className="px-6 sm:px-8 py-6 text-sm text-black/40 line-through">${item.regular.toFixed(2)}</td>
                          <td className="px-6 sm:px-8 py-6 font-bold text-indigo-600">${item.wholesale.toFixed(2)}</td>
                          <td className="px-6 sm:px-8 py-6 text-sm">{item.minQty} units</td>
                          <td className="px-6 sm:px-8 py-6 text-right font-bold text-green-600">
                            {Math.round((1 - item.wholesale / item.regular) * 100)}% Off
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Account Ledger</h2>
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-zinc-50 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 sm:px-8 py-4">Date</th>
                        <th className="px-6 sm:px-8 py-4">Description</th>
                        <th className="px-6 sm:px-8 py-4">Amount</th>
                        <th className="px-6 sm:px-8 py-4 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {ledger.map(entry => (
                        <tr key={entry.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 sm:px-8 py-6 text-sm text-black/60">{new Date(entry.date).toLocaleDateString()}</td>
                          <td className="px-6 sm:px-8 py-6 font-medium text-sm">{entry.description}</td>
                          <td className={`px-6 sm:px-8 py-6 font-bold ${entry.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {entry.amount < 0 ? '-' : '+'}${Math.abs(entry.amount).toFixed(2)}
                          </td>
                          <td className="px-6 sm:px-8 py-6 text-right font-bold">${entry.balance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <header>
                <h2 className="text-2xl sm:text-3xl font-bold">Account Settings</h2>
                <p className="text-black/50 text-sm sm:text-base">Manage your business profile and wholesale preferences.</p>
              </header>

              <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Company Name</label>
                      <input type="text" defaultValue="Nexus Wholesale Solutions" className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Tax ID / VAT Number</label>
                      <input type="text" defaultValue="TX-992834-B" className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Business Email</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Phone Number</label>
                      <input type="text" defaultValue="+1 (555) 000-1234" className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-black/5">
                    <h3 className="font-bold mb-4">Wholesale Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-black/70">Receive bulk order availability notifications</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-black/70">Enable one-click reordering for frequent items</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-black/70">Auto-generate monthly purchase reports</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-black/5 flex justify-end gap-4">
                    <button className="px-6 py-3 rounded-xl font-bold text-sm text-black/40 hover:bg-black/5 transition-all">
                      Cancel
                    </button>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['other_tab'].includes(activeTab) && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase">{activeTab}</h2>
              <p className="text-black/40 max-w-xs">Wholesale specific features are being optimized for your account.</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  </div>
  );
};

export default WholesalerDashboard;
