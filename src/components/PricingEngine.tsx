import React, { useState, useEffect } from 'react';
import { DollarSign, Loader, RefreshCw, TrendingUp, Package, Calendar } from 'lucide-react';

export default function PricingEngine() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/pricing-engine', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
      });
      setResult(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-600" /> AI Pricing Engine
          </h2>
          <p className="text-black/40 text-sm mt-1">Dynamic pricing recommendations based on demand, inventory, and seasonal trends</p>
        </div>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> Analyzing...</> : <><RefreshCw className="w-4 h-4" /> Refresh</>}
        </button>
      </div>

      {loading && !result && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" /><p className="font-bold">Calculating optimal prices...</p></div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Pricing Recommendations */}
          {result.pricingRecommendations?.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Product Pricing Recommendations</h3>
              {result.pricingRecommendations.map((p: any, i: number) => (
                <div key={i} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">{p.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Elasticity: {p.elasticity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 p-4 bg-gray-50 rounded-xl text-center border border-gray-200">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Current Price</p>
                      <p className="text-2xl font-black text-gray-800">${p.currentPrice}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div className="flex-1 p-4 bg-emerald-50 rounded-xl text-center border border-emerald-200">
                      <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Suggested Price</p>
                      <p className="text-2xl font-black text-emerald-700">${p.suggestedPrice}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <span>Range: ${p.minPrice} - ${p.maxPrice}</span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-bold">{p.expectedDemandIncrease}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3 p-3 bg-gray-50 rounded-xl">{p.reasoning}</p>
                  {p.competitorPrice && <p className="text-xs text-gray-500 mt-2">Competitor price: ${p.competitorPrice}</p>}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seasonal Adjustments */}
            {result.seasonalAdjustments?.length > 0 && (
              <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-indigo-600" /><h3 className="font-bold">Seasonal Adjustments</h3></div>
                <div className="space-y-2">
                  {result.seasonalAdjustments.map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm font-bold">{s.season}</p>
                        <p className="text-[10px] text-gray-400">{s.startDate} - {s.endDate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.multiplier > 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {s.multiplier > 1 ? '+' : ''}{Math.round((s.multiplier-1)*100)}% 
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bundle Suggestions */}
            {result.bundleSuggestions?.length > 0 && (
              <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4"><Package className="w-5 h-5 text-amber-600" /><h3 className="font-bold">Bundle Suggestions</h3></div>
                <div className="space-y-2">
                  {result.bundleSuggestions.map((b: any, i: number) => (
                    <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {b.productNames?.map((n: string, j: number) => (
                          <span key={j} className="px-2 py-1 bg-white rounded-lg text-xs font-bold border border-amber-200">{n}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-amber-800">${b.bundlePrice}</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Save ${b.savings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Margin Analysis */}
          {result.marginAnalysis?.length > 0 && (
            <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Margin Analysis</h3>
              <div className="space-y-3">
                {result.marginAnalysis.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">{m.productId}</div>
                      <div><p className="text-sm font-bold">{m.name}</p><p className="text-[10px] text-gray-400">Price headroom: ${m.priceHeadroom}</p></div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{m.currentMargin}%</span>
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-600">{m.targetMargin}%</span>
                      </div>
                      <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-500 rounded-full" style={{width:`${(m.currentMargin/m.targetMargin)*100}%`}} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
