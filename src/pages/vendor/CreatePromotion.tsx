import React, { useState } from 'react';
import { Info, Zap, Ticket, Percent, Hash, PlusSquare, ChevronLeft, Calendar, Users, Target, ShieldCheck, Clock } from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';
import './CreatePromotion.css';

const CreatePromotion = ({ onBack }: { onBack: () => void }) => {
    // Form State
    const [promoName, setPromoName] = useState('');
    const [promoDescription, setPromoDescription] = useState('');
    const [internalNote, setInternalNote] = useState('');
    
    const [promoType, setPromoType] = useState<'automatic' | 'coupon'>('automatic');
    const [couponCode, setCouponCode] = useState('');
    
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'bogo'>('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    
    const [appliesTo, setAppliesTo] = useState<'all' | 'categories' | 'products'>('all');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    
    const [minRequirements, setMinRequirements] = useState<'none' | 'amount' | 'quantity'>('none');
    const [minAmount, setMinAmount] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    
    const [eligibility, setEligibility] = useState<'all' | 'segments'>('all');
    
    const [usageLimitTotal, setUsageLimitTotal] = useState('');
    const [usageLimitCustomer, setUsageLimitCustomer] = useState('');
    
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [noExpiry, setNoExpiry] = useState(false);

    const generateCouponCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCouponCode(result);
    };

    const handleSave = () => {
        const promotionData = {
            name: promoName,
            description: promoDescription,
            internalNote,
            type: promoType,
            couponCode: promoType === 'coupon' ? couponCode : null,
            discount: {
                type: discountType,
                value: parseFloat(discountValue),
                maxAmount: maxDiscount ? parseFloat(maxDiscount) : null
            },
            appliesTo,
            requirements: {
                type: minRequirements,
                value: minRequirements === 'amount' ? parseFloat(minAmount) : (minRequirements === 'quantity' ? parseInt(minQuantity) : null)
            },
            eligibility,
            limits: {
                total: usageLimitTotal ? parseInt(usageLimitTotal) : null,
                perCustomer: usageLimitCustomer ? parseInt(usageLimitCustomer) : null
            },
            schedule: {
                start: startDate,
                end: noExpiry ? null : endDate
            }
        };
        console.log('Saving Promotion:', promotionData);
        // Here you would call your API
        alert('Promotion created successfully!');
        onBack();
    };

    return (
        <VendorLayout title="Create New Promotion">
            <div className="create-promotion-container">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-black/40 hover:text-black font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Promotions
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="promotion-card">
                            <h3><Info className="w-5 h-5" /> Basic Information</h3>
                            <div className="form-group">
                                <label className="form-label">Promotion Name *</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="e.g. Summer Flash Sale 2026"
                                    value={promoName}
                                    onChange={(e) => setPromoName(e.target.value)}
                                />
                                <p className="text-[10px] text-black/30 mt-2">Customers will see this in their cart and at checkout.</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea 
                                    className="form-textarea h-24" 
                                    placeholder="Describe the promotion..."
                                    value={promoDescription}
                                    onChange={(e) => setPromoDescription(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Internal Note</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="For your reference only"
                                    value={internalNote}
                                    onChange={(e) => setInternalNote(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Promotion Type */}
                        <div className="promotion-card">
                            <h3><Ticket className="w-5 h-5" /> Promotion Type</h3>
                            <div className="type-selector mb-6">
                                <div 
                                    className={`type-option ${promoType === 'automatic' ? 'active' : ''}`}
                                    onClick={() => setPromoType('automatic')}
                                >
                                    <Zap className={`w-5 h-5 ${promoType === 'automatic' ? 'text-black' : 'text-black/20'}`} />
                                    <h4>Automatic</h4>
                                    <p>Applied automatically to eligible carts.</p>
                                </div>
                                <div 
                                    className={`type-option ${promoType === 'coupon' ? 'active' : ''}`}
                                    onClick={() => setPromoType('coupon')}
                                >
                                    <Hash className={`w-5 h-5 ${promoType === 'coupon' ? 'text-black' : 'text-black/20'}`} />
                                    <h4>Coupon Code</h4>
                                    <p>Customers must enter a code at checkout.</p>
                                </div>
                            </div>

                            {promoType === 'coupon' && (
                                <div className="form-group animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="form-label">Coupon Code *</label>
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            className="form-input font-mono uppercase" 
                                            placeholder="SUMMER2026"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                        <button 
                                            onClick={generateCouponCode}
                                            className="bg-black text-white px-6 rounded-xl font-bold text-xs whitespace-nowrap"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Discount Value */}
                        <div className="promotion-card">
                            <h3><Percent className="w-5 h-5" /> Discount Value</h3>
                            <div className="form-group">
                                <label className="form-label">Discount Type</label>
                                <div className="flex gap-4">
                                    {['percentage', 'fixed', 'bogo'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setDiscountType(type as any)}
                                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${discountType === type ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'}`}
                                        >
                                            {type === 'fixed' ? 'Fixed Amount' : type === 'bogo' ? 'Buy X Get Y' : 'Percentage'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="discount-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                                    </label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        placeholder={discountType === 'percentage' ? '10' : '500'}
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                    />
                                </div>
                                {discountType === 'percentage' && (
                                    <div className="form-group">
                                        <label className="form-label">Maximum Discount Amount (Optional)</label>
                                        <input 
                                            type="number" 
                                            className="form-input" 
                                            placeholder="e.g. 1000"
                                            value={maxDiscount}
                                            onChange={(e) => setMaxDiscount(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Eligibility */}
                        <div className="promotion-card">
                            <h3><Users className="w-5 h-5" /> Customer Eligibility</h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'all', label: 'All Customers' },
                                    { id: 'segments', label: 'Specific Customer Segments' }
                                ].map((opt) => (
                                    <div key={opt.id} className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="eligibility"
                                                checked={eligibility === opt.id}
                                                onChange={() => setEligibility(opt.id as any)}
                                                className="w-4 h-4 accent-black"
                                            />
                                            <span className="text-sm font-medium">{opt.label}</span>
                                        </label>
                                        {eligibility === 'segments' && opt.id === 'segments' && (
                                            <div className="ml-7 space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                {['New Customers', 'Returning Customers', 'Wholesale Partners', 'VIP Members'].map(segment => (
                                                    <label key={segment} className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors">
                                                        <input type="checkbox" className="w-3 h-3 accent-black rounded" />
                                                        <span className="text-xs">{segment}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Applies To */}
                        <div className="promotion-card">
                            <h3><Target className="w-5 h-5" /> Applies To</h3>
                            <div className="form-group">
                                <div className="flex gap-4">
                                    {['all', 'categories', 'products'].map((target) => (
                                        <button
                                            key={target}
                                            onClick={() => setAppliesTo(target as any)}
                                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${appliesTo === target ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'}`}
                                        >
                                            {target === 'all' ? 'All Products' : target === 'categories' ? 'Specific Categories' : 'Specific Products'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {appliesTo !== 'all' && (
                                <div className="form-group animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="form-label">Select {appliesTo === 'categories' ? 'Categories' : 'Products'}</label>
                                    <div className="p-4 bg-black/5 rounded-xl border border-black/5">
                                        <p className="text-xs text-black/40 italic">Search and select {appliesTo}...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Minimum Requirements */}
                        <div className="promotion-card">
                            <h3><ShieldCheck className="w-5 h-5" /> Minimum Requirements</h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'none', label: 'None' },
                                    { id: 'amount', label: 'Minimum Purchase Amount (₹)' },
                                    { id: 'quantity', label: 'Minimum Quantity of Items' }
                                ].map((req) => (
                                    <div key={req.id} className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="minReq"
                                                checked={minRequirements === req.id}
                                                onChange={() => setMinRequirements(req.id as any)}
                                                className="w-4 h-4 accent-black"
                                            />
                                            <span className="text-sm font-medium">{req.label}</span>
                                        </label>
                                        {minRequirements === req.id && req.id !== 'none' && (
                                            <input 
                                                type="number" 
                                                className="form-input ml-7 w-[calc(100%-28px)]" 
                                                placeholder={req.id === 'amount' ? '999' : '3'}
                                                value={req.id === 'amount' ? minAmount : minQuantity}
                                                onChange={(e) => req.id === 'amount' ? setMinAmount(e.target.value) : setMinQuantity(e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Usage Limits */}
                        <div className="promotion-card">
                            <h3><PlusSquare className="w-5 h-5" /> Usage Limits</h3>
                            <div className="space-y-6">
                                <div className="form-group">
                                    <label className="form-label">Total Usage Limit</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        placeholder="No limit"
                                        value={usageLimitTotal}
                                        onChange={(e) => setUsageLimitTotal(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Limit per Customer</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        placeholder="1"
                                        value={usageLimitCustomer}
                                        onChange={(e) => setUsageLimitCustomer(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Active Dates */}
                        <div className="promotion-card">
                            <h3><Calendar className="w-5 h-5" /> Active Dates</h3>
                            <div className="space-y-6">
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                                        <input 
                                            type="datetime-local" 
                                            className="form-input pl-10" 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {!noExpiry && (
                                    <div className="form-group">
                                        <label className="form-label">End Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                                            <input 
                                                type="datetime-local" 
                                                className="form-input pl-10" 
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={noExpiry}
                                        onChange={(e) => setNoExpiry(e.target.checked)}
                                        className="w-4 h-4 accent-black rounded"
                                    />
                                    <span className="text-sm font-medium">No end date</span>
                                </label>
                            </div>
                        </div>

                        {/* Summary Preview */}
                        <div className="promotion-card bg-black text-white border-none shadow-xl">
                            <h3><ShieldCheck className="w-5 h-5 text-emerald-400" /> Promotion Summary</h3>
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-white/10">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-sm font-bold">Ready to Launch</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Discount</p>
                                        <p className="text-lg font-bold">
                                            {discountValue ? (discountType === 'percentage' ? `${discountValue}% Off` : `₹${discountValue} Off`) : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Type</p>
                                        <p className="text-lg font-bold capitalize">{promoType}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Minimum Requirement</p>
                                    <p className="text-sm">
                                        {minRequirements === 'none' ? 'No minimum' : (minRequirements === 'amount' ? `Min. spend ₹${minAmount || '0'}` : `Min. quantity ${minQuantity || '0'}`)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Active Period</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-3 h-3 text-white/40" />
                                        <span>{startDate ? new Date(startDate).toLocaleDateString() : 'Immediate'} — {noExpiry ? 'Forever' : (endDate ? new Date(endDate).toLocaleDateString() : '—')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-actions">
                    <button onClick={onBack} className="btn-cancel">Discard Changes</button>
                    <button onClick={handleSave} className="btn-save">Create Promotion</button>
                </div>
            </div>
        </VendorLayout>
    );
};

export default CreatePromotion;
