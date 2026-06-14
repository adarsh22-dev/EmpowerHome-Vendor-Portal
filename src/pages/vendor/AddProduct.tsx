import React, {
  useState, useEffect, useCallback, useRef, useMemo
} from 'react';
import {
  Image as ImageIcon, Plus, ArrowLeft, ChevronRight, X,
  Save, Trash2, RotateCcw, Tag, Truck, Receipt, Sliders,
  ShoppingCart, TrendingUp, Globe, FileText, Video,
  Check, AlertCircle, ChevronDown, Package, CheckCircle,
  Hash, DollarSign, BarChart2, Eye, EyeOff, Copy, RefreshCw,
  Layers, Settings, Table, Grid, Edit3, FolderOpen, Folder,
  Building2, Camera, ChevronUp, TreePine, ArrowLeftRight,
  Smartphone, Laptop, Tablet, Tv, BadgeCheck, ToggleLeft,
  ToggleRight, MapPin, Info, Percent, Zap, Globe2, Loader,
  RotateCw, Factory, Cpu, ArrowUpCircle, PlusSquare, ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorLayout from '../../components/vendor/VendorLayout';
import AIPhase1 from '../../components/AIPhase1';

const STYLES = `
  .ap-wrap { font-family: 'Inter', system-ui, sans-serif; padding: 0 20px 40px; }
  .ap-label { letter-spacing: 0.05em; }
  .ap-section { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .ap-sec-head:hover .ap-step { transform: scale(1.1); }
  .ap-step { transition: transform 0.3s ease; }
  .ap-topnav { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
  .ap-breadcrumbs { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; }
  .ap-breadcrumbs .link { cursor: pointer; }
  .ap-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
  @media (max-width: 640px) {
    .ap-header h1 { font-size: 28px; }
    .ap-topnav { flex-direction: column; align-items: flex-start; }
  }
`;

function Section({ step, icon, title, badge, defaultOpen = true, children }: { step: number, icon: any, title: string, badge?: any, defaultOpen?: boolean, children: any }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ap-section shadow-sm border border-black/5 rounded-2xl overflow-hidden mb-6">
      <div 
        className={`ap-sec-head flex items-center gap-4 p-6 cursor-pointer select-none transition-colors ${open ? 'bg-zinc-50 border-b border-black/5' : 'bg-white hover:bg-zinc-50'}`} 
        onClick={() => setOpen(o => !o)}
      >
        <div className="ap-step w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {step}
        </div>
        <div className="ap-sec-title flex-1 flex items-center gap-2 font-bold text-gray-900">
          {icon}
          <span>{title}</span>
          {badge != null && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && <div className="ap-sec-body p-6 bg-white space-y-6">{children}</div>}
    </div>
  );
}

