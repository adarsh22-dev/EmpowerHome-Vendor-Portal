import React, { useState } from 'react';
import { Camera, Search, Loader, Check } from 'lucide-react';

export default function VisualSearch() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!imageUrl.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setResult({
      similarProducts: [
        { name: 'Modern Minimalist Chair', image: 'https://placehold.co/200x200/e2e8f0/475569?text=Chair', price: 249.99, confidence: 92, matchReason: 'Similar shape and color palette' },
        { name: 'Ergonomic Office Chair', image: 'https://placehold.co/200x200/e2e8f0/475569?text=Ergo', price: 329.99, confidence: 78, matchReason: 'Similar design language' },
        { name: 'Premium Desk Chair', image: 'https://placehold.co/200x200/e2e8f0/475569?text=Desk', price: 189.99, confidence: 65, matchReason: 'Matches by category and style' },
        { name: 'Adjustable Stool', image: 'https://placehold.co/200x200/e2e8f0/475569?text=Stool', price: 119.99, confidence: 55, matchReason: 'Related seating product' }
      ],
      colorMatches: ['Charcoal', 'Slate Gray', 'Black', 'Dark Walnut'],
      styleRecommendations: ['Modern minimalist', 'Scandinavian design', 'Industrial chic'],
      priceAlternatives: [
        { name: 'Budget Option - Basic Chair', price: 89.99, diff: -64 },
        { name: 'Premium - Designer Chair', price: 449.99, diff: 80 }
      ]
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Camera className="w-8 h-8 text-indigo-600" /> Visual Search
          </h2>
          <p className="text-black/40 text-sm mt-1">Upload an image URL to find similar products, colors, and styles</p>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Image URL</label>
        <div className="flex gap-3">
          <input
            value={imageUrl} onChange={e => setImageUrl(e.target.value)}
            placeholder="https://example.com/product-image.jpg"
            className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading} className="px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Search
          </button>
        </div>
        {imageUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
            <img src={imageUrl} className="w-20 h-20 rounded-xl object-cover border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="text-xs text-gray-500">Preview of uploaded image URL</div>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          {result.similarProducts?.length > 0 && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Similar Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.similarProducts.map((p: any, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    {p.image && <img src={p.image} className="w-full h-32 object-cover rounded-lg mb-2" />}
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    <p className="text-sm font-bold text-indigo-600">${p.price}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.confidence||50}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{p.confidence||50}%</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{p.matchReason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.colorMatches?.length > 0 && (
              <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h4 className="font-bold text-sm mb-3">Color Matches</h4>
                <div className="flex flex-wrap gap-2">
                  {result.colorMatches.map((c: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold border" style={{ backgroundColor: c.toLowerCase(), color: ['black','navy','dark'].some(k=>c.toLowerCase().includes(k))?'white':'black' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.styleRecommendations?.length > 0 && (
              <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h4 className="font-bold text-sm mb-3">Style Recommendations</h4>
                <div className="space-y-2">
                  {result.styleRecommendations.map((s: string, i: number) => (
                    <div key={i} className="p-3 bg-indigo-50 rounded-xl text-sm font-bold text-indigo-700 flex items-center gap-2">
                      <Check className="w-4 h-4" /> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.priceAlternatives?.length > 0 && (
              <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h4 className="font-bold text-sm mb-3">Price Alternatives</h4>
                <div className="space-y-2">
                  {result.priceAlternatives.map((a: any, i: number) => (
                    <div key={i} className="p-3 bg-emerald-50 rounded-xl">
                      <p className="text-sm font-bold">{a.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-black text-emerald-700">${a.price}</span>
                        <span className="text-xs font-bold text-emerald-600">{a.diff > 0 ? '+' : ''}{a.diff}% vs original</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
