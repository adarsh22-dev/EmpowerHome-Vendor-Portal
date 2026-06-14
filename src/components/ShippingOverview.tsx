import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Package,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { motion } from 'motion/react';

const ShippingOverview = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Shipments', value: '1,284', sub: '+12.5%', icon: Truck, color: 'bg-blue-500' },
    { label: 'Pending Pickup', value: '42', sub: 'Active', icon: Clock, color: 'bg-amber-500' },
    { label: 'In Transit', value: '156', sub: 'On Time', icon: Navigation, color: 'bg-emerald-500' },
    { label: 'Delayed Shipments', value: '8', sub: 'Critical', icon: AlertCircle, color: 'bg-rose-500' },
  ];

  const shipments = [
    { id: 'ORD-826041', customer: 'John Doe', carrier: 'FedEx', status: 'In Transit', date: '2025-10-10', delivery: '2025-10-15' },
    { id: 'ORD-826189', customer: 'Jane Smith', carrier: 'UPS', status: 'Delivered', date: '2025-11-15', delivery: '2025-11-20' },
    { id: 'ORD-826478', customer: 'Bob Johnson', carrier: 'DHL', status: 'Pending', date: '2026-01-20', delivery: '2026-01-25' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shipping Overview</h2>
          <p className="text-black/40 text-sm mt-1">Manage your logistics pipeline and track vendor shipments in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10">
            <Plus className="w-4 h-4" /> Ship Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                stat.sub === 'Critical' ? 'text-rose-500' : 'text-emerald-500'
              }`}>
                {stat.sub}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-bold">Shipment Tracking</h3>
          <div className="flex flex-wrap gap-4">
            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search Order ID or customer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>
            <select className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold">
              <option>All Carriers</option>
              <option>FedEx</option>
              <option>UPS</option>
              <option>DHL</option>
            </select>
            <select className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Delayed</option>
            </select>
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
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Customer</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Carrier</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Shipping Date</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Est. Delivery</th>
                <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((ship, i) => (
                <tr key={i} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                  <td className="py-5 px-8 text-sm font-bold">{ship.id}</td>
                  <td className="py-5 px-8 text-sm text-black/60">{ship.customer}</td>
                  <td className="py-5 px-8 text-sm font-bold">{ship.carrier}</td>
                  <td className="py-5 px-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ship.status === 'Delivered' ? 'bg-emerald-500 text-white' : 
                      ship.status === 'Delayed' ? 'bg-rose-500 text-white' : 
                      'bg-blue-500 text-white'
                    }`}>
                      {ship.status}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-sm text-black/40">{ship.date}</td>
                  <td className="py-5 px-8 text-sm font-bold">{ship.delivery}</td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                        <MapPin className="w-4 h-4" />
                      </button>
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
};

export default ShippingOverview;
