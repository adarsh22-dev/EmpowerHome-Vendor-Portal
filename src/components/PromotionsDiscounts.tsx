import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Calendar,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

const PromotionsDiscounts = ({ onCreate }: { onCreate?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/promotions');
      if (res.ok) setPromotions(await res.json());
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Promotions', value: promotions.filter(p => p.active).length.toString(), sub: 'Currently running', icon: Tag, color: 'bg-blue-500' },
    { label: 'Total Usage', value: promotions.reduce((acc, p) => acc + (p.usage_count || 0), 0).toString(), sub: 'Redemptions', icon: Zap, color: 'bg-emerald-500' },
    { label: 'Total Discounts', value: `₹${promotions.reduce((acc, p) => acc + (p.discount_value || 0), 0).toLocaleString()}`, sub: 'Value given', icon: TrendingDown, color: 'bg-rose-500' },
  ];

  const filteredPromotions = promotions.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Promotions & Discounts</h2>
          <p className="text-black/40 text-sm mt-1">Design, manage and track your marketing campaigns performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={onCreate}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
          >
            <Plus className="w-4 h-4" /> Create New Promotion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                stat.sub.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {stat.sub.split(' ')[0]}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mt-1">{stat.label}</p>
            <p className="text-[10px] text-black/30 mt-0.5">{stat.sub.split(' ').slice(1).join(' ')}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-bold">All Promotions</h3>
          <div className="flex flex-wrap gap-4">
            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search promotions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>
            <select className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Expired</option>
              <option>Scheduled</option>
            </select>
            <select className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold">
              <option>All Types</option>
              <option>Percentage</option>
              <option>Fixed Amount</option>
              <option>Free Shipping</option>
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
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Promotion Name</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Type</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Discount</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Duration</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Usage</th>
                <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-black/40">
                    <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No promotions found</p>
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((promo) => (
                  <tr key={promo.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                    <td className="py-5 px-8 text-sm font-bold">{promo.title}</td>
                    <td className="py-5 px-8 text-sm text-black/60 capitalize">{promo.discount_type}</td>
                    <td className="py-5 px-8 text-sm font-bold text-emerald-600">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `₹${promo.discount_value}`}
                    </td>
                    <td className="py-5 px-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        promo.active ? 'bg-emerald-500 text-white' : 'bg-black/10 text-black/40'
                      }`}>
                        {promo.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-sm text-black/40">
                      {promo.start_date ? `${new Date(promo.start_date).toLocaleDateString()} - ${new Date(promo.end_date).toLocaleDateString()}` : 'Ongoing'}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold">{promo.usage_count || 0}</td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-rose-500">
                          <Trash2 className="w-4 h-4" />
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

export default PromotionsDiscounts;
