import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Upload, 
  Trash2, 
  ChevronRight, 
  Edit, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Copy,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../types';

interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  onAddProduct: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onDuplicate: (product: Product) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ 
  products, 
  categories, 
  onAddProduct, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
    const matchesStock = selectedStock === 'all' || p.stock_status === selectedStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
          <p className="text-black/40 text-sm mt-1">Manage your product inventory. All changes auto-save.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="p-3 bg-white border border-black/5 rounded-xl hover:bg-black/5 transition-colors text-rose-500" title="Trash">
            <Trash2 className="w-4 h-4" /> <span className="ml-2 text-xs font-bold uppercase tracking-widest">Trash (8)</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button 
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-black/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative min-w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search by name, SKU, category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold"
            >
              <option value="all">Publish Status</option>
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
            </select>
            <select 
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 font-bold"
            >
              <option value="all">Stock Status</option>
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
              <option value="onbackorder">On Backorder</option>
            </select>
            <button className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-black/5 border-b border-black/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
              />
              <span className="text-xs font-bold text-black/60 uppercase tracking-widest">Select All</span>
            </label>
            <div className="h-4 w-px bg-black/10" />
            <div className="flex items-center gap-4">
              <button className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest flex items-center gap-2">
                <Trash2 className="w-3 h-3" /> Delete ({selectedItems.length})
              </button>
              <button className="text-xs font-bold text-black/40 hover:text-black uppercase tracking-widest flex items-center gap-2">
                <Edit className="w-3 h-3" /> Bulk Edit ({selectedItems.length})
              </button>
            </div>
          </div>
          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Showing {filteredProducts.length} of {products.length}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                <th className="w-12 py-4 px-8"></th>
                <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Product Info</th>
                <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">SKU</th>
                <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Category</th>
                <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Price</th>
                <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Stock</th>
                <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                  <td className="py-5 px-8">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(product.id)}
                      onChange={() => toggleSelectItem(product.id)}
                      className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                    />
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center overflow-hidden border border-black/5">
                        {product.image ? (
                          <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Package className="w-6 h-6 text-black/10" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold truncate max-w-[200px]">{product.name}</h4>
                        <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-0.5">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-sm text-black/40 font-mono">{product.sku || 'N/A'}</td>
                  <td className="py-5 px-4 text-sm text-black/60">{product.category_name || 'Uncategorized'}</td>
                  <td className="py-5 px-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">₹{product.price}</p>
                      {product.sale_price && <p className="text-[10px] text-rose-500 line-through">₹{product.sale_price}</p>}
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="space-y-1">
                      <p className={`text-sm font-bold ${product.stock <= 10 ? 'text-rose-500' : 'text-black'}`}>{product.stock}</p>
                      <div className="w-16 h-1 bg-black/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock <= 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                      <button 
                        onClick={() => {/* Toggle logic here */}}
                        className={`w-10 h-5 rounded-full relative transition-colors ${product.active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${product.active ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {product.status || 'Published'}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDuplicate(product)}
                        className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black"
                        title="Featured"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-2 hover:bg-black/10 rounded-lg transition-colors text-rose-500"
                        title="Delete"
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
    </div>
  );
};

export default ProductManagement;
