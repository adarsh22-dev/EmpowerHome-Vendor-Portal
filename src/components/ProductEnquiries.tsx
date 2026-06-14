import React, { useState } from 'react';
import { 
  MessageSquare, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart3, 
  Info,
  ChevronRight,
  Mail,
  Phone,
  User,
  Package,
  ArrowUpRight,
  Trash2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ProductEnquiries = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) setEnquiries(await res.json());
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const stats = [
    { label: 'Total Enquiries', value: enquiries.length.toString(), sub: 'All time', icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'Sample Requests', value: enquiries.filter(e => e.type === 'sample').length.toString(), sub: 'SAMPLE type', icon: Package, color: 'bg-emerald-500' },
    { label: 'Bulk Requests', value: enquiries.filter(e => e.type === 'bulk').length.toString(), sub: 'BULK type', icon: FileText, color: 'bg-amber-500' },
    { label: 'Pending Review', value: enquiries.filter(e => e.status === 'pending').length.toString(), sub: 'Needs action', icon: Clock, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Enquiries</h2>
          <p className="text-black/40 text-sm mt-1">Manage sample and bulk enquiry forms. ✓ All changes are saved automatically</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
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
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mt-1">{stat.label}</p>
            <p className="text-[10px] text-black/30 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="flex border-b border-black/5">
          {['Overview', 'Enable / Disable', 'Manage Requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-8 py-5 text-sm font-bold transition-all relative ${
                activeTab === tab.toLowerCase() ? 'text-black' : 'text-black/40 hover:text-black'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <motion.div layoutId="enquiry-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold">Enquiry Management</h4>
                  <p className="text-sm text-black/40">Overview of all enquiry activity for your store.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-black/5 rounded-3xl space-y-1">
                    <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Approved</p>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-[10px] text-emerald-500 font-bold">25% of total</p>
                  </div>
                  <div className="p-6 bg-black/5 rounded-3xl space-y-1">
                    <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Rejected</p>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-[10px] text-rose-500 font-bold">13% of total</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-black/40">Available Forms</h5>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-black/60"><span className="font-bold text-black">Sample Request</span> — customers request free samples to evaluate quality</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-black/60"><span className="font-bold text-black">Bulk / Wholesale Enquiry</span> — B2B large-quantity purchase requests</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-zinc-900 text-white p-10 rounded-[40px] space-y-8 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <h4 className="text-2xl font-bold">How It Works</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Use Enable / Disable to toggle forms per product. Review and respond in Manage Requests. All data is saved locally and persists across page reloads.
                  </p>
                  <div className="pt-4">
                    <button className="bg-white text-black px-8 py-3 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-colors">
                      View Documentation
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              </div>
            </div>
          )}

          {activeTab === 'manage requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold">Recent Enquiries</h4>
                <button className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest">Reset Data</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/5">
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Enquiry ID</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Type</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Product</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Customer</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Date</th>
                      <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                      <th className="text-right py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-20 text-center text-black/40">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="font-bold">No enquiries found</p>
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((enq) => (
                        <tr key={enq.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                          <td className="py-4 px-4 text-sm font-bold">ENQ-{enq.id}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              enq.type === 'sample' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {enq.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-black/60">{enq.product_name}</td>
                          <td className="py-4 px-4 text-sm text-black/60">
                            <div className="font-bold text-black">{enq.customer_name}</div>
                            <div className="text-[10px]">{enq.customer_email}</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-black/60">{new Date(enq.created_at).toLocaleDateString()}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              enq.status === 'approved' ? 'bg-emerald-500 text-white' : 
                              enq.status === 'rejected' ? 'bg-rose-500 text-white' : 
                              'bg-amber-500 text-white'
                            }`}>
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => updateStatus(enq.id, 'approved')}
                                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600" title="Approve">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateStatus(enq.id, 'rejected')}
                                className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-rose-600" title="Reject">
                                <XCircle className="w-4 h-4" />
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEnquiries;
