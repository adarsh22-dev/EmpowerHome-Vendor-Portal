import React, { useState, useEffect } from 'react';
import { ShieldAlert, Loader, RefreshCw, CheckCircle, Users, ShoppingCart, Star, Ticket } from 'lucide-react';

export default function FraudDetection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/fraud-detection', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
      });
      setResult(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnalysis(); }, []);

  const riskColor = (score: number) => score >= 80 ? 'text-rose-600 bg-rose-50 border-rose-200' : score >= 50 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
  const riskLabel = (score: number) => score >= 80 ? 'High Risk' : score >= 50 ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" /> Fraud Detection
          </h2>
          <p className="text-black/40 text-sm mt-1">AI-powered detection of fake reviews, refund abuse, coupon misuse, and suspicious activity</p>
        </div>
        <div className="flex items-center gap-4">
          {result && (
            <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${result.overallFraudScore < 30 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : result.overallFraudScore < 60 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
              Overall Score: {result.overallFraudScore}/100
            </div>
          )}
          <button onClick={fetchAnalysis} disabled={loading} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50">
            {loading ? <><Loader className="w-4 h-4 animate-spin" /> Scanning...</> : <><RefreshCw className="w-4 h-4" /> Scan Now</>}
          </button>
        </div>
      </div>

      {loading && !result && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center"><div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4" /><p className="font-bold">Scanning for fraud indicators...</p></div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flagged Reviews */}
            <FraudSection icon={Star} title="Flagged Reviews" count={result.flaggedReviews?.length||0} color="rose">
              {result.flaggedReviews?.map((r: any, i: number) => (
                <FraudItem key={i} risk={r.riskScore}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm font-bold">Review #{r.reviewId}</p><p className="text-xs text-gray-500">Rating: {r.rating}/5</p></div>
                    <RiskBadge score={r.riskScore} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{r.reason}</p>
                </FraudItem>
              ))}
            </FraudSection>

            {/* Refund Abuse */}
            <FraudSection icon={ShoppingCart} title="Refund Abuse Cases" count={result.refundAbuseCases?.length||0} color="amber">
              {result.refundAbuseCases?.map((r: any, i: number) => (
                <FraudItem key={i} risk={r.riskScore}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm font-bold">Order #{r.orderId}</p><p className="text-xs text-gray-500">Amount: ${r.amount}</p></div>
                    <RiskBadge score={r.riskScore} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{r.reason}</p>
                </FraudItem>
              ))}
            </FraudSection>

            {/* Coupon Misuse */}
            <FraudSection icon={Ticket} title="Coupon Misuse" count={result.couponMisuse?.length||0} color="violet">
              {result.couponMisuse?.map((c: any, i: number) => (
                <FraudItem key={i} risk={c.riskScore}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm font-bold">{c.code}</p><p className="text-xs text-gray-500">{c.usageCount} uses (expected: {c.expectedCount})</p></div>
                    <RiskBadge score={c.riskScore} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{c.uniqueUsers} unique users</p>
                </FraudItem>
              ))}
            </FraudSection>

            {/* Suspicious Accounts */}
            <FraudSection icon={Users} title="Suspicious Accounts" count={result.suspiciousAccounts?.length||0} color="blue">
              {result.suspiciousAccounts?.map((a: any, i: number) => (
                <FraudItem key={i} risk={a.riskScore}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm font-bold">{a.email}</p><p className="text-xs text-gray-500">Created: {a.createdAt}</p></div>
                    <RiskBadge score={a.riskScore} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{a.reason}</p>
                </FraudItem>
              ))}
            </FraudSection>
          </div>

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recommendations</h3>
              <div className="space-y-2">
                {result.recommendations.map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-indigo-800">{r}</span>
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

function FraudSection({ icon: Icon, title, count, color, children }: any) {
  const colors: Record<string, string> = { rose: 'border-rose-200 bg-rose-50', amber: 'border-amber-200 bg-amber-50', violet: 'border-violet-200 bg-violet-50', blue: 'border-blue-200 bg-blue-50' };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-gray-600" /><span className="font-bold text-sm">{title}</span></div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${color==='rose'?'bg-rose-100 text-rose-700':color==='amber'?'bg-amber-100 text-amber-700':color==='violet'?'bg-violet-100 text-violet-700':'bg-blue-100 text-blue-700'}`}>{count}</span>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function FraudItem({ risk, children }: any) {
  return <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{children}</div>;
}

function RiskBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-rose-100 text-rose-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
  const label = score >= 80 ? 'High' : score >= 50 ? 'Med' : 'Low';
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{label} {score}</span>;
}
