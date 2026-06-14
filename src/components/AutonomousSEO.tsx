import React, { useState } from 'react';
import { Search, Loader, FileText, Globe, MessageSquare, Code, Image, Link, Copy, Check, Zap } from 'lucide-react';

export default function AutonomousSEO() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = async () => {
    if (!productName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/autonomous-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: { name: productName, category, description, price: 0 } })
      });
      setResult(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Search className="w-8 h-8 text-indigo-600" /> Autonomous SEO Studio
          </h2>
          <p className="text-black/40 text-sm mt-1">Generate metadata, FAQs, schema markup, blog posts, and more</p>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Product Name</label>
            <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Pro Wireless Headphones" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20">
              {['General','Electronics','Fashion','Home','Sports','Beauty','Automotive'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={generate} disabled={loading} className="w-full p-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader className="w-4 h-4 animate-spin" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate SEO</>}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Description (optional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 h-20" placeholder="Brief product description..." />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {/* SEO Title & Meta */}
          <SEOCard icon={Globe} title="SEO Title & Meta" color="indigo">
            <div className="space-y-3">
              <div><div className="flex justify-between mb-1"><span className="text-xs font-bold text-gray-500">Title ({result.seoTitle?.length||0}/60)</span><button onClick={() => copy(result.seoTitle||'', 'title')} className="text-indigo-600">{copied==='title'?<Check className="w-3.5 h-3.5"/>:<Copy className="w-3.5 h-3.5"/>}</button></div><div className="p-3 bg-gray-50 rounded-xl"><p className="text-sm font-bold">{result.seoTitle}</p></div></div>
              <div><div className="flex justify-between mb-1"><span className="text-xs font-bold text-gray-500">Description ({result.seoDescription?.length||0}/160)</span><button onClick={() => copy(result.seoDescription||'', 'desc')} className="text-indigo-600">{copied==='desc'?<Check className="w-3.5 h-3.5"/>:<Copy className="w-3.5 h-3.5"/>}</button></div><div className="p-3 bg-gray-50 rounded-xl"><p className="text-sm">{result.seoDescription}</p></div></div>
              <div><span className="text-xs font-bold text-gray-500 block mb-2">Keywords</span><div className="flex flex-wrap gap-2">{result.metaKeywords?.map((k:string,i:number)=><span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">{k}</span>)}</div></div>
            </div>
          </SEOCard>

          {/* FAQs */}
          {result.faqs?.length > 0 && <SEOCard icon={MessageSquare} title="Generated FAQs" color="amber"><div className="space-y-3">{result.faqs.map((f:any,i:number)=><div key={i} className="p-3 bg-amber-50 rounded-xl border border-amber-100"><p className="text-xs font-bold text-amber-800">Q: {f.question}</p><p className="text-xs text-amber-700 mt-1">A: {f.answer}</p></div>)}</div></SEOCard>}

          {/* Schema Markup */}
          {result.schemaMarkup && <SEOCard icon={Code} title="Schema Markup (JSON-LD)" color="emerald"><pre className="p-3 bg-gray-900 text-green-400 rounded-xl text-xs overflow-x-auto">{JSON.stringify(result.schemaMarkup, null, 2)}</pre></SEOCard>}

          {/* Blog Post */}
          {result.blogPost && <SEOCard icon={FileText} title="Blog Post" color="violet"><div className="space-y-3"><p className="text-sm font-bold">{result.blogPost.title}</p><p className="text-xs text-gray-500">{result.blogPost.excerpt}</p><div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{__html: result.blogPost.body}} /></div></SEOCard>}

          {/* Internal Links & Alt Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.internalLinks?.length > 0 && <SEOCard icon={Link} title="Internal Links" color="blue"><div className="space-y-2">{result.internalLinks.map((l:any,i:number)=><div key={i} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"><span className="text-xs font-bold text-blue-700">{l.anchor}</span><span className="text-[10px] text-blue-500">{l.url}</span></div>)}</div></SEOCard>}
            {result.imageAltText && <SEOCard icon={Image} title="Image Alt Text" color="rose"><div className="p-3 bg-rose-50 rounded-xl"><p className="text-sm text-rose-800">{result.imageAltText}</p></div></SEOCard>}
          </div>
        </div>
      )}
    </div>
  );
}

function SEOCard({ icon: Icon, title, color, children }: any) {
  const colors: Record<string, string> = { indigo: 'bg-indigo-100 text-indigo-700', amber: 'bg-amber-100 text-amber-700', emerald: 'bg-emerald-100 text-emerald-700', violet: 'bg-violet-100 text-violet-700', blue: 'bg-blue-100 text-blue-700', rose: 'bg-rose-100 text-rose-700' };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]||'bg-gray-100 text-gray-700'}`}><Icon className="w-4 h-4" /></div>
        <span className="font-bold text-sm">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
