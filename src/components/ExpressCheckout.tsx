import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Truck, Loader, CreditCard, Smartphone, Lock, AlertTriangle, CheckCircle, X, Wallet, Banknote, Building, ChevronRight } from 'lucide-react';

interface ExpressCheckoutProps {
  product: { id: number; name: string; price: number; image: string; stock: number };
  onClose: () => void;
  onSuccess: (orderId: number) => void;
  user?: { id?: number; name?: string; email?: string; phone?: string } | null;
}

const SAVED_USERS_KEY = 'nexus_express_profiles';

export default function ExpressCheckout({ product, onClose, onSuccess, user }: ExpressCheckoutProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'loading' | 'success' | 'flagged'>('form');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', pincode: '', address: '' });
  const [paymentMode, setPaymentMode] = useState<'card' | 'upi' | 'cod' | null>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_USERS_KEY) || '[]');
      setSavedProfiles(saved);
    } catch {}
  }, []);

  const handleBuyNow = async () => {
    setStep('payment');
  };

  const placeOrder = async () => {
    setStep('loading');
    try {
      const res = await fetch('/api/express-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          payment_mode: paymentMode,
          customer: { ...form, userId: user?.id || 1 }
        })
      });
      const data = await res.json();
      if (data.status === 'flagged') {
        setRiskData(data);
        setStep('flagged');
      } else if (data.status === 'success') {
        const profiles = [...savedProfiles];
        if (!profiles.find(p => p.email === form.email)) {
          profiles.push({ name: form.name, email: form.email, phone: form.phone, pincode: form.pincode });
          localStorage.setItem(SAVED_USERS_KEY, JSON.stringify(profiles.slice(0, 3)));
        }
        setRiskData(data);
        setStep('success');
        setTimeout(() => { onSuccess(data.orderId); onClose(); }, 2500);
      }
    } catch {
      setStep('form');
    }
  };

  const loadProfile = (profile: any) => {
    setForm({ ...form, ...profile });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full z-10">
          <X className="w-5 h-5" />
        </button>

        {step === 'form' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Express Checkout</h3>
                <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">1-Click Checkout • Free Delivery</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 border border-gray-200">
              <img src={product.image} alt="" className="w-16 h-16 rounded-xl object-cover ring-2 ring-white" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xl font-black">${product.price.toFixed(2)}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">In Stock</span>
                </div>
                <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1"><Truck className="w-3 h-3" /> Free Shipping • 3-5 days</p>
              </div>
            </div>

            {savedProfiles.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Quick Select</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {savedProfiles.map((p, i) => (
                    <button key={i} onClick={() => loadProfile(p)} className="flex-shrink-0 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors">
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" className="col-span-2 sm:col-span-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" required />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" type="tel" className="col-span-2 sm:col-span-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" required />
              </div>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email Address" type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" required />
              <div className="grid grid-cols-3 gap-3">
                <input value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} placeholder="Pincode" className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" required />
                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="House / Flat No." className="col-span-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" required />
              </div>
            </div>

            <button onClick={handleBuyNow} disabled={!form.name||!form.email||!form.phone||!form.pincode} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98]">
              Continue to Payment <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 100% Protected</span>
              <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Free Ship</span>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6 sm:p-8">
            <button onClick={() => setStep('form')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-1">
              ← Back to details
            </button>

            <h3 className="font-bold text-lg mb-1">Choose Payment</h3>
            <p className="text-xs text-gray-400 mb-6">Select your preferred payment method</p>

            <div className="space-y-3 mb-6">
              <button onClick={() => setPaymentMode('upi')} className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${paymentMode === 'upi' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMode === 'upi' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">UPI</p>
                  <p className="text-[10px] text-gray-400">Google Pay, PhonePe, Paytm</p>
                </div>
                {paymentMode === 'upi' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
              </button>

              <button onClick={() => setPaymentMode('card')} className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${paymentMode === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMode === 'card' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Credit / Debit Card</p>
                  <p className="text-[10px] text-gray-400">Visa, Mastercard, RuPay</p>
                </div>
                {paymentMode === 'card' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
              </button>

              <button onClick={() => setPaymentMode('cod')} className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${paymentMode === 'cod' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMode === 'cod' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Cash on Delivery</p>
                  <p className="text-[10px] text-gray-400">Pay when you receive</p>
                </div>
                {paymentMode === 'cod' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
              </button>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-amber-200 mt-2 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={placeOrder} disabled={!paymentMode} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Pay ${product.price.toFixed(2)}
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secured by Nexus Pay
            </p>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-12 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <h3 className="font-bold text-lg mb-2">Processing Order</h3>
            <p className="text-sm text-gray-500 mb-6">Running fraud checks & securing payment...</p>
            <div className="max-w-xs mx-auto space-y-3">
              {[
                { label: 'Verifying details', done: true },
                { label: 'Fraud & risk analysis', done: true },
                { label: paymentMode === 'upi' ? 'UPI payment' : paymentMode === 'card' ? 'Card payment' : 'COD confirmation', done: false },
                { label: 'Confirming order', done: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${s.done ? 'bg-emerald-100 text-emerald-600' : 'border-2 border-gray-300'}`}>
                    {s.done ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                  </div>
                  <span className={s.done ? 'text-gray-800 font-medium' : 'text-gray-400'}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'success' && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <h3 className="font-bold text-2xl mb-2">Order Confirmed!</h3>
            <p className="text-sm text-gray-500 mb-2">Order #ORD-{riskData?.orderId}</p>
            <p className="text-xs text-gray-400 mb-6">Confirmation sent to {form.email}</p>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
              <p className="text-xs font-bold text-emerald-700">Estimated Delivery</p>
              <p className="text-2xl font-black text-emerald-800 mt-1">{riskData?.estimatedDelivery || '3-5 days'}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-6">✓ Fraud check passed • Order secured</p>
          </motion.div>
        )}

        {step === 'flagged' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Security Check Required</h3>
            <p className="text-sm text-gray-500 mb-6">{riskData?.message || 'Our system flagged this order for verification.'}</p>
            {riskData?.requiresOTP && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-6">
                <p className="text-xs font-bold text-amber-700 mb-3">OTP sent to {form.phone}</p>
                <div className="flex gap-2 justify-center">
                  {[0,1,2,3].map(i => (
                    <input key={i} maxLength={1} className="w-12 h-12 text-center bg-white border-2 border-amber-200 rounded-xl text-lg font-bold outline-none focus:border-amber-500 transition-all" />
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 p-3 bg-gray-100 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={placeOrder} className="flex-1 p-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">Retry</button>
            </div>
          </div>
        )}

        <div className="px-6 pb-4 flex items-center justify-center gap-6 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Cards</span>
          <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> UPI</span>
          <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> Wallet</span>
          <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> COD</span>
          <span className="flex items-center gap-1"><Building className="w-3 h-3" /> Net Banking</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
