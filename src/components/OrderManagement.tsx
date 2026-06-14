import React, { useState } from 'react';
import { 
  ShoppingCart, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  ChevronRight, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  ArrowUpRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) || 
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && order.status?.toLowerCase() === activeTab.toLowerCase();
  });

  const tabs = [
    { name: 'All Orders', id: 'all' },
    { name: 'Pending', id: 'pending' },
    { name: 'Processing', id: 'processing' },
    { name: 'Shipped', id: 'shipped' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
          <p className="text-black/40 text-sm mt-1">Track and fulfill your customer orders efficiently</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10">
            <Download className="w-4 h-4" /> Export Orders
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="flex border-b border-black/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-5 text-sm font-bold transition-all relative ${
                activeTab === tab.id ? 'text-black' : 'text-black/40 hover:text-black'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <motion.div layoutId="order-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative min-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search by Order ID or customer name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
            <button className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Order ID</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Customer Name</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Date</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Total Amount</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Current Location</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Estimated Delivery</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Fulfillment Status</th>
                <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-black/40">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                    <td className="py-5 px-8 text-sm font-bold">#{order.id}</td>
                    <td className="py-5 px-8 text-sm text-black/60">{order.customer_name}</td>
                    <td className="py-5 px-8 text-sm text-black/40">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-5 px-8 text-sm font-bold">₹{order.total_amount?.toLocaleString()}</td>
                    <td className="py-5 px-8 text-sm text-black/60 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-black/30" />
                      {order.shipping_address ? JSON.parse(order.shipping_address).city : 'N/A'}
                    </td>
                    <td className="py-5 px-8 text-sm text-black/40">
                      {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'TBD'}
                    </td>
                    <td className="py-5 px-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Shipped' ? 'bg-emerald-500 text-white' : 
                        order.status === 'Processing' ? 'bg-blue-500 text-white' : 
                        'bg-amber-500 text-white'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
