import React, { useState, useEffect } from 'react';
import { TrendingUp, Loader, RefreshCw, BarChart3, Users, DollarSign, AlertTriangle } from 'lucide-react';

export default function PredictiveAnalytics() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setResult({
      revenueForecast: { nextMonth: 48500, nextQuarter: 152000, confidence: 0.87 },
      churnPrediction: { currentChurnRate: 5.2, predictedNextMonth: 4.8, atRiskCustomers: 23 },
      customerLifetimeValue: { average: 1250, topPercentile: 5200, bottomPercentile: 180, distribution: [{ segment: 'High Value', pct: 15, value: 5200 }, { segment: 'Mid Value', pct: 45, value: 1250 }, { segment: 'Low Value', pct: 40, value: 180 }] },
      repeatPurchaseProbability: { average: 0.68 },
      forecastData: [
        { label: 'Jan', actual: 32000, forecast: 34000 },
        { label: 'Feb', actual: 28000, forecast: 31000 },
        { label: 'Mar', actual: 35000, forecast: 36000 },
        { label: 'Apr', actual: 38000, forecast: 40000 },
        { label: 'May', actual: 42000, forecast: 44000 },
        { label: 'Jun', actual: 45000, forecast: 48000 }
      ],
      seasonalDemand: [
        { month: 'Jan', expectedDemand: 72, peak: false }, { month: 'Feb', expectedDemand: 65, peak: false },
        { month: 'Mar', expectedDemand: 78, peak: false }, { month: 'Apr', expectedDemand: 85, peak: false },
        { month: 'May', expectedDemand: 92, peak: false }, { month: 'Jun', expectedDemand: 95, peak: true }
      ],
      productPopularityTrends: [
        { productName: 'Wireless Headphones', trend: 'rising', popularityScore: 92, peakMonth: 'Jun' },
        { productName: 'Smart Watch Pro', trend: 'rising', popularityScore: 88, peakMonth: 'May' },
        { productName: 'USB-C Hub', trend: 'stable', popularityScore: 65, peakMonth: 'Apr' },
        { productName: 'Laptop Stand', trend: 'declining', popularityScore: 45, peakMonth: 'Feb' }
      ]
    });
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color||'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${color?.replace('bg-','text-')||'text-gray-600'}`} />
        </div>
      </div>
      <p className="text-2xl font-black">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" /> Predictive Analytics
          </h2>
          <p className="text-black/40 text-sm mt-1">AI-powered forecasts, churn prediction, and demand analysis</p>
        </div>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> Loading...</> : <><RefreshCw className="w-4 h-4" /> Refresh</>}
        </button>
      </div>

      {loading && !result && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" /><p className="font-bold">Computing predictions...</p></div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Forecast Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Next Month Revenue" value={`$${(result.revenueForecast?.nextMonth||0).toLocaleString()}`} sub={`Confidence: ${Math.round((result.revenueForecast?.confidence||0)*100)}%`} icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
            <StatCard label="Next Quarter" value={`$${(result.revenueForecast?.nextQuarter||0).toLocaleString()}`} sub="Projected growth" icon={BarChart3} color="bg-blue-100 text-blue-600" />
            <StatCard label="Churn Rate" value={`${result.churnPrediction?.currentChurnRate||0}%`} sub={`Predicted: ${result.churnPrediction?.predictedNextMonth||0}%`} icon={Users} color="bg-rose-100 text-rose-600" />
            <StatCard label="At Risk Customers" value={result.churnPrediction?.atRiskCustomers||0} sub="Need attention" icon={AlertTriangle} color="bg-amber-100 text-amber-600" />
          </div>

          {/* CLV */}
          {result.customerLifetimeValue && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Customer Lifetime Value</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase">Average</p>
                  <p className="text-2xl font-black text-gray-900">${result.customerLifetimeValue.average?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                  <p className="text-xs font-bold text-emerald-600 uppercase">Top 10%</p>
                  <p className="text-2xl font-black text-emerald-700">${result.customerLifetimeValue.topPercentile?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl text-center">
                  <p className="text-xs font-bold text-rose-600 uppercase">Bottom 60%</p>
                  <p className="text-2xl font-black text-rose-700">${result.customerLifetimeValue.bottomPercentile?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl text-center">
                  <p className="text-xs font-bold text-amber-600 uppercase">Repeat Purchase</p>
                  <p className="text-2xl font-black text-amber-700">{Math.round((result.repeatPurchaseProbability?.average||0)*100)}%</p>
                </div>
              </div>
              {result.customerLifetimeValue.distribution && (
                <div className="space-y-2">
                  {result.customerLifetimeValue.distribution.map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-bold w-20">{d.segment}</span>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${i===0?'bg-emerald-500':i===1?'bg-blue-500':'bg-gray-300'}`} style={{width:`${d.pct}%`}} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-20 text-right">${d.value?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Forecast Chart */}
          {result.forecastData && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Revenue Forecast</h3>
              <div className="space-y-2">
                {result.forecastData.map((d: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-10">{d.label}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 w-12">Actual</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{width:`${(d.actual||0)/2000}%`}} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-600 w-12">Forecast</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{width:`${(d.forecast||0)/2000}%`}} />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-20 text-right">${(d.forecast||0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seasonal Demand */}
          {result.seasonalDemand && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Seasonal Demand Forecast</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {result.seasonalDemand.map((s: any, i: number) => (
                  <div key={i} className={`p-3 rounded-xl text-center border ${s.peak ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-xs font-bold text-gray-500">{s.month}</p>
                    <p className={`text-lg font-black ${s.peak?'text-amber-700':'text-gray-700'}`}>{s.expectedDemand}</p>
                    {s.peak && <span className="text-[10px] font-bold text-amber-600">Peak</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Popularity */}
          {result.productPopularityTrends && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Product Popularity Trends</h3>
              <div className="space-y-3">
                {result.productPopularityTrends.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        p.trend === 'rising' ? 'bg-emerald-100 text-emerald-700' :
                        p.trend === 'declining' ? 'bg-rose-100 text-rose-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {p.trend === 'rising' ? '↑' : p.trend === 'declining' ? '↓' : '→'}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{p.productName}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{p.trend} trend</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{p.popularityScore}%</p>
                      <p className="text-[10px] text-gray-400">Peak: {p.peakMonth}</p>
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
