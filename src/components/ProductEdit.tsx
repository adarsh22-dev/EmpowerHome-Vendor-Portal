import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Globe, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Layers, 
  RotateCcw, 
  Settings,
  Info,
  Package,
  ChevronRight,
  ChevronDown,
  Search,
  ArrowUpRight,
  Smartphone,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, ProductVariation, ProductAttribute } from '../types';
import { useForm, useFieldArray } from 'react-hook-form';
import AIPhase1 from './AIPhase1';

interface ProductEditProps {
  product?: Product;
  categories: Category[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const ProductEdit: React.FC<ProductEditProps> = ({ product, categories, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [upsellSearch, setUpsellSearch] = useState('');
  const [crossSellSearch, setCrossSellSearch] = useState('');
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: product || {
      name: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: categories[0]?.id,
      is_exchangeable: false,
      policies: { shipping: '', refund: '', cancellation: '' },
      seo: { title: '', description: '', keywords: '' },
      upsell_ids: [],
      cross_sell_ids: [],
      extra_attributes: [],
      tax: { status: 'taxable', class: 'standard' },
      shipping_details: { weight: 0, dimensions: { l: 0, w: 0, h: 0 }, class: '' },
      vendor_tags: [],
      manufacturer_images: [],
      technical_details: [],
      rotation_360_images: [],
      variations: [],
      attributes: [],
      exchange_details: { enabled: false, base_price: 0, conditions: [] }
    }
  });

  const handleGenerateSEO = async () => {
    const productName = watch('name');
    const productDesc = watch('description');
    
    if (!productName) {
      alert('Please fill out the product name first before generating SEO!');
      return;
    }
    
    setIsGeneratingSEO(true);
    try {
      const response = await fetch('/api/gemini/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: productName,
          description: productDesc,
          category: categories.find(c => c.id === Number(watch('category_id')))?.name || 'General'
        })
      });
      const data = await response.json();
      
