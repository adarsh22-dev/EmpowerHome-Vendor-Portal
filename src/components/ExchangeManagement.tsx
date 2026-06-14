import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Layers, 
  Smartphone, 
  MapPin, 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Smartphone as DeviceIcon,
  Globe,
  Palette,
  Type,
  DollarSign,
  Percent,
  Lock,
  FileText,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExchangeSettings, ExchangeCategory, ExchangeDevice, ExchangePincode } from '../types';

const ExchangeManagement = () => {
  const [activeTab, setActiveTab] = useState('General Settings');
  const [settings, setSettings] = useState<ExchangeSettings>({
    enable_exchange: true,
    primary_color: '#000000',
    button_text: 'Exchange Now',
    currency_symbol: '$',
    max_exchange_percentage: 50,
    pincode_validation: true,
    imei_mandatory: true,
    enable_logging: false,
    custom_css: ''
  });
  const [categories, setCategories] = useState<ExchangeCategory[]>([]);
  const [devices, setDevices] = useState<ExchangeDevice[]>([]);
  const [pincodes, setPincodes] = useState<ExchangePincode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, categoriesRes, devicesRes, pincodesRes] = await Promise.all([
        fetch('/api/exchange/settings'),
        fetch('/api/exchange/categories'),
        fetch('/api/exchange/devices'),
        fetch('/api/exchange/pincodes')
      ]);

      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (devicesRes.ok) setDevices(await devicesRes.json());
      if (pincodesRes.ok) setPincodes(await pincodesRes.json());
    } catch (error) {
      console.error("Error fetching exchange data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/exchange/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleAddCategory = async () => {
    const name = prompt('Enter category name:');
    if (!name) return;
    try {
      const res = await fetch('/api/exchange/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, active: true })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/exchange/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddDevice = async () => {
    const model = prompt('Enter device model:');
    const brand = prompt('Enter brand:');
    const base_price = parseFloat(prompt('Enter base price:') || '0');
    const category_id = parseInt(prompt('Enter category ID:') || '1');
    
    if (!model || !brand) return;
    
    try {
      const res = await fetch('/api/exchange/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, brand, base_price, category_id, active: true })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleDeleteDevice = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/exchange/devices/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const handleAddPincode = async () => {
    const pincode = prompt('Enter pincode:');
    if (!pincode) return;
    try {
      const res = await fetch('/api/exchange/pincodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode, active: true })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error adding pincode:", error);
    }
  };

  const handleDeletePincode = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/exchange/pincodes/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error deleting pincode:", error);
    }
  };

  const menuItems = [
    { name: 'General Settings', icon: Settings },
    { name: 'Category Management', icon: Layers },
    { name: 'Devices & Pricing', icon: Smartphone },
    { name: 'Pincode Management', icon: MapPin },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'General Settings':
        return (
          <div className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Global Configuration</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-6 bg-black text-white rounded-3xl">
                  <div>
                    <h5 className="font-bold">Enable Exchange System</h5>
                    <p className="text-xs text-white/60">Toggle exchange functionality globally.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.enable_exchange}
                      onChange={(e) => setSettings({...settings, enable_exchange: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60 uppercase">Primary Brand Color</label>
                  <div className="flex gap-4">
                    <input 
                      type="color" 
                      value={settings.primary_color}
                      onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                      className="w-12 h-12 rounded-xl border-none p-0 overflow-hidden cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={settings.primary_color}
                      onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                      className="flex-1 bg-black/5 border-none rounded-xl px-4 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60 uppercase">Button Text</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input 
                      type="text" 
                      value={settings.button_text}
                      onChange={(e) => setSettings({...settings, button_text: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-xl py-3 pl-12 pr-4 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60 uppercase">Currency Symbol</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input 
                      type="text" 
                      value={settings.currency_symbol}
                      onChange={(e) => setSettings({...settings, currency_symbol: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-xl py-3 pl-12 pr-4 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-black/60 uppercase">Max Exchange Percentage (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input 
                      type="number" 
                      value={settings.max_exchange_percentage}
                      onChange={(e) => setSettings({...settings, max_exchange_percentage: parseInt(e.target.value)})}
                      className="w-full bg-black/5 border-none rounded-xl py-3 pl-12 pr-4 text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Validation & Security</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Pincode Validation', key: 'pincode_validation', desc: 'Enable serviceability check' },
                  { label: 'IMEI Mandatory', key: 'imei_mandatory', desc: 'Require IMEI for mobiles' },
                  { label: 'Enable Logging', key: 'enable_logging', desc: 'Debug exchange events' },
                ].map((item) => (
                  <label key={item.key} className="flex flex-col gap-4 p-6 bg-white border border-black/5 rounded-3xl cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold">{item.label}</span>
                      <input 
                        type="checkbox" 
                        checked={(settings as any)[item.key]}
                        onChange={(e) => setSettings({...settings, [item.key]: e.target.checked})}
                        className="w-5 h-5 rounded border-black/10 text-black focus:ring-black"
                      />
                    </div>
                    <p className="text-xs text-black/40">{item.desc}</p>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Advanced Styling</h4>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-black/60 uppercase flex items-center gap-2">
                  <Code className="w-4 h-4" /> Custom CSS (Scoped)
                </label>
                <textarea 
                  value={settings.custom_css}
                  onChange={(e) => setSettings({...settings, custom_css: e.target.value})}
                  placeholder=".exchange-button { border-radius: 0px; }"
                  className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm font-mono focus:ring-2 focus:ring-black/10 h-48 resize-none"
                />
              </div>
            </section>
          </div>
        );
      case 'Category Management':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Exchange Categories</h4>
              <button 
                onClick={handleAddCategory}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm group hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h5 className="font-bold text-lg mb-1">{cat.name}</h5>
                  <p className="text-xs text-black/40 mb-4">Slug: {cat.slug}</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cat.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {cat.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {cat.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Devices & Pricing':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Device Catalog</h4>
              <button 
                onClick={handleAddDevice}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold"
              >
                <Plus className="w-4 h-4" /> Add Device
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/5 text-[10px] font-bold uppercase tracking-widest text-black/40">
                    <th className="px-6 py-4">Device</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Base Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {devices.map(device => (
                    <tr key={device.id} className="hover:bg-black/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center">
                            <DeviceIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{device.model}</p>
                            <p className="text-[10px] text-black/40 uppercase">{device.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {categories.find(c => c.id === device.category_id)?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        {settings.currency_symbol}{device.base_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${device.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {device.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-black/5 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                          <button 
                            onClick={() => handleDeleteDevice(device.id)}
                            className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Pincode Management':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Serviceable Pincodes</h4>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                  <input type="text" placeholder="Search pincodes..." className="bg-black/5 border-none rounded-xl py-2 pl-10 pr-4 text-sm w-48" />
                </div>
                <button 
                  onClick={handleAddPincode}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Pincode
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {pincodes.map(pin => (
                <div key={pin.id} className="bg-white p-4 rounded-2xl border border-black/5 flex items-center justify-between group hover:border-black transition-colors">
                  <span className="font-bold text-sm">{pin.pincode}</span>
                  <button 
                    onClick={() => handleDeletePincode(pin.id)}
                    className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Exchange Management</h2>
          <p className="text-sm text-black/40">Configure your global trade-in and exchange system.</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold shadow-lg shadow-black/10 hover:bg-zinc-800 transition-all"
        >
          <Save className="w-5 h-5" /> Save All Settings
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-medium transition-all ${
                activeTab === item.name 
                ? 'bg-black text-white shadow-xl shadow-black/10 translate-x-2' 
                : 'text-black/60 hover:bg-black/5 hover:text-black'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
              {activeTab === item.name && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </aside>

        <main className="flex-1 bg-zinc-50/50 rounded-[32px] p-10 border border-black/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ExchangeManagement;