const AddProduct = ({ editProduct = null, onBack: onBackProp }: { editProduct?: any, onBack?: () => void }) => {
  const navigate = useNavigate();
  const isEditMode = !!editProduct;

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('All changes saved');
  const [showAIPanel, setShowAIPanel] = useState(false);

  const [form, setForm] = useState({
    name: editProduct?.name || '',
    shortDesc: editProduct?.shortDesc || '',
    description: editProduct?.description || '',
    price: editProduct?.price || '',
    salePrice: editProduct?.salePrice || '',
    sku: editProduct?.sku || '',
    stock: editProduct?.stock || 100,
    lowStockAlert: editProduct?.lowStockAlert || 10,
    manageStock: editProduct?.manageStock ?? true,
    category: editProduct?.category || '',
    brand: editProduct?.brand || '',
    tags: editProduct?.tags || [],
    weight: editProduct?.weight || '',
    dimensions: editProduct?.dimensions || '',
    shippingClass: editProduct?.shippingClass || '',
    taxClass: editProduct?.taxClass || 'standard',
    wholesalePrice: editProduct?.wholesalePrice || '',
    wholesaleMinQty: editProduct?.wholesaleMinQty || 5,
    seoTitle: editProduct?.seoTitle || '',
    seoDesc: editProduct?.seoDesc || '',
    exchangeEnabled: editProduct?.exchangeEnabled || false,
    maxExchangeValue: editProduct?.maxExchangeValue || '',
    exchangeDescription: editProduct?.exchangeDescription || '',
    exchangeEligibleProducts: editProduct?.exchangeEligibleProducts || [], // List of { brand: '', model: '', condition: '' }
    exchangeCondition: editProduct?.exchangeCondition || 'good',
    images: editProduct?.images || [],
    mfgImages: editProduct?.mfgImages || [],
    mfgVideos: editProduct?.mfgVideos || [],
    rotationImages: editProduct?.rotationImages || [],
    productType: editProduct?.productType || 'variable',
    isCatalog: editProduct?.isCatalog || false,
    isVirtual: editProduct?.isVirtual || false,
    isDownloadable: editProduct?.isDownloadable || false,
    downloadUrl: editProduct?.downloadUrl || '',
    downloadLimit: editProduct?.downloadLimit || '',
    downloadExpiry: editProduct?.downloadExpiry || '',
    material: editProduct?.material || '',
    warranty: editProduct?.warranty || '',
    origin: editProduct?.origin || 'in',
    fragile: editProduct?.fragile || false,
    additionalDetails: editProduct?.additionalDetails || '',
    technicalDetails: editProduct?.technicalDetails || '',
    metaKeywords: editProduct?.metaKeywords || [],
    policies: editProduct?.policies || [],
    variationTypes: editProduct?.variationTypes || [],
    combData: editProduct?.combData || {},
    rotation360: editProduct?.rotation360 || [],
    extraAttrs: editProduct?.extraAttrs || [],
    crossSell: editProduct?.crossSell || [],
    upsell: editProduct?.upsell || [],
    vendorTags: editProduct?.vendorTags || [],
    categories: editProduct?.categories || ['clothes'],
    brands: editProduct?.brands || [],
    selectedBrand: editProduct?.selectedBrand || '',
  });

  useEffect(() => {
    setIsSaving(true);
    setSaveStatus('Saving changes...');
    const timer = setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('All changes saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  const handleMockUpload = (field: string) => {
    const mockUrl = `https://picsum.photos/seed/${Math.random()}/400/400`;
    setForm(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], mockUrl]
    }));
  };

  const removeMedia = (field: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleBack = () => {
    if (onBackProp) onBackProp();
    else navigate('/vendor/products');
  };

  const handleSave = () => {
    alert(isEditMode ? 'Product updated!' : 'Product published!');
    handleBack();
  };

  const addPolicy = () => {
    setForm({ ...form, policies: [...form.policies, { title: '', content: '' }] });
  };

  const updatePolicy = (index: number, field: string, value: string) => {
    const newPolicies = [...form.policies];
    newPolicies[index] = { ...newPolicies[index], [field]: value };
    setForm({ ...form, policies: newPolicies });
  };

  const addExtraAttr = () => {
    setForm({ ...form, extraAttrs: [...form.extraAttrs, { name: '', value: '' }] });
  };

  const updateExtraAttr = (index: number, field: string, value: string) => {
    const newAttrs = [...form.extraAttrs];
    newAttrs[index] = { ...newAttrs[index], [field]: value };
    setForm({ ...form, extraAttrs: newAttrs });
  };

  return (
    <VendorLayout title={isEditMode ? 'Edit Product' : 'Add New Product'}>
      <style>{STYLES}</style>
      <div className="ap-wrap max-w-5xl mx-auto">
        <div className="ap-topnav">
          <div className="ap-breadcrumbs">
            <span className="link hover:text-orange-600 transition-colors" onClick={handleBack}>My Products</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="active font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-colors shadow-sm" onClick={handleBack}>
            <ArrowLeft size={16} /> Back to Products
          </button>
        </div>

        <div className="ap-header">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-gray-500 font-medium">List a new item in your marketplace store. All fields auto-save as you type.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2">
            {isSaving ? <Loader className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 text-emerald-500" />}
            <span className={isSaving ? 'text-orange-600' : 'text-emerald-600'}>{saveStatus}</span>
          </div>
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${showAIPanel ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-black/5 hover:bg-zinc-50 shadow-sm'}`}
          >
            <Sparkles size={16} /> AI Product Intelligence
          </button>
        </div>

        {showAIPanel && (
          <div className="mb-8">
            <AIPhase1
              productData={{
                name: form.name,
                sku: form.sku,
                description: form.description,
                shortDesc: form.shortDesc,
                category: form.categories[0] || 'General',
                brand: form.selectedBrand || form.brands[0] || '',
                price: form.price,
                salePrice: form.salePrice,
                stock: form.stock,
                material: form.material,
                warranty: form.warranty,
                origin: form.origin,
                weight: form.weight,
                dimensions: form.dimensions,
                image: form.images[0] || '',
                images: form.images,
                vendor_tags: form.vendorTags,
                extra_attributes: form.extraAttrs,
                technical_details: form.technicalDetails,
                additional_details: form.additionalDetails,
                seoTitle: form.seoTitle,
                seoDesc: form.seoDesc,
                metaKeywords: form.metaKeywords
              }}
              onApply={(field, value) => {
                switch (field) {
                  case 'description': setForm(prev => ({ ...prev, description: value as string })); break;
                  case 'shortDesc': setForm(prev => ({ ...prev, shortDesc: value as string })); break;
                  case 'seoTitle': setForm(prev => ({ ...prev, seoTitle: value as string })); break;
                  case 'seoDesc': setForm(prev => ({ ...prev, seoDesc: value as string })); break;
                  case 'metaKeywords': setForm(prev => ({ ...prev, metaKeywords: Array.isArray(value) ? value : [value as string] })); break;
                  case 'bulletPoints': setForm(prev => ({ ...prev, description: (prev.description || '') + '\n\n' + (value as string[]).map((p, i) => `${i + 1}. ${p}`).join('\n') })); break;
                }
              }}
            />
          </div>
        )}

        <Section step={1} icon={<Info size={18} className="text-orange-600" />} title="Basic Information" badge={`${[form.productType, form.name, form.category].filter(Boolean).length}/3`}>
          <div className="space-y-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Product Type *</label>
              <div className="relative">
                <select 
                  className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none shadow-sm" 
                  value={form.productType} 
                  onChange={e => setForm({...form, productType: e.target.value})}
                >
                  <option value="simple">Simple Product</option>
                  <option value="variable">Variable Product</option>
                  <option value="grouped">Grouped Product</option>
                  <option value="external">External/Affiliate Product</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex items-center gap-6 mt-4">
                {['Catalog', 'Virtual', 'Downloadable'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={form[`is${type}` as keyof typeof form] as boolean} 
                        onChange={e => setForm({...form, [`is${type}` as keyof typeof form]: e.target.checked})} 
                        className="peer appearance-none w-5 h-5 border-2 border-black/5 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                      />
                      <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
              {form.productType === 'variable' && (
                <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
                  <Layers size={18} className="text-orange-600" />
                  <p className="text-sm font-bold text-orange-800">Variable Product — Has multiple variations. Configure in Section 5.</p>
                </div>
              )}
            </div>

            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Product Name *</label>
              <input 
                className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                placeholder="e.g. Minimalist Oak Coffee Table" 
              />
            </div>

            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Short Description</label>
              <input 
                className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" 
                value={form.shortDesc} 
                onChange={e => setForm({...form, shortDesc: e.target.value})} 
                placeholder="One-line summary shown in product listings" 
              />
              <div className="flex justify-end mt-2">
                <span className="text-[10px] font-bold text-gray-400">{form.shortDesc.length}/150</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Category *</label>
                <div className="p-4 bg-white border border-black/5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Folder size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categories</span>
                      <span className="w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{form.categories.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-orange-600 transition-colors"><RefreshCw size={10} /> Refresh</button>
                      <button className="text-[10px] font-bold text-gray-900 flex items-center gap-1 hover:text-orange-600 transition-colors" onClick={() => setForm({...form, categories: [...form.categories, 'new category']})}><Plus size={10} /> New Root</button>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {form.categories.map((cat: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-zinc-50 rounded-xl border border-black/5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white rounded-lg border border-black/5" />
                          <span className="text-sm font-bold text-gray-900">{cat}</span>
                          {i === 0 && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Root</span>}
                        </div>
                        <button className="text-rose-500" onClick={() => setForm({...form, categories: form.categories.filter((_: any, j: number) => i !== j)})}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 border-2 border-dashed border-black/5 rounded-xl text-xs font-bold text-gray-400 hover:border-orange-500/50 hover:text-orange-600 transition-all flex items-center justify-center gap-2" onClick={() => setForm({...form, categories: [...form.categories, 'sub category']})}>
                    <Plus size={14} /> ADD NEW CATEGORY
                  </button>
                </div>
              </div>
              <div>
                <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Brand</label>
                <div className="p-4 bg-white border border-black/5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{form.brands.length} brands available</span>
                    <div className="flex items-center gap-2">
                      <button className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-orange-600 transition-colors"><RefreshCw size={10} /> Refresh</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.brands.map((brand: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-zinc-100 text-gray-700 rounded-full text-[10px] font-bold flex items-center gap-2">
                        {brand}
                        <X size={10} className="cursor-pointer" onClick={() => setForm({...form, brands: form.brands.filter((_: any, j: number) => i !== j)})} />
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input 
                      className="w-full p-3 bg-zinc-50 border border-black/5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" 
                      placeholder="Brand name e.g. SolarTech Pro" 
                      value={form.selectedBrand}
                      onChange={e => setForm({...form, selectedBrand: e.target.value})}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const val = form.selectedBrand.trim();
                          if (val && !form.brands.includes(val)) {
                            setForm({...form, brands: [...form.brands, val], selectedBrand: ''});
                          }
                        }
                      }}
                    />
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-[10px] font-bold hover:bg-orange-700 transition-colors"
                      onClick={() => {
                        const val = form.selectedBrand.trim();
                        if (val && !form.brands.includes(val)) {
                          setForm({...form, brands: [...form.brands, val], selectedBrand: ''});
                        }
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Full Description</label>
              <textarea 
                className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm min-h-[200px]" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                placeholder="Provide a detailed product description..." 
              />
              <div className="flex justify-end mt-2">
                <span className="text-[10px] font-bold text-gray-400">{form.description.length} characters</span>
              </div>
            </div>
          </div>
        </Section>

        <Section step={2} icon={<DollarSign size={18} className="text-orange-600" />} title="Pricing & Inventory" badge={`${[form.price, form.sku, form.stock].filter(Boolean).length}/4`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Regular Price ($) *</label>
              <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Sale Price ($)</label>
              <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.salePrice} onChange={e => setForm({...form, salePrice: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">SKU *</label>
              <input className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="EHOME-001" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Initial Stock</label>
              <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} placeholder="100" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Low Stock Alert (qty)</label>
              <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.lowStockAlert} onChange={e => setForm({...form, lowStockAlert: parseInt(e.target.value) || 0})} placeholder="10" />
            </div>
            <div className="flex items-center gap-2 mt-8">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={form.manageStock} 
                  onChange={e => setForm({...form, manageStock: e.target.checked})} 
                  className="peer appearance-none w-5 h-5 border-2 border-black/5 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                />
                <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className="text-sm font-bold text-gray-600">Manage stock quantity</span>
            </div>
          </div>
        </Section>

        <Section step={3} icon={<ImageIcon size={18} className="text-orange-600" />} title="Product Media" badge={form.images.length}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {form.images.map((img: string, i: number) => (
              <div key={i} className="relative aspect-square rounded-2xl border border-black/5 overflow-hidden group">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeMedia('images', i)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button 
              className="aspect-square rounded-2xl border-2 border-dashed border-black/5 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500/50 hover:text-orange-600 transition-all bg-zinc-50"
              onClick={() => handleMockUpload('images')}
            >
              <Plus size={24} />
              <span className="text-[10px] font-bold uppercase mt-2">Add Image</span>
            </button>
          </div>
          <div className="p-8 border-2 border-dashed border-black/5 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center group hover:border-orange-500/50 transition-all cursor-pointer" onClick={() => handleMockUpload('images')}>
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon size={24} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Drag and drop product images here</h3>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">PNG, JPG, WebP up to 10MB each</p>
          </div>
        </Section>

        <Section step={4} icon={<Sliders size={18} className="text-orange-600" />} title="Attributes" badge={Object.values(form).filter(v => v === true || (typeof v === 'string' && v.length > 0)).length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Material</label>
              <input className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.material} onChange={e => setForm({...form, material: e.target.value})} placeholder="e.g. Oak, Steel" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Warranty</label>
              <input className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.warranty} onChange={e => setForm({...form, warranty: e.target.value})} placeholder="e.g. 2 years" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Country of Origin</label>
              <div className="relative">
                <select className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none shadow-sm" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})}>
                  <option value="in">India</option>
                  <option value="us">USA</option>
                  <option value="cn">China</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-8">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={form.fragile} 
                  onChange={e => setForm({...form, fragile: e.target.checked})} 
                  className="peer appearance-none w-5 h-5 border-2 border-black/5 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                />
                <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className="text-sm font-bold text-gray-600">Fragile Product</span>
            </div>
          </div>
        </Section>

        <Section step={5} icon={<Layers size={18} className="text-orange-600" />} title="Product Variations" badge={form.variationTypes.length}>
          <div className="p-12 border-2 border-dashed border-black/5 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center">
            <Layers size={32} className="text-gray-300 mb-4" />
            <p className="text-sm text-gray-500 font-bold mb-4">No variations added yet.</p>
            <button className="px-6 py-3 bg-white border border-black/5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-sm flex items-center gap-2">
              <Plus size={16} /> Add Variation
            </button>
          </div>
        </Section>

        <Section step={6} icon={<RotateCw size={18} className="text-orange-600" />} title="360 Product Rotation" badge={form.rotationImages.length}>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
            {form.rotationImages.map((img: string, i: number) => (
              <div key={i} className="relative aspect-square rounded-lg border border-black/5 overflow-hidden group">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeMedia('rotationImages', i)}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-12 border-2 border-dashed border-black/5 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center">
            <RotateCw size={32} className="text-gray-300 mb-4" />
            <p className="text-sm text-gray-500 font-bold mb-4">Upload 360° frames to enable interactive rotation.</p>
            <button 
              className="px-6 py-3 bg-white border border-black/5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-sm flex items-center gap-2"
              onClick={() => handleMockUpload('rotationImages')}
            >
              <Plus size={16} /> Upload Frames
            </button>
          </div>
        </Section>

        <Section step={7} icon={<FileText size={18} className="text-orange-600" />} title="Additional Details">
          <textarea 
            className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm min-h-[150px]" 
            value={form.additionalDetails} 
            onChange={e => setForm({...form, additionalDetails: e.target.value})} 
            placeholder="Any extra info for customers..." 
          />
        </Section>

        <Section step={8} icon={<Cpu size={18} className="text-orange-600" />} title="Technical Details">
          <textarea 
            className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm min-h-[150px]" 
            value={form.technicalDetails} 
            onChange={e => setForm({...form, technicalDetails: e.target.value})} 
            placeholder="Specs, technical data, etc..." 
          />
        </Section>

        <Section step={9} icon={<Factory size={18} className="text-orange-600" />} title="Manufacturer Images" badge={form.mfgImages.length}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {form.mfgImages.map((img: string, i: number) => (
              <div key={i} className="relative aspect-video rounded-xl border border-black/5 overflow-hidden group">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeMedia('mfgImages', i)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-12 border-2 border-dashed border-black/5 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center">
            <ImageIcon size={32} className="text-gray-300 mb-4" />
            <p className="text-sm text-gray-500 font-bold mb-4">Upload official manufacturer images.</p>
            <button 
              className="px-6 py-3 bg-white border border-black/5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-sm flex items-center gap-2"
              onClick={() => handleMockUpload('mfgImages')}
            >
              <Plus size={16} /> Upload Images
            </button>
          </div>
        </Section>

        <Section step={10} icon={<Video size={18} className="text-orange-600" />} title="Manufacturer Videos" badge={form.mfgVideos.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {form.mfgVideos.map((vid: string, i: number) => (
              <div key={i} className="relative aspect-video rounded-xl border border-black/5 bg-black flex items-center justify-center group">
                <Video size={32} className="text-white/20" />
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeMedia('mfgVideos', i)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-12 border-2 border-dashed border-black/5 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center">
            <Video size={32} className="text-gray-300 mb-4" />
            <p className="text-sm text-gray-500 font-bold mb-4">Add manufacturer product videos.</p>
            <button 
              className="px-6 py-3 bg-white border border-black/5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-sm flex items-center gap-2"
              onClick={() => handleMockUpload('mfgVideos')}
            >
              <Plus size={16} /> Add Video
            </button>
          </div>
        </Section>

        <Section step={11} icon={<Tag size={18} className="text-orange-600" />} title="Vendor Tags" badge={form.vendorTags.length}>
          <div className="flex flex-wrap gap-2 mb-4">
            {form.vendorTags.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold flex items-center gap-2">
                {tag}
                <X size={12} className="cursor-pointer" onClick={() => setForm({...form, vendorTags: form.vendorTags.filter((_: any, j: number) => i !== j)})} />
              </span>
            ))}
          </div>
          <input 
            className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" 
            placeholder="Type and press Enter to add tags..." 
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !form.vendorTags.includes(val)) {
                  setForm({...form, vendorTags: [...form.vendorTags, val]});
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </Section>

        <Section step={12} icon={<Truck size={18} className="text-orange-600" />} title="Shipping">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Weight (kg)</label>
              <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Dimensions (L x W x H cm)</label>
              <input className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.dimensions} onChange={e => setForm({...form, dimensions: e.target.value})} placeholder="e.g. 10 x 10 x 10" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Shipping Class</label>
              <div className="relative">
                <select className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none shadow-sm" value={form.shippingClass} onChange={e => setForm({...form, shippingClass: e.target.value})}>
                  <option value="standard">Standard Shipping</option>
                  <option value="express">Express Shipping</option>
                  <option value="heavy">Heavy Goods</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </Section>

        <Section step={13} icon={<Receipt size={18} className="text-orange-600" />} title="Tax">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Tax Class</label>
              <div className="relative">
                <select className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none shadow-sm" value={form.taxClass} onChange={e => setForm({...form, taxClass: e.target.value})}>
                  <option value="standard">Standard Rate</option>
                  <option value="reduced">Reduced Rate</option>
                  <option value="zero">Zero Rate</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </Section>

        <Section step={14} icon={<PlusSquare size={18} className="text-orange-600" />} title="Extra Attributes" badge={form.extraAttrs.length}>
          <div className="space-y-4">
            {form.extraAttrs.map((attr: any, i: number) => (
              <div key={i} className="flex gap-4 items-start">
                <input className="flex-1 p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" placeholder="Attribute Name" value={attr.name} onChange={e => updateExtraAttr(i, 'name', e.target.value)} />
                <input className="flex-1 p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" placeholder="Value" value={attr.value} onChange={e => updateExtraAttr(i, 'value', e.target.value)} />
                <button className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors" onClick={() => setForm({...form, extraAttrs: form.extraAttrs.filter((_: any, j: number) => i !== j)})}><Trash2 size={20} /></button>
              </div>
            ))}
            <button className="w-full p-4 border-2 border-dashed border-black/5 rounded-2xl text-sm font-bold text-gray-400 hover:border-orange-500/50 hover:text-orange-600 transition-all flex items-center justify-center gap-2" onClick={addExtraAttr}>
              <Plus size={18} /> ADD EXTRA ATTRIBUTE
            </button>
          </div>
        </Section>

        <Section step={15} icon={<ShoppingCart size={18} className="text-orange-600" />} title="WholesaleX" badge={`${[form.wholesalePrice].filter(Boolean).length}/2`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Wholesale Price ($)</label>
              <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.wholesalePrice} onChange={e => setForm({...form, wholesalePrice: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Min Wholesale Qty</label>
              <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.wholesaleMinQty} onChange={e => setForm({...form, wholesaleMinQty: parseInt(e.target.value) || 0})} placeholder="5" />
            </div>
          </div>
        </Section>

        <Section step={16} icon={<TrendingUp size={18} className="text-orange-600" />} title="Cross Sell" badge={form.crossSell.length}>
          <div className="flex flex-wrap gap-4 mb-6">
            {form.crossSell.map((prod: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white border border-black/5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg overflow-hidden">
                  <img src={prod.image} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{prod.name}</p>
                  <p className="text-[10px] font-bold text-gray-400">${prod.price}</p>
                </div>
                <button className="text-rose-500 ml-2" onClick={() => setForm({...form, crossSell: form.crossSell.filter((_: any, j: number) => i !== j)})}><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="p-8 border-2 border-dashed border-black/5 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-500 font-bold mb-4">Link related products to show in cart.</p>
            <button 
              className="px-6 py-3 bg-white border border-black/5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-sm flex items-center gap-2"
              onClick={() => {
                const mockProd = { name: 'Related Product ' + (form.crossSell.length + 1), price: '29.99', image: 'https://picsum.photos/seed/cross'+form.crossSell.length+'/100/100' };
                setForm({...form, crossSell: [...form.crossSell, mockProd]});
              }}
            >
              <Plus size={16} /> Add Related Product
            </button>
          </div>
        </Section>

        <Section step={17} icon={<ArrowUpCircle size={18} className="text-orange-600" />} title="Upsell" badge={form.upsell.length}>
          <div className="flex flex-wrap gap-4 mb-6">
            {form.upsell.map((prod: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white border border-black/5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg overflow-hidden">
                  <img src={prod.image} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{prod.name}</p>
                  <p className="text-[10px] font-bold text-gray-400">${prod.price}</p>
                </div>
                <button className="text-rose-500 ml-2" onClick={() => setForm({...form, upsell: form.upsell.filter((_: any, j: number) => i !== j)})}><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="p-8 border-2 border-dashed border-black/5 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-500 font-bold mb-4">Link premium alternatives to show on product page.</p>
            <button 
              className="px-6 py-3 bg-white border border-black/5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors shadow-sm flex items-center gap-2"
              onClick={() => {
                const mockProd = { name: 'Premium Alternative ' + (form.upsell.length + 1), price: '199.99', image: 'https://picsum.photos/seed/upsell'+form.upsell.length+'/100/100' };
                setForm({...form, upsell: [...form.upsell, mockProd]});
              }}
            >
              <Plus size={16} /> Add Premium Alternative
            </button>
          </div>
        </Section>

        <Section step={18} icon={<Globe size={18} className="text-orange-600" />} title="SEO" badge={`${[form.seoTitle, form.seoDesc].filter(Boolean).length}/2`}>
          <div className="space-y-6">
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">SEO Title</label>
              <input className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} placeholder="Search engine optimized title" />
            </div>
            <div>
              <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">SEO Description</label>
              <textarea className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm min-h-[100px]" value={form.seoDesc} onChange={e => setForm({...form, seoDesc: e.target.value})} placeholder="Brief summary for search results..." />
            </div>
          </div>
        </Section>

        <Section step={19} icon={<ShieldCheck size={18} className="text-orange-600" />} title="Product Policies" badge={form.policies.length}>
          <div className="space-y-4">
            {form.policies.map((policy: any, i: number) => (
              <div key={i} className="p-6 bg-zinc-50 rounded-2xl border border-black/5 space-y-4">
                <div className="flex justify-between items-center">
                  <input className="bg-transparent font-bold text-gray-900 outline-none w-full" placeholder="Policy Title (e.g. Return Policy)" value={policy.title} onChange={e => updatePolicy(i, 'title', e.target.value)} />
                  <button className="text-rose-500" onClick={() => setForm({...form, policies: form.policies.filter((_: any, j: number) => i !== j)})}><X size={20} /></button>
                </div>
                <textarea className="w-full p-4 bg-white border border-black/5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm min-h-[80px]" placeholder="Policy details..." value={policy.content} onChange={e => updatePolicy(i, 'content', e.target.value)} />
              </div>
            ))}
            <button className="w-full p-4 border-2 border-dashed border-black/5 rounded-2xl text-sm font-bold text-gray-400 hover:border-orange-500/50 hover:text-orange-600 transition-all flex items-center justify-center gap-2" onClick={addPolicy}>
              <Plus size={18} /> ADD NEW POLICY
            </button>
          </div>
        </Section>

        <Section step={20} icon={<ArrowLeftRight size={18} className="text-orange-600" />} title="Exchange / Trade-In">
          <div className="flex items-center justify-between p-6 bg-orange-50 rounded-2xl border border-orange-100 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <ArrowLeftRight size={24} className="text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Enable Exchange Program</h4>
                <p className="text-xs text-orange-700 font-medium">Allow customers to trade in old devices for this product.</p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={form.exchangeEnabled} 
                onChange={e => setForm({...form, exchangeEnabled: e.target.checked})} 
                className="peer appearance-none w-6 h-6 border-2 border-black/5 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
              />
              <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
          {form.exchangeEnabled && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Max Exchange Value ($)</label>
                  <input type="number" className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" value={form.maxExchangeValue} onChange={e => setForm({...form, maxExchangeValue: e.target.value})} placeholder="0.00" />
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">Maximum discount a customer can get by exchanging an old product.</p>
                </div>
                <div>
                  <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Minimum Condition Required</label>
                  <div className="relative">
                    <select className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none shadow-sm" value={form.exchangeCondition} onChange={e => setForm({...form, exchangeCondition: e.target.value})}>
                      <option value="mint">Mint (Like New)</option>
                      <option value="good">Good (Minor Scratches)</option>
                      <option value="fair">Fair (Visible Wear)</option>
                      <option value="any">Any Condition</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Eligible Brands & Models for Exchange</label>
                <div className="space-y-3 mb-4">
                  {form.exchangeEligibleProducts.map((item: { brand: string, model: string, condition: string }, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-black/5">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-white border border-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-orange-600">Brand</div>
                        <span className="text-sm font-bold text-gray-900">{item.brand}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="px-3 py-1 bg-white border border-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400">Model</div>
                        <span className="text-sm font-bold text-gray-600">{item.model}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="px-3 py-1 bg-white border border-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-600">Condition</div>
                        <span className="text-sm font-bold text-gray-900 capitalize">{item.condition}</span>
                      </div>
                      <button className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors" onClick={() => setForm({...form, exchangeEligibleProducts: form.exchangeEligibleProducts.filter((_: any, j: number) => i !== j)})}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <input 
                      id="exchange-brand-input"
                      className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" 
                      placeholder="Brand (e.g. Apple)" 
                    />
                  </div>
                  <div className="relative">
                    <input 
                      id="exchange-model-input"
                      className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" 
                      placeholder="Model (e.g. iPhone 13)" 
                    />
                  </div>
                  <div className="relative">
                    <select 
                      id="exchange-condition-input"
                      className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm appearance-none"
                    >
                      <option value="mint">Mint</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <button 
                      className="w-full h-full py-4 bg-orange-600 text-white rounded-2xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                      onClick={() => {
                        const brandInput = document.getElementById('exchange-brand-input') as HTMLInputElement;
                        const modelInput = document.getElementById('exchange-model-input') as HTMLInputElement;
                        const conditionInput = document.getElementById('exchange-condition-input') as HTMLSelectElement;
                        const brand = brandInput.value.trim();
                        const model = modelInput.value.trim();
                        const condition = conditionInput.value;
                        if (brand && model) {
                          setForm({...form, exchangeEligibleProducts: [...form.exchangeEligibleProducts, { brand, model, condition }]});
                          brandInput.value = '';
                          modelInput.value = '';
                          brandInput.focus();
                        }
                      }}
                    >
                      Add to List
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="ap-label text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Exchange Terms & Conditions</label>
                <textarea className="w-full p-4 bg-white border border-black/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm min-h-[100px]" value={form.exchangeDescription} onChange={e => setForm({...form, exchangeDescription: e.target.value})} placeholder="Describe the exchange process and rules..." />
              </div>
            </motion.div>
          )}
        </Section>

        <div className="ap-footer flex items-center gap-4 mt-12 mb-20">
          <button className="flex items-center gap-2 px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-colors mr-auto" onClick={handleBack}>
            <Trash2 size={18} /> Discard
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-black/5 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-colors shadow-sm" onClick={handleSave}>
            <Copy size={18} /> Duplicate
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-black/5 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-colors shadow-sm" onClick={handleSave}>
            <Save size={18} /> Save as Draft
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-2xl text-sm font-black hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20" onClick={handleSave}>
            <Check size={18} /> {isEditMode ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </div>
    </VendorLayout>
  );
};

export default AddProduct;
