import React, { useState } from 'react';
import { 
  CreditCard, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  FileText, 
  Printer, 
  Table,
  ChevronRight,
  Lock,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

const PaymentsHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments');
      if (res.ok) setPayments(await res.json());
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const totalEarnings = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalCharges = payments.reduce((acc, p) => acc + p.fee, 0);
  const netPayout = payments.reduce((acc, p) => acc + p.net_amount, 0);

  const stats = [
    { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, sub: 'All time', icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Total Charges', value: `₹${totalCharges.toLocaleString()}`, sub: 'Platform fees', icon: TrendingDown, color: 'bg-amber-500' },
    { label: 'Net Payout', value: `₹${netPayout.toLocaleString()}`, sub: 'Settled funds', icon: CreditCard, color: 'bg-emerald-500' },
  ];

  const filteredPayments = payments.filter(p => 
    p.order_id.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments History</h2>
          <p className="text-black/40 text-sm mt-1">View and export your complete transaction ledger.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10">
            <Plus className="w-4 h-4" /> Withdrawal
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
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold">Ledger Book</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors" title="Print"><Printer className="w-4 h-4" /></button>
              <button className="p-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors" title="Excel"><Table className="w-4 h-4" /></button>
              <button className="p-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors" title="CSV"><FileText className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search Order ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>
            <button className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Order ID</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">My Earnings</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Charges</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Payment</th>
                <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Date</th>
                <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-black/40">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No transactions found</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                    <td className="py-5 px-8 text-sm font-bold">ORD-{p.order_id}</td>
                    <td className="py-5 px-8 text-sm font-bold text-emerald-600">₹{p.amount.toLocaleString()}</td>
                    <td className="py-5 px-8 text-sm text-rose-500 font-medium">₹{p.fee.toLocaleString()}</td>
                    <td className="py-5 px-8 text-sm font-bold">₹{p.net_amount.toLocaleString()}</td>
                    <td className="py-5 px-8 text-sm text-black/40">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="py-5 px-8 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.status === 'locked' && <Lock className="w-3 h-3" />}
                        {p.status}
                      </span>
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

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default PaymentsHistory;
