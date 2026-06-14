import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, Plus, Minus, Trash2, 
  CheckCircle, AlertCircle, Package, ArrowRight
} from 'lucide-react';
import { Product } from '../../types';

const WholesalerBulkOrder = ({ onOrderComplete }: { onOrderComplete: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + (product.min_wholesale_qty || 1) } : item));
    } else {
      setCart([...cart, { ...product, quantity: product.min_wholesale_qty || 10 }]);
    }
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(item.min_wholesale_qty || 1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.wholesale_price || item.price) * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total, type: 'wholesale' })
    }).then(() => {
      alert('Wholesale order placed successfully!');
      setCart([]);
      onOrderComplete();
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
      <div className="lg:col-span-2 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Product Catalog</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex gap-4 hover:border-indigo-200 transition-colors">
              <img src={product.image} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-zinc-50" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{product.name}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 mb-2">{product.sku}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-600 font-bold text-sm sm:text-base">${(product.wholesale_price || product.price).toFixed(2)}</p>
                    <p className="text-[8px] sm:text-[10px] text-zinc-400">Min: {product.min_wholesale_qty || 10} units</p>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="bg-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Bulk Cart
          </h2>
          
          <div className="space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <p className="text-indigo-300 text-sm py-8 text-center">Your cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-xs text-indigo-300">${(item.wholesale_price || item.price).toFixed(2)} / unit</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-indigo-800/50 p-1 rounded-lg">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-indigo-700 rounded"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-indigo-700 rounded"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-indigo-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-indigo-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-indigo-300 text-sm">Subtotal</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-300 text-sm">Bulk Discount</span>
              <span className="text-emerald-400 font-bold">-$0.00</span>
            </div>
            <div className="flex justify-between items-center text-lg sm:text-xl font-bold pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-white text-indigo-900 py-3 sm:py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Bulk Order <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-600" /> Wholesale Terms
          </h3>
          <ul className="text-[10px] sm:text-xs text-zinc-500 space-y-2">
            <li>• Net 30 payment terms apply to all orders.</li>
            <li>• Minimum order value of $500 required.</li>
            <li>• Free freight on orders over $2,500.</li>
            <li>• 15% restocking fee on returns.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WholesalerBulkOrder;
