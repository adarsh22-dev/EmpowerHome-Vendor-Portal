import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Users,
  Globe,
  Package,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

const PerformanceOverview = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [statsData, setStatsData] = useState<any>(null);
  const [salesTrends, setSalesTrends] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, trendsRes, catRes] = await Promise.all([
        fetch('/api/vendor/stats'),
        fetch('/api/vendor/sales-trends'),
        fetch('/api/vendor/category-sales')
      ]);
      
      if (statsRes.ok) setStatsData(await statsRes.json());
      if (trendsRes.ok) {
        const trends = await trendsRes.json();
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const formattedTrends = months.map((m, i) => {
          const monthNum = (i + 1).toString().padStart(2, '0');
          const data = trends.find((t: any) => t.month === monthNum);
          return { name: m, thisYear: data ? data.total : 0, lastYear: (data ? data.total : 0) * 0.8 }; // Mocked last year
        });
        setSalesTrends(formattedTrends);
      }
      if (catRes.ok) {
        const cats = await catRes.json();
        const colors = ['#000000', '#444444', '#888888', '#CCCCCC'];
        setCategorySales(cats.map((c: any, i: number) => ({ ...c, color: colors[i % colors.length] })));
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `₹${statsData?.revenue?.toLocaleString() || '0'}`, change: '+12.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: statsData?.orders?.toString() || '0', change: '-2.4%', icon: ShoppingCart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Avg. Order Value', value: `₹${statsData?.avgOrderValue?.toFixed(2) || '0'}`, change: '+5.1%', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Conversion Rate', value: `${statsData?.conversionRate || '0'}%`, change: '+0.4%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const demographicData = [
    { name: 'USA', value: 45, color: '#000000' },
    { name: 'CAN', value: 22, color: '#333333' },
    { name: 'UK', value: 18, color: '#666666' },
    { name: 'GER', value: 15, color: '#999999' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Overview</h2>
          <p className="text-black/40 text-sm mt-1">Real-time data for Oct 1, 2023 - Oct 31, 2023</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-black/5 p-1 rounded-xl flex">
            {['Daily', 'Weekly', 'Monthly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range.toLowerCase())}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === range.toLowerCase() ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Revenue Trends</h3>
              <p className="text-xs text-black/40 mt-1">Monthly sales volume compared to target</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">This Year</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black/10 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Last Year</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#00000040' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#00000040' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="thisYear" 
                  stroke="#000000" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorThisYear)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="lastYear" 
                  stroke="#00000020" 
                  strokeWidth={2} 
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Sales by Category</h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold">₹{(statsData?.revenue / 1000).toFixed(0)}k</p>
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Total</p>
              </div>
            </div>
            <div className="space-y-3">
              {categorySales.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-black/60">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-black/40">
                    {statsData?.revenue > 0 ? Math.round((cat.value / statsData.revenue) * 100) : 0}% • ₹{(cat.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-8 rounded-[40px] space-y-6">
            <h3 className="text-xl font-bold">Customer Demographics</h3>
            <div className="space-y-4">
              {demographicData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white/40">{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-black/5 flex items-center justify-between">
          <h3 className="text-xl font-bold">Top Performing Products</h3>
          <button className="text-xs font-bold text-black/40 hover:text-black uppercase tracking-widest flex items-center gap-2">
            View All Inventory <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Product Name</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">SKU</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Units Sold</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Revenue</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Stock Status</th>
                <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Handcrafted Ceramic Vase', sku: 'CV-001', sold: '542', revenue: '₹24,390', stock: 'In Stock', growth: '+12%' },
                { name: 'Organic Cotton Textile', sku: 'TX-042', sold: '389', revenue: '₹18,672', stock: 'Low Stock', growth: '+8%' },
                { name: 'Modern Oak Chair', sku: 'FR-102', sold: '156', revenue: '₹31,200', stock: 'In Stock', growth: '+15%' },
              ].map((prod, i) => (
                <tr key={i} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                  <td className="py-5 px-8 text-sm font-bold">{prod.name}</td>
                  <td className="py-5 px-8 text-sm text-black/40">{prod.sku}</td>
                  <td className="py-5 px-8 text-sm font-bold">{prod.sold}</td>
                  <td className="py-5 px-8 text-sm font-bold">{prod.revenue}</td>
                  <td className="py-5 px-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prod.stock === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right text-sm font-bold text-emerald-500">{prod.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview;
