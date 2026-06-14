import React, { useState, useEffect } from 'react';
import {
  Sparkles, Loader, Zap, TrendingUp, RefreshCw,
  AlertTriangle, Package, DollarSign, BarChart3,
  Target, Clock, ArrowUpRight,
  ArrowDownRight, ChevronDown, ChevronUp,
  Calendar, Shield, TrendingDown
} from 'lucide-react';

interface CopilotResult {
  bestTimeForDiscounts: {
    recommendation: string;
    reasoning: string;
    suggestedDiscount: string;
    timing: string;
  };
  replenishmentAlerts: Array<{
    productName: string;
    currentStock: number;
    reorderPoint: number;
    recommendedQty: number;
    urgency: string;
    reasoning: string;
  }>;
  slowMovingStock: Array<{
    productName: string;
    stock: number;
    price: number;
    daysInInventory: number;
    recommendation: string;
    reasoning: string;
  }>;
  pricingSuggestions: Array<{
    productName: string;
    currentPrice: number;
    suggestedPrice: number;
    reasoning: string;
    expectedImpact: string;
  }>;
  predictedDemand: Array<{
    productName: string;
    currentStock: number;
    predictedWeeklyDemand: number;
    stockoutRisk: string;
    recommendedAction: string;
  }>;
  competitorBenchmarking: {
    pricePositioning: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  topOpportunities: Array<{
    priority: number;
    title: string;
    description: string;
    expectedROI: string;
    effort: string;
    timeline: string;
  }>;
}

const urgencyColors: Record<string, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500'
};

const effortColors: Record<string, string> = {
  high: 'text-rose-600 bg-rose-50',
  medium: 'text-amber-600 bg-amber-50',
  low: 'text-emerald-600 bg-emerald-50'
};

