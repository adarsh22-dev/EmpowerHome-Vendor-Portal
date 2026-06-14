import React, { useState, useMemo } from 'react';
import {
  Search, Plus, ChevronDown, Filter, Trash2, RefreshCw,
  Edit2, Copy, ChevronLeft, ChevronRight, Download, Upload,
  Package, Tag, DollarSign, Eye, EyeOff, Clock, Inbox, Check,
  AlertTriangle, MoreHorizontal, X, SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/vendor/VendorLayout';
import AddProduct from './AddProduct';

const STYLES = `
  .vp-wrap { font-family: 'Inter', system-ui, sans-serif; padding: 0 20px 40px; }
  .vp-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; flex-wrap: wrap; gap: 20px; }
  .vp-header h1 { font-size: 32px; font-weight: 900; letter-spacing: -0.02em; color: #111; margin: 0; }
  .vp-header p { color: #6b7280; font-weight: 500; margin: 4px 0 0; }
  .vp-btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #000; color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); background: #222; }
  .btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; background: #fff; color: #111; border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-secondary:hover { background: #f9fafb; border-color: rgba(0,0,0,0.2); }
  .vp-filter-bar { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; background: #fff; border: 1px solid rgba(0,0,0,0.05); border-radius: 16px; padding: 16px; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
  .vp-search { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 260px; position: relative; background: #f3f4f6; padding: 10px 16px; border-radius: 10px; }
  .vp-search input { flex: 1; border: none; outline: none; font-size: 14px; color: #111; background: transparent; }
  .vp-search-icon { color: #9ca3af; }
  .tbl-wrap { background: #fff; border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; overflow-x: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
  .vp-table { width: 100%; border-collapse: collapse; min-width: 800px; }
  .vp-table th { padding: 16px 24px; text-align: left; font-size: 11px; font-weight: 700; color: #9ca3af; letter-spacing: .08em; text-transform: uppercase; border-bottom: 1px solid rgba(0,0,0,0.05); background: #fcfcfc; }
  .vp-table td { padding: 20px 24px; font-size: 14px; color: #374151; border-bottom: 1px solid rgba(0,0,0,0.03); }
  .prod-cell { display: flex; align-items: center; gap: 16px; }
  .prod-img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(0,0,0,0.05); }
  .prod-name { font-size: 14px; font-weight: 700; color: #111; }
  .prod-desc { font-size: 12px; color: #9ca3af; margin-top: 2px; }
  .ps-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
  .ps-active { background: #ecfdf5; color: #059669; }
  .ps-active::before { content: ''; width: 6px; height: 6px; background: currentColor; border-radius: 50%; }
  .ps-draft { background: #f3f4f6; color: #4b5563; }
  .ps-draft::before { content: ''; width: 6px; height: 6px; background: currentColor; border-radius: 50%; }
  .row-actions { display: flex; gap: 8px; justify-content: flex-end; }
  .row-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; color: #6b7280; transition: all 0.2s; }
  .row-btn:hover { background: #f3f4f6; color: #111; }
  .row-btn.delete:hover { background: #fef2f2; color: #ef4444; }
  @media (max-width: 640px) {
    .vp-header h1 { font-size: 24px; }
    .vp-wrap { padding: 0 16px 32px; }
    .vp-filter-bar { flex-direction: column; align-items: stretch; }
  }
`;

const SEED = [
  { id: 1, name: 'Solar Panel 300W', sku: 'SKU-001', category: 'Solar', price: '$120.00', stock: 50, publishStatus: 'active', image: 'https://picsum.photos/100/100' },
  { id: 2, name: 'Smart Thermostat', sku: 'SKU-002', category: 'Smart Home', price: '$85.00', stock: 20, publishStatus: 'active', image: 'https://picsum.photos/101/101' },
  { id: 3, name: 'LED Flood Light', sku: 'SKU-003', category: 'Lighting', price: '$45.00', stock: 100, publishStatus: 'draft', image: 'https://picsum.photos/102/102' },
];

const VendorProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(SEED);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (p: any) => {
    setEditingProduct(p);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (isAdding || editingProduct) {
    return (
      <AddProduct 
        editProduct={editingProduct} 
        onBack={() => { 
          setEditingProduct(null); 
          setIsAdding(false); 
        }} 
      />
    );
  }

  return (
    <VendorLayout title="Product Management">
      <style>{STYLES}</style>
      <div className="vp-wrap">
        <div className="vp-header">
          <div>
            <h1>My Products</h1>
            <p>Manage your product inventory and listings.</p>
          </div>
          <div className="vp-btn-row">
            <button className="btn-secondary"><Download size={16} /> Export</button>
            <button className="btn-secondary"><Upload size={16} /> Import</button>
            <button className="btn-primary" onClick={() => setIsAdding(true)}><Plus size={16} /> Add Product</button>
          </div>
        </div>

        <div className="vp-filter-bar">
          <div className="vp-search">
            <Search size={16} className="vp-search-icon" />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <button className="btn-secondary"><Filter size={16} /> Filter</button>
        </div>

        <div className="tbl-wrap">
          <table className="vp-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: '#9ca3af' }}>
                      <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                      <p>No products found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="prod-cell">
                        <img src={p.image} alt={p.name} className="prod-img" />
                        <div>
                          <div className="prod-name">{p.name}</div>
                          <div className="prod-desc">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{p.sku}</td>
                    <td>{p.category}</td>
                    <td style={{ fontWeight: 600 }}>{p.price}</td>
                    <td>
                      <span style={{ color: p.stock < 10 ? '#e84c1e' : 'inherit', fontWeight: p.stock < 10 ? 600 : 400 }}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          const newStatus = p.publishStatus === 'active' ? 'draft' : 'active';
                          setProducts(products.map(prod => prod.id === p.id ? { ...prod, publishStatus: newStatus } : prod));
                        }}
                        className={`ps-badge ps-${p.publishStatus} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {p.publishStatus.charAt(0).toUpperCase() + p.publishStatus.slice(1)}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="row-btn" onClick={() => handleEdit(p)} title="Edit"><Edit2 size={15} /></button>
                        <button className="row-btn" onClick={() => {
                          const clone = { ...p, id: Date.now(), name: p.name + ' (Copy)', sku: p.sku + '-COPY', publishStatus: 'draft' };
                          setProducts([...products, clone]);
                        }} title="Duplicate"><Copy size={15} /></button>
                        <button className="row-btn" onClick={() => handleDelete(p.id)} title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorProducts;
