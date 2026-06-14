import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, AlertTriangle, Loader, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ReviewAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const fetchAnalysis = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setResult({
      overallSentiment: 'positive',
      avgRating: 4.3,
      totalReviews: 128,
      sentimentScore: 82,
      ratingDistribution: { 5: 65, 4: 35, 3: 18, 2: 7, 1: 3 },
      topStrengths: ['Excellent product quality', 'Fast shipping', 'Great customer support', 'Good value for money'],
      topWeaknesses: ['Packaging could be improved', 'Limited color options', 'Battery life shorter than expected'],
      topComplaints: [
        { issue: 'Packaging damage during transit', frequency: 8 },
        { issue: 'Battery life concerns', frequency: 5 },
        { issue: 'Size runs small', frequency: 4 }
      ],
      buyingRecommendation: 'recommend'
    });
    setLoading(false);
  };

  useEffect(() => { fetchAnalysis(); }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Star className="w-8 h-8 text-amber-500" /> AI Review Analysis
          </h2>
          <p className="text-black/40 text-sm mt-1">Aggregate and analyze product reviews for insights</p>
        </div>
        <button onClick={fetchAnalysis} disabled={loading} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> Analyzing...</> : <><RefreshCw className="w-4 h-4" /> Refresh Analysis</>}
        </button>
      </div>

      {loading && !result && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4" />
          <p className="text-lg font-bold">Analyzing reviews...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Sentiment Header */}
          <div className={`p-6 rounded-2xl border ${
            result.overallSentiment === 'positive' ? 'bg-emerald-50 border-emerald-200' :
            result.overallSentiment === 'mixed' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  result.overallSentiment === 'positive' ? 'bg-emerald-200' :
                  result.overallSentiment === 'mixed' ? 'bg-amber-200' : 'bg-rose-200'
                }`}>
                  {result.overallSentiment === 'positive' ? <TrendingUp className="w-8 h-8 text-emerald-700" /> :
                   result.overallSentiment === 'mixed' ? <Minus className="w-8 h-8 text-amber-700" /> :
                   <TrendingDown className="w-8 h-8 text-rose-700" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold capitalize">{result.overallSentiment} Sentiment</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">Avg Rating: <strong>{result.avgRating}</strong> / 5</span>
                    <span className="text-sm text-gray-600">{result.totalReviews} reviews</span>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          (result.sentimentScore||0) >= 70 ? 'bg-emerald-500' : (result.sentimentScore||0) >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                        }`} style={{width:`${result.sentimentScore||50}%`}} />
                      </div>
                      <span className="text-xs font-bold">{result.sentimentScore||50}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          {result.ratingDistribution && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-sm mb-4">Rating Distribution</h4>
              <div className="space-y-2">
                {[5,4,3,2,1].map(star => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-4">{star}</span>
                    <Star className={`w-3 h-3 ${star <= Math.round(result.avgRating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{width:`${((result.ratingDistribution[star]||0)/Math.max(1,result.totalReviews))*100}%`}} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 w-8 text-right">{result.ratingDistribution[star]||0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold">Top Strengths</h4>
              </div>
              <ul className="space-y-2">
                {result.topStrengths?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckIcon className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-emerald-800">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Weaknesses */}
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold">Top Weaknesses</h4>
              </div>
              <ul className="space-y-2">
                {result.topWeaknesses?.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <XIcon className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-rose-800">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Complaints */}
          {result.topComplaints?.length > 0 && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold">Most Mentioned Issues</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.topComplaints.map((c: any, i: number) => (
                  <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-amber-800">{c.issue}</span>
                      <span className="text-xs font-bold text-amber-600">{c.frequency}x</span>
                    </div>
                    <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{width:`${Math.min(100,c.frequency*20)}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {result.buyingRecommendation && (
            <div className={`p-6 rounded-2xl border ${
              result.buyingRecommendation === 'recommend' ? 'bg-emerald-50 border-emerald-200' :
              result.buyingRecommendation === 'consider' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-start gap-4">
                {result.buyingRecommendation === 'recommend' ? <TrendingUp className="w-8 h-8 text-emerald-600" /> :
                 result.buyingRecommendation === 'consider' ? <Minus className="w-8 h-8 text-amber-600" /> :
                 <TrendingDown className="w-8 h-8 text-rose-600" />}
                <div>
                  <h4 className="font-bold text-lg capitalize">Buying Recommendation: {result.buyingRecommendation}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {result.buyingRecommendation === 'recommend' ? 'Based on positive reviews and high ratings, this product is recommended for purchase.' :
                     result.buyingRecommendation === 'consider' ? 'Mixed reviews suggest evaluating alternatives before purchasing.' :
                     'Due to significant negative feedback, caution is advised.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }
function XIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
