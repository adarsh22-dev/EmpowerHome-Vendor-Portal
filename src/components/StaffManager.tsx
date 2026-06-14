import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  MoreVertical, 
  Copy, 
  ExternalLink, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  History,
  Lock,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const StaffManager = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [staff, setStaff] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newStaff, setNewStaff] = useState({
    display_name: '',
    username: '',
    password: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, activityRes] = await Promise.all([
        fetch('/api/staff'),
        fetch('/api/staff/activity')
      ]);
      if (staffRes.ok) setStaff(await staffRes.json());
      if (activityRes.ok) setActivities(await activityRes.json());
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStaff = async () => {
    if (!newStaff.username || !newStaff.password) {
      alert('Username and password are required');
      return;
    }
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      if (res.ok) {
        alert('Staff account created!');
        setNewStaff({ display_name: '', username: '', password: '' });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating staff:", error);
    }
  };

  const stats = [
    { label: 'Total Staff', value: staff.length.toString(), sub: 'accounts', icon: Users, color: 'bg-blue-500' },
    { label: 'Active', value: staff.filter(s => s.status === 'active').length.toString(), sub: 'can log in', icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Inactive', value: staff.filter(s => s.status !== 'active').length.toString(), sub: 'revoked', icon: XCircle, color: 'bg-rose-500' },
    { label: 'Logins Today', value: staff.filter(s => s.last_login && new Date(s.last_login).toDateString() === new Date().toDateString()).length.toString(), sub: 'last 24 h', icon: History, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Manager</h2>
          <p className="text-black/40 text-sm mt-1">Create staff logins for inventory. Your vendor dashboard stays private.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
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

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
        <p className="text-sm text-emerald-800 font-medium">
          Permission system active: Staff must request permission to delete or draft products. Requests appear in the Permissions tab. Stock updates happen immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
            <div className="flex border-b border-black/5">
              {['Staff Accounts', 'Activity', 'Permissions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-8 py-5 text-sm font-bold transition-all relative ${
                    activeTab === tab.toLowerCase() ? 'text-black' : 'text-black/40 hover:text-black'
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <motion.div layoutId="staff-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'accounts' && (
                <div className="space-y-4">
                  {staff.length === 0 ? (
                    <div className="text-center py-12 text-black/40">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold">No staff accounts found</p>
                      <p className="text-xs">Create your first staff account on the right.</p>
                    </div>
                  ) : (
                    staff.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                            {s.display_name?.charAt(0) || s.username?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{s.display_name || s.username}</h4>
                            <p className="text-xs text-black/40">@{s.username}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            s.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                          }`}>
                            {s.status}
                          </span>
                          <p className="text-[10px] text-black/40 mt-1">
                            {s.last_login ? `Last login: ${new Date(s.last_login).toLocaleString()}` : 'Never logged in'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold">Recent Activity Log</h4>
                    <span className="text-xs text-black/40">{activities.length} events</span>
                  </div>
                  <div className="space-y-3">
                    {activities.map((act, i) => (
                      <div key={i} className="flex items-start justify-between p-3 hover:bg-black/5 rounded-xl transition-colors">
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            act.type === 'reject' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {act.type === 'reject' ? <XCircle className="w-4 h-4" /> : <History className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black/80">{act.action}</p>
                            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-0.5">{act.staff_name || 'System'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-black/40">{new Date(act.created_at).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Create Staff Account</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Display Name</label>
                <input 
                  type="text" 
                  value={newStaff.display_name}
                  onChange={(e) => setNewStaff({...newStaff, display_name: e.target.value})}
                  placeholder="e.g. Warehouse Team" 
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Username *</label>
                <input 
                  type="text" 
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({...newStaff, username: e.target.value})}
                  placeholder="e.g. staff01" 
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Password *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                    placeholder="Minimum 5 characters" 
                    className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10" 
                  />
                  <button 
                    onClick={() => setNewStaff({...newStaff, password: Math.random().toString(36).slice(-8)})}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-black/40 hover:text-black uppercase tracking-widest"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <button 
                onClick={handleCreateStaff}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-black/10 hover:bg-zinc-800 transition-all mt-4"
              >
                Create Staff Account
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-8 rounded-[32px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Staff Access Link</h3>
              <Lock className="w-5 h-5 text-white/40" />
            </div>
            <div className="p-4 bg-white/5 rounded-2xl space-y-3">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Link</p>
              <p className="text-[10px] font-mono break-all text-white/60">http://localhost:5173/vendor/inventory?staff_token=95a425001dbe97b8485d077b6419301a59b5</p>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 py-2 rounded-lg text-[10px] font-bold hover:bg-white/20 transition-colors">
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 py-2 rounded-lg text-[10px] font-bold hover:bg-white/20 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Open
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors">Renew</button>
              <button className="flex-1 bg-white/10 text-white py-3 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">New Token</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManager;