      if (data.seoTitle) setValue('seo.title', data.seoTitle);
      if (data.seoDescription) setValue('seo.description', data.seoDescription);
      if (data.keywords) setValue('seo.keywords', Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords);
    } catch (err) {
      console.error('Failed to generate SEO:', err);
      alert('Failed to generate SEO utilizing Gemini. Check console log.');
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setAllProducts);
  }, []);

  const upsellIds = watch('upsell_ids') || [];
  const crossSellIds = watch('cross_sell_ids') || [];

  const handleAddUpsell = (id: number) => {
    if (!upsellIds.includes(id)) {
      setValue('upsell_ids', [...upsellIds, id]);
    }
    setUpsellSearch('');
  };

  const handleRemoveUpsell = (id: number) => {
    setValue('upsell_ids', upsellIds.filter((i: number) => i !== id));
  };

  const handleAddCrossSell = (id: number) => {
    if (!crossSellIds.includes(id)) {
      setValue('cross_sell_ids', [...crossSellIds, id]);
    }
    setCrossSellSearch('');
  };

  const handleRemoveCrossSell = (id: number) => {
    setValue('cross_sell_ids', crossSellIds.filter((i: number) => i !== id));
  };

  const tabs = [
    'General',
    'Pricing & Inventory',
    'Media',
    'Variations & Attributes',
    'SEO',
    'AI Product Intelligence',
    'Policies',
    'Shipping & Tax',
    'Upsell & Cross Sell',
    'Technical Details',
    'Exchange Product',
    'Extra Attributes'
  ];

  const onSubmit = (data: any) => {
    console.log("Submitting product data:", data);
    onSave(data);
  };

  const onInvalid = (errors: any) => {
    console.error("Form validation errors:", errors);
    alert("Please fill in all required fields correctly.");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'General':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Product Name *</label>
                <input 
                  {...register('name', { required: true })}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">SKU</label>
                <input 
                  {...register('sku')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="Product SKU"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Category</label>
                <select 
                  {...register('category_id')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Brand</label>
                <input 
                  {...register('brand')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                  placeholder="Manufacturer Brand"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Short Description</label>
              <textarea 
                {...register('short_description')}
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-20 resize-none"
                placeholder="A brief summary of the product..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Description</label>
              <textarea 
                {...register('description')}
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-32 resize-none"
                placeholder="Full product description..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Additional Details</label>
              <textarea 
                {...register('additional_details')}
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                placeholder="Any other information..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Vendor Tags (Comma separated)</label>
              <input 
                {...register('vendor_tags')}
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        );
      case 'Pricing & Inventory':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Regular Price ($)</label>
                <input 
                  type="number" step="0.01"
                  {...register('price', { required: true })}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Sale Price ($)</label>
                <input 
                  type="number" step="0.01"
                  {...register('sale_price')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Wholesale Price ($)</label>
                <input 
                  type="number" step="0.01"
                  {...register('wholesale_price')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Stock Quantity</label>
                <input 
                  type="number"
                  {...register('stock', { required: true })}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Stock Status</label>
                <select 
                  {...register('stock_status')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                >
                  <option value="instock">In Stock</option>
                  <option value="outofstock">Out of Stock</option>
                  <option value="onbackorder">On Backorder</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Wholesale Tiers</h4>
              <WholesaleTierFields control={control} register={register} />
            </div>
          </div>
        );
      case 'Media':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Main Product Image URL</label>
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-black/5 rounded-2xl flex items-center justify-center overflow-hidden border border-black/5">
                  <ImageIcon className="w-8 h-8 text-black/10" />
                </div>
                <input 
                  {...register('image')}
                  className="flex-1 bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10 h-fit self-center"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Gallery Images</h4>
              <DynamicUrlList name="images" control={control} register={register} label="Gallery Image URL" />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Manufacturer Images</h4>
              <DynamicUrlList name="manufacturer_images" control={control} register={register} label="Manufacturer Image URL" />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">360° Rotation Images</h4>
              <p className="text-[10px] text-black/40">Add multiple images to create a 360-degree view effect.</p>
              <DynamicUrlList name="rotation_360_images" control={control} register={register} label="Rotation Image URL" />
            </div>
          </div>
        );
      case 'Variations & Attributes':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Product Attributes</h4>
              <AttributeFields control={control} register={register} />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Product Variations</h4>
              <VariationFields control={control} register={register} />
            </div>
          </div>
        );
      case 'AI Product Intelligence':
        return (
          <div className="space-y-6">
            <AIPhase1
              productData={{
                name: watch('name'),
                sku: watch('sku'),
                description: watch('description'),
                short_description: watch('short_description'),
                category: categories.find(c => c.id === Number(watch('category_id')))?.name || 'General',
                brand: watch('brand'),
                price: watch('price'),
                sale_price: watch('sale_price'),
                stock: watch('stock'),
                material: watch('material'),
                warranty: watch('warranty'),
                origin: watch('origin'),
                image: watch('image'),
                images: watch('images'),
                vendor_tags: watch('vendor_tags'),
                weight: watch('shipping_details')?.weight,
                dimensions: watch('shipping_details')?.dimensions,
                seo: watch('seo'),
                technical_details: watch('technical_details'),
                additional_details: watch('additional_details'),
                extra_attributes: watch('extra_attributes'),
                id: product?.id
              }}
              onApply={(field, value) => {
                switch (field) {
                  case 'description': setValue('description', value as string); break;
                  case 'shortDesc': setValue('short_description', value as string); break;
                  case 'seoTitle': setValue('seo.title', value as string); break;
                  case 'seoDesc': setValue('seo.description', value as string); break;
                  case 'metaKeywords': setValue('seo.keywords', Array.isArray(value) ? value.join(', ') : value as string); break;
                  case 'bulletPoints': setValue('description', (watch('description') || '') + '\n\n' + (value as string[]).map((p, i) => `${i + 1}. ${p}`).join('\n')); break;
                }
              }}
            />
          </div>
        );

      case 'SEO':
        return (
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-black/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xs shrink-0">AI</div>
                <div>
                  <h4 className="font-bold text-xs tracking-tight">AI SEO Studio for NovaCart</h4>
                  <p className="text-[10px] text-zinc-500">Automatically generate perfectly styled title tags, meta descriptions, and keywords using Gemini AI models.</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isGeneratingSEO}
                onClick={handleGenerateSEO}
                className="self-start sm:self-center bg-black hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-md shadow-black/5 shrink-0"
              >
                {isGeneratingSEO ? 'Generating...' : 'Generate with Gemini'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">SEO Title</label>
              <input 
                {...register('seo.title')}
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                placeholder="SEO Title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Meta Description</label>
              <textarea 
                {...register('seo.description')}
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                placeholder="Meta Description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Meta Keywords</label>
              <input 
                {...register('seo.keywords')}
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                placeholder="Keywords separated by commas"
              />
            </div>
          </div>
        );
      case 'Policies':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Shipping Policy</label>
              <textarea 
                {...register('policies.shipping')}
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                placeholder="Shipping Policy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Refund Policy</label>
              <textarea 
                {...register('policies.refund')}
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                placeholder="Refund Policy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Cancellation Policy</label>
              <textarea 
                {...register('policies.cancellation')}
                className="w-full bg-black/5 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-black/10 h-24 resize-none"
                placeholder="Cancellation Policy"
              />
            </div>
          </div>
        );
      case 'Shipping & Tax':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Tax Status</label>
                <select 
                  {...register('tax.status')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                >
                  <option value="taxable">Taxable</option>
                  <option value="shipping">Shipping only</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Tax Class</label>
                <select 
                  {...register('tax.class')}
                  className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                >
                  <option value="standard">Standard</option>
                  <option value="reduced">Reduced Rate</option>
                  <option value="zero">Zero Rate</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Shipping Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase">Weight (kg)</label>
                  <input type="number" step="0.1" {...register('shipping_details.weight')} className="w-full bg-black/5 border-none rounded-xl py-2 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase">Length (cm)</label>
                  <input type="number" {...register('shipping_details.dimensions.l')} className="w-full bg-black/5 border-none rounded-xl py-2 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase">Width (cm)</label>
                  <input type="number" {...register('shipping_details.dimensions.w')} className="w-full bg-black/5 border-none rounded-xl py-2 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/40 uppercase">Height (cm)</label>
                  <input type="number" {...register('shipping_details.dimensions.h')} className="w-full bg-black/5 border-none rounded-xl py-2 px-3 text-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'Upsell & Cross Sell':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Upsells</h4>
              <p className="text-xs text-black/40">Upsells are products which you recommend instead of the currently viewed product.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                  <input 
                    type="text" 
                    value={upsellSearch}
                    onChange={(e) => setUpsellSearch(e.target.value)}
                    placeholder="Search products to add as upsells..." 
                    className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm" 
                  />
                  {upsellSearch && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-black/5 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {allProducts
                        .filter(p => p.id !== product?.id && p.name.toLowerCase().includes(upsellSearch.toLowerCase()) && !upsellIds.includes(p.id))
                        .map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleAddUpsell(p.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 transition-colors flex items-center gap-3"
                          >
                            <img src={p.image} className="w-8 h-8 rounded object-cover" />
                            <span>{p.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {upsellIds.map((id: number) => {
                    const p = allProducts.find(prod => prod.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-sm font-medium truncate max-w-[150px]">{p.name}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveUpsell(id)} className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold border-b border-black/5 pb-2">Cross-sells</h4>
              <p className="text-xs text-black/40">Cross-sells are products which you promote in the cart, based on the current product.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                  <input 
                    type="text" 
                    value={crossSellSearch}
                    onChange={(e) => setCrossSellSearch(e.target.value)}
                    placeholder="Search products to add as cross-sells..." 
                    className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm" 
                  />
                  {crossSellSearch && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-black/5 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {allProducts
                        .filter(p => p.id !== product?.id && p.name.toLowerCase().includes(crossSellSearch.toLowerCase()) && !crossSellIds.includes(p.id))
                        .map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleAddCrossSell(p.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 transition-colors flex items-center gap-3"
                          >
                            <img src={p.image} className="w-8 h-8 rounded object-cover" />
                            <span>{p.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {crossSellIds.map((id: number) => {
                    const p = allProducts.find(prod => prod.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-sm font-medium truncate max-w-[150px]">{p.name}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveCrossSell(id)} className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Technical Details':
        return (
          <div className="space-y-6">
            <h4 className="text-sm font-bold border-b border-black/5 pb-2">Technical Specifications</h4>
            <DynamicKeyValueList name="technical_details" control={control} register={register} />
          </div>
        );
      case 'Exchange Product':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-black text-white rounded-3xl">
              <div>
                <h4 className="font-bold text-lg">Enable Exchange System</h4>
                <p className="text-sm text-white/60">Allow customers to trade-in old devices for this product.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('exchange_details.enabled')} className="sr-only peer" />
                <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            
            <AnimatePresence>
              {watch('exchange_details.enabled') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/60 uppercase tracking-widest">Base Exchange Value ($)</label>
                    <input 
                      type="number" step="0.01"
                      {...register('exchange_details.base_price')}
                      className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-black/10"
                      placeholder="Max value for perfect condition"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold border-b border-black/5 pb-2">Condition Modifiers</h4>
                    <p className="text-xs text-black/40">Define how much value to deduct based on device condition.</p>
                    <ExchangeConditionFields control={control} register={register} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'Extra Attributes':
        return (
          <div className="space-y-6">
            <h4 className="text-sm font-bold border-b border-black/5 pb-2">Custom Extra Attributes</h4>
            <DynamicKeyValueList name="extra_attributes" control={control} register={register} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex h-[85vh]"
      >
        {/* Sidebar Tabs */}
        <aside className="w-72 bg-zinc-50 border-r border-black/5 flex flex-col">
          <div className="p-8 border-b border-black/5">
            <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
            <p className="text-xs text-black/40 mt-1">Manage all details for your product</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab 
                  ? 'bg-black text-white shadow-lg shadow-black/10' 
                  : 'text-black/60 hover:bg-black/5 hover:text-black'
                }`}
              >
                {tab}
                {activeTab === tab && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
          <div className="p-6 border-t border-black/5">
            <button 
              onClick={handleSubmit(onSubmit, onInvalid)}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="px-10 py-6 border-b border-black/5 flex items-center justify-between bg-white sticky top-0 z-10">
            <h3 className="text-xl font-bold tracking-tight">{activeTab}</h3>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-10">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
              {renderTabContent()}
            </form>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

// --- Helper Components for Dynamic Fields ---

const DynamicUrlList = ({ name, control, register, label }: any) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input 
            {...register(`${name}.${index}.url`)}
            className="flex-1 bg-black/5 border-none rounded-xl py-2 px-4 text-sm"
            placeholder={label}
          />
          <button type="button" onClick={() => remove(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ url: '' })}
        className="flex items-center gap-2 text-xs font-bold text-black/40 hover:text-black transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Image
      </button>
    </div>
  );
};

const DynamicKeyValueList = ({ name, control, register }: any) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input 
            {...register(`${name}.${index}.label`)}
            className="w-1/3 bg-black/5 border-none rounded-xl py-2 px-4 text-sm"
            placeholder="Label (e.g. Material)"
          />
          <input 
            {...register(`${name}.${index}.value`)}
            className="flex-1 bg-black/5 border-none rounded-xl py-2 px-4 text-sm"
            placeholder="Value (e.g. Cotton)"
          />
          <button type="button" onClick={() => remove(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ label: '', value: '' })}
        className="flex items-center gap-2 text-xs font-bold text-black/40 hover:text-black transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Attribute
      </button>
    </div>
  );
};

const WholesaleTierFields = ({ control, register }: any) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'wholesale_tiers' });
  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-3 gap-2">
          <input 
            type="number"
            {...register(`wholesale_tiers.${index}.min_quantity`)}
            className="bg-black/5 border-none rounded-xl py-2 px-4 text-sm"
            placeholder="Min Qty"
          />
          <input 
            type="number"
            {...register(`wholesale_tiers.${index}.price`)}
            className="bg-black/5 border-none rounded-xl py-2 px-4 text-sm"
            placeholder="Price per unit"
          />
          <button type="button" onClick={() => remove(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg w-fit">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ min_quantity: 0, price: 0 })}
        className="flex items-center gap-2 text-xs font-bold text-black/40 hover:text-black transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Tier
      </button>
    </div>
  );
};

const AttributeFields = ({ control, register }: any) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' });
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 bg-black/5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <input 
              {...register(`attributes.${index}.name`)}
              className="bg-transparent border-none font-bold text-sm focus:ring-0 p-0"
              placeholder="Attribute Name (e.g. Color)"
            />
            <button type="button" onClick={() => remove(index)} className="text-rose-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input 
            {...register(`attributes.${index}.values`)}
            className="w-full bg-white border-none rounded-xl py-2 px-4 text-xs"
            placeholder="Values (comma separated: Red, Blue, Green)"
          />
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ name: '', values: '' })}
        className="flex items-center gap-2 text-xs font-bold text-black/40 hover:text-black transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Attribute
      </button>
    </div>
  );
};

const VariationFields = ({ control, register }: any) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'variations' });
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border border-black/5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <input 
              {...register(`variations.${index}.name`)}
              className="bg-transparent border-none font-bold text-sm focus:ring-0 p-0"
              placeholder="Variation Name (e.g. XL / Red)"
            />
            <button type="button" onClick={() => remove(index)} className="text-rose-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" {...register(`variations.${index}.price`)} className="bg-black/5 border-none rounded-xl py-2 px-3 text-xs" placeholder="Price" />
            <input type="number" {...register(`variations.${index}.stock`)} className="bg-black/5 border-none rounded-xl py-2 px-3 text-xs" placeholder="Stock" />
            <input {...register(`variations.${index}.sku`)} className="bg-black/5 border-none rounded-xl py-2 px-3 text-xs" placeholder="SKU" />
          </div>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ name: '', price: 0, stock: 0, sku: '' })}
        className="flex items-center gap-2 text-xs font-bold text-black/40 hover:text-black transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Variation
      </button>
    </div>
  );
};

const ExchangeConditionFields = ({ control, register }: any) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'exchange_details.conditions' });
  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-3 gap-2">
          <input 
            {...register(`exchange_details.conditions.${index}.name`)}
            className="bg-black/5 border-none rounded-xl py-2 px-4 text-sm"
            placeholder="Condition (e.g. Cracked Screen)"
          />
          <input 
            type="number"
            {...register(`exchange_details.conditions.${index}.price_modifier`)}
            className="bg-black/5 border-none rounded-xl py-2 px-4 text-sm"
            placeholder="Deduction Amount ($)"
          />
          <button type="button" onClick={() => remove(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg w-fit">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ name: '', price_modifier: 0 })}
        className="flex items-center gap-2 text-xs font-bold text-black/40 hover:text-black transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Condition
      </button>
    </div>
  );
};

export default ProductEdit;
