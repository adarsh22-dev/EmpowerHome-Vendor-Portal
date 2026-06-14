import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical, 
  AlertCircle, 
  Package, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

const MyVariations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const allProducts = await res.json();
        // Filter products that have variations
        const variableProducts = allProducts.filter((p: any) => {
          try {
            const variations = typeof p.variations === 'string' ? JSON.parse(p.variations) : p.variations;
            return variations && Array.isArray(variations) && variations.length > 0;
          } catch (e) {
            return false;
          }
        });
        setProducts(variableProducts);
      }
    } catch (error) {
      console.error("Error fetching variable products:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const variationsCount = products.reduce((acc, p) => {
    try {
      const vars = typeof p.variations === 'string' ? JSON.parse(p.variations) : p.variations;
      return acc + (vars?.length || 0);
    } catch (e) {
      return acc;
    }
  }, 0);

  const stockValue = products.reduce((acc, p) => {
    try {
      const vars = typeof p.variations === 'string' ? JSON.parse(p.variations) : p.variations;
      return acc + (vars?.reduce((vAcc: number, v: any) => vAcc + (v.price * v.stock), 0) || 0);
    } catch (e) {
      return acc;
    }
  }, 0);

  const lowStockCount = products.reduce((acc, p) => {
    try {
      const vars = typeof p.variations === 'string' ? JSON.parse(p.variations) : p.variations;
      return acc + (vars?.filter((v: any) => v.stock > 0 && v.stock <= 10).length || 0);
    } catch (e) {
      return acc;
    }
  }, 0);

  const outOfStockCount = products.reduce((acc, p) => {
    try {
      const vars = typeof p.variations === 'string' ? JSON.parse(p.variations) : p.variations;
      return acc + (vars?.filter((v: any) => v.stock === 0).length || 0);
    } catch (e) {
      return acc;
    }
  }, 0);

  const stats = [
    { label: 'Stock Value', value: `₹${stockValue.toLocaleString()}`, sub: 'Total inventory worth', icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Variations', value: variationsCount.toString(), sub: 'Total combinations', icon: Layers, color: 'bg-blue-500' },
    { label: 'Low Stock', value: lowStockCount.toString(), sub: '10 units or under', icon: AlertCircle, color: 'bg-amber-500' },
    { label: 'Out of Stock', value: outOfStockCount.toString(), sub: 'Needs restocking now', icon: TrendingDown, color: 'bg-rose-500' },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Variations</h2>
          <p className="text-black/40 text-sm mt-1">View and manage all variation combinations from your variable products.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10">
            <Plus className="w-4 h-4" /> Add Variable Product
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
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-bold">Product Variations</h3>
          <div className="flex flex-wrap gap-4">
            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search product, SKU, attribute..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>
            <select className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold">
              <option>All Stock</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
            <button className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto">
                <Layers className="w-10 h-10 text-black/10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">No Variable Products Yet</h4>
                <p className="text-sm text-black/40 max-w-md mx-auto">
                  Go to Add Product, select Variable Product, add variation types (Size, Color...) and publish. They'll appear here automatically.
                </p>
              </div>
              <button className="bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-black/10">
                Add Variable Product
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Product / Variation</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">SKU</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Price</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Stock</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                  <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const variations = typeof p.variations === 'string' ? JSON.parse(p.variations) : p.variations;
                  return (
                    <React.Fragment key={p.id}>
                      <tr className="bg-black/[0.02] border-b border-black/5">
                        <td colSpan={6} className="py-3 px-8 text-xs font-bold text-black/40 uppercase tracking-widest">
                          {p.name}
                        </td>
                      </tr>
                      {variations.map((v: any, idx: number) => (
                        <tr key={`${p.id}-${idx}`} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                          <td className="py-4 px-8">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-black/20" />
                              </div>
                              <div>
                                <div className="text-sm font-bold">{v.name || 'Default Variation'}</div>
                                <div className="text-[10px] text-black/40">
                                  {v.attributes ? Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(', ') : ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-8 text-sm text-black/40">{v.sku || p.sku}</td>
                          <td className="py-4 px-8 text-sm font-bold">₹{v.price?.toLocaleString()}</td>
                          <td className="py-4 px-8 text-sm font-bold">{v.stock}</td>
                          <td className="py-4 px-8">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              v.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 
                              v.stock > 0 ? 'bg-amber-100 text-amber-700' : 
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {v.stock > 10 ? 'In Stock' : v.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-8 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyVariations;