export default function VendorCopilot() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<CopilotResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    discounts: true, replenishment: true, slowMoving: true,
    pricing: true, demand: true, competitive: true, opportunities: true
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchCopilotAnalysis = async () => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 900));
    setResult({
      bestTimeForDiscounts: {
        recommendation: 'Run a weekend flash sale with 15-20% off on slow-moving stock to boost Q2 revenue.',
        reasoning: 'Historical data shows peak conversion on Friday-Sunday. Current inventory levels support promotional pricing without margin erosion.',
        suggestedDiscount: '15-20% off select items',
        timing: 'This Friday through Sunday'
      },
      replenishmentAlerts: [
        { productName: 'Wireless Headphones Pro', currentStock: 12, reorderPoint: 25, recommendedQty: 50, urgency: 'high', reasoning: 'Current stock will last approximately 2 weeks at current sales velocity.' },
        { productName: 'USB-C Charging Cable', currentStock: 8, reorderPoint: 30, recommendedQty: 100, urgency: 'high', reasoning: 'High-demand accessory with lead time of 2 weeks.' }
      ],
      slowMovingStock: [
        { productName: 'Laptop Stand Aluminum', stock: 45, price: 39.99, daysInInventory: 120, recommendation: 'Bundle with laptop accessories or offer 20% discount', reasoning: 'Product has been in inventory for 4 months with minimal sales velocity.' }
      ],
      pricingSuggestions: [
        { productName: 'Wireless Headphones Pro', currentPrice: 79.99, suggestedPrice: 89.99, reasoning: 'Strong demand and positive reviews support a price increase.', expectedImpact: '+12% revenue with minimal volume impact' },
        { productName: 'Bluetooth Speaker Mini', currentPrice: 39.99, suggestedPrice: 34.99, reasoning: 'Price reduction to match competitor pricing and increase volume.', expectedImpact: '+25% volume growth' }
      ],
      predictedDemand: [
        { productName: 'Wireless Headphones Pro', currentStock: 12, predictedWeeklyDemand: 8, stockoutRisk: 'high', recommendedAction: 'Restock immediately with expedited shipping' },
        { productName: 'Smart Watch Band', currentStock: 35, predictedWeeklyDemand: 5, stockoutRisk: 'low', recommendedAction: 'Maintain current inventory levels' }
      ],
      competitorBenchmarking: {
        pricePositioning: 'Mid-range',
        strengths: ['Competitive pricing on accessories', 'Strong product reviews', 'Fast shipping options'],
        weaknesses: ['Limited premium brand recognition', 'Fewer product variations than competitors'],
        opportunities: ['Expand into premium segment', 'Create exclusive bundles'],
        threats: ['New competitors entering market', 'Rising shipping costs']
      },
      topOpportunities: [
        { priority: 1, title: 'Bundle Wireless Headphones with Accessories', description: 'Create curated bundles to increase average order value and move accessory inventory.', expectedROI: '+18% revenue', effort: 'low', timeline: '1 week' },
        { priority: 2, title: 'Expand into Premium Audio Segment', description: 'Introduce high-end audio products to capture growing premium market demand.', expectedROI: '+25% margin', effort: 'high', timeline: '3 months' },
        { priority: 3, title: 'Optimize Product Photography', description: 'Improve product images to increase conversion rates across all product listings.', expectedROI: '+10% conversion', effort: 'medium', timeline: '2 weeks' }
      ]
    });
    setLoaded(true);
    setLoading(false);
  };

  useEffect(() => {
    fetchCopilotAnalysis();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            AI Vendor Copilot
          </h2>
          <p className="text-black/40 text-sm mt-1">AI-powered recommendations for inventory, pricing, and growth opportunities</p>
        </div>
        <button
          onClick={fetchCopilotAnalysis}
          disabled={loading}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10 disabled:opacity-50"
        >
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> Analyzing...</> : <><RefreshCw className="w-4 h-4" /> Refresh Analysis</>}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <p className="text-sm text-rose-800">{error}</p>
        </div>
      )}

      {loading && !result && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
          </div>
          <p className="text-lg font-bold text-gray-900">AI Copilot is analyzing your store...</p>
          <p className="text-sm text-gray-500 mt-2">Reviewing inventory, pricing, and sales patterns</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Top Opportunities Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6" />
              <h3 className="text-lg font-bold">Top Opportunities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.topOpportunities.slice(0, 3).map((opp, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/60 uppercase">Priority #{opp.priority}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${effortColors[opp.effort] || 'text-white bg-white/20'}`}>
                      {opp.effort} effort
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{opp.title}</h4>
                  <p className="text-xs text-white/70 mb-3">{opp.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <TrendingUp className="w-3 h-3" /> {opp.expectedROI}
                    </span>
                    <span className="flex items-center gap-1 text-white/60">
                      <Clock className="w-3 h-3" /> {opp.timeline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Time for Discounts */}
            <CopilotCard
              icon={Calendar}
              title="Best Time for Discounts"
              sectionKey="discounts"
              expanded={expandedSections.discounts}
              onToggle={() => toggleSection('discounts')}
              color="indigo"
            >
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-sm font-bold text-indigo-800">{result.bestTimeForDiscounts.recommendation}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{result.bestTimeForDiscounts.reasoning}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suggested Discount</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{result.bestTimeForDiscounts.suggestedDiscount}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Optimal Timing</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{result.bestTimeForDiscounts.timing}</p>
                  </div>
                </div>
              </div>
            </CopilotCard>

            {/* Competitor Benchmarking */}
            <CopilotCard
              icon={Shield}
              title="Competitor Benchmarking"
              sectionKey="competitive"
              expanded={expandedSections.competitive}
              onToggle={() => toggleSection('competitive')}
              color="violet"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.competitorBenchmarking.pricePositioning === 'Premium' ? 'bg-amber-100 text-amber-700' :
                    result.competitorBenchmarking.pricePositioning === 'Mid-range' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {result.competitorBenchmarking.pricePositioning}
                  </span>
                  <span className="text-xs text-gray-500">price positioning</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Strengths</p>
                    <ul className="space-y-1">
                      {result.competitorBenchmarking.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <ArrowUpRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-2">Weaknesses</p>
                    <ul className="space-y-1">
                      {result.competitorBenchmarking.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <ArrowDownRight className="w-3 h-3 text-rose-500 mt-0.5 shrink-0" /> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Opportunities</p>
                    <ul className="space-y-1">
                      {result.competitorBenchmarking.opportunities.map((o, i) => (
                        <li key={i} className="text-xs text-emerald-800 flex items-start gap-1.5">
                          <Zap className="w-3 h-3 mt-0.5 shrink-0" /> {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mb-2">Threats</p>
                    <ul className="space-y-1">
                      {result.competitorBenchmarking.threats.map((t, i) => (
                        <li key={i} className="text-xs text-rose-800 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CopilotCard>

            {/* Replenishment Alerts */}
            <CopilotCard
              icon={Package}
              title="Inventory Replenishment Alerts"
              sectionKey="replenishment"
              expanded={expandedSections.replenishment}
              onToggle={() => toggleSection('replenishment')}
              color="amber"
            >
              <div className="space-y-3">
                {result.replenishmentAlerts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No replenishment alerts at this time.</p>
                ) : (
                  result.replenishmentAlerts.map((alert, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-gray-900">{alert.productName}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${urgencyColors[alert.urgency] || 'bg-gray-400'}`}>
                          {alert.urgency}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Stock</p>
                          <p className="text-sm font-bold text-gray-800">{alert.currentStock}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Reorder At</p>
                          <p className="text-sm font-bold text-amber-600">{alert.reorderPoint}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Order Qty</p>
                          <p className="text-sm font-bold text-emerald-600">{alert.recommendedQty}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{alert.reasoning}</p>
                    </div>
                  ))
                )}
              </div>
            </CopilotCard>

            {/* Slow-Moving Stock */}
            <CopilotCard
              icon={TrendingDown}
              title="Slow-Moving Stock"
              sectionKey="slowMoving"
              expanded={expandedSections.slowMoving}
              onToggle={() => toggleSection('slowMoving')}
              color="rose"
            >
              <div className="space-y-3">
                {result.slowMovingStock.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No slow-moving stock identified. Good inventory turnover!</p>
                ) : (
                  result.slowMovingStock.map((item, i) => (
                    <div key={i} className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-rose-900">{item.productName}</h4>
                        <span className="text-xs font-bold text-rose-600">{item.daysInInventory} days</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Stock</p>
                          <p className="text-sm font-bold text-rose-600">{item.stock}</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Price</p>
                          <p className="text-sm font-bold text-gray-800">${item.price}</p>
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-rose-200">
                        <p className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mb-1">Recommendation</p>
                        <p className="text-xs font-bold text-rose-800">{item.recommendation}</p>
                      </div>
                      <p className="text-xs text-rose-600 mt-2">{item.reasoning}</p>
                    </div>
                  ))
                )}
              </div>
            </CopilotCard>

            {/* Pricing Suggestions */}
            <CopilotCard
              icon={DollarSign}
              title="Pricing Suggestions"
              sectionKey="pricing"
              expanded={expandedSections.pricing}
              onToggle={() => toggleSection('pricing')}
              color="emerald"
            >
              <div className="space-y-3">
                {result.pricingSuggestions.map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">{item.productName}</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 p-2 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Current</p>
                        <p className="text-lg font-black text-gray-800">${item.currentPrice}</p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div className="flex-1 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Suggested</p>
                        <p className="text-lg font-black text-emerald-700">${item.suggestedPrice}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{item.reasoning}</p>
                    <div className="mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                      <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Expected Impact</p>
                      <p className="text-xs font-bold text-indigo-800">{item.expectedImpact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CopilotCard>

            {/* Predicted Demand */}
            <CopilotCard
              icon={BarChart3}
              title="Predicted Demand & Stockout Risk"
              sectionKey="demand"
              expanded={expandedSections.demand}
              onToggle={() => toggleSection('demand')}
              color="blue"
            >
              <div className="space-y-3">
                {result.predictedDemand.map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-900">{item.productName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${urgencyColors[item.stockoutRisk] || 'bg-gray-400'}`}>
                        {item.stockoutRisk} risk
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Current Stock</p>
                        <p className="text-lg font-black text-gray-800">{item.currentStock}</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Weekly Demand</p>
                        <p className="text-lg font-black text-indigo-600">{item.predictedWeeklyDemand}</p>
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recommended Action</p>
                      <p className="text-xs font-bold text-gray-800">{item.recommendedAction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CopilotCard>
          </div>
        </div>
      )}

      {!loading && !result && !error && (
        <div className="flex flex-col items-center justify-center py-20">
          <Sparkles className="w-16 h-16 text-gray-200 mb-6" />
          <p className="text-lg font-bold text-gray-900">Ready to analyze your store</p>
          <p className="text-sm text-gray-500 mt-2">Click "Refresh Analysis" to get AI-powered recommendations</p>
        </div>
      )}
    </div>
  );
}

function CopilotCard({
  icon: Icon, title, sectionKey, expanded, onToggle, color, children
}: {
  icon: any; title: string; sectionKey: string; expanded: boolean;
  onToggle: () => void; color: string; children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-700',
    violet: 'bg-violet-100 text-violet-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color] || 'bg-gray-100 text-gray-700'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-gray-900">{title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && <div className="p-5 pt-0 border-t border-gray-100">{children}</div>}
    </div>
  );
}
