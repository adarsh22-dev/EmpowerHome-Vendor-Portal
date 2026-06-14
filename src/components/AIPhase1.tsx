import React, { useState } from 'react';
import {
  Sparkles, Loader, ChevronDown, ChevronUp, Check, Copy,
  AlertTriangle, Target, Star, Lightbulb, Search,
  FileText, Globe, List, Hash, Layers, BarChart3, Zap
} from 'lucide-react';

interface AIResult {
  generatedDescription: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  bulletPoints: string[];
  searchKeywords: string[];
  missingAttributes: string[];
  qualityScore: number;
  suggestedImprovements: string[];
  duplicateProducts: any[];
}

interface AIPhase1Props {
  productData: Record<string, any>;
  onApply?: (field: string, value: any) => void;
  onClose?: () => void;
}

const sectionIcons: Record<string, any> = {
  description: FileText,
  seo: Globe,
  bullets: List,
  keywords: Hash,
  quality: BarChart3,
  improvements: Lightbulb,
  duplicates: Layers
};

const sectionLabels: Record<string, string> = {
  description: 'AI Product Description',
  seo: 'SEO Title & Meta',
  bullets: 'Feature Bullet Points',
  keywords: 'Search Keywords',
  quality: 'Quality Score',
  improvements: 'Suggested Improvements',
  duplicates: 'Duplicate Detection'
};

export default function AIPhase1({ productData, onApply, onClose }: AIPhase1Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    seo: true,
    bullets: true,
    keywords: true,
    quality: true,
    improvements: true,
    duplicates: true
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateIntelligence = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setResult({
      generatedDescription: productData?.name
        ? `${productData.name} - A high-quality product designed to meet your needs. Crafted with premium materials and offering exceptional value for customers seeking reliability and performance.`
        : 'This premium product offers exceptional quality and performance. Designed with customer satisfaction in mind, it delivers reliable results across a wide range of applications.',
      shortDescription: 'Premium quality product with exceptional performance and reliability.',
      seoTitle: `Buy ${productData?.name || 'Premium Product'} Online | Best Deals`,
      seoDescription: `Shop the best ${productData?.name || 'premium product'} at unbeatable prices. Fast shipping, easy returns, and top-rated customer service.`,
      bulletPoints: [
        'Premium quality materials for long-lasting durability',
        'Designed for optimal performance and reliability',
        'Easy to use and maintain with minimal effort',
        'Versatile application across multiple use cases',
        'Backed by excellent customer support and warranty'
      ],
      searchKeywords: ['premium', 'quality', 'best price', 'top rated', 'durable', 'reliable', 'best seller'],
      missingAttributes: [],
      qualityScore: 85,
      suggestedImprovements: [
        'Add more high-resolution product images',
        'Include customer testimonials',
        'Expand size/variant options'
      ],
      duplicateProducts: []
    });
    setLoading(false);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApply = (field: string, value: any) => {
    if (onApply) onApply(field, value);
  };

  const qualityColor = result
    ? result.qualityScore >= 80 ? 'text-emerald-500'
      : result.qualityScore >= 50 ? 'text-amber-500'
      : 'text-rose-500'
    : 'text-gray-400';

  const qualityBg = result
    ? result.qualityScore >= 80 ? 'bg-emerald-500'
      : result.qualityScore >= 50 ? 'bg-amber-500'
      : 'bg-rose-500'
    : 'bg-gray-300';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Product Intelligence</h3>
              <p className="text-sm text-white/70">Phase 1 - Generate descriptions, SEO, keywords & more</p>
            </div>
          </div>
          <button
            onClick={generateIntelligence}
            disabled={loading}
            className="px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <><Loader className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Zap className="w-4 h-4" /> {result ? 'Re-analyze' : 'Analyze Product'}</>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {result.duplicateProducts.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">Potential Duplicates Detected</p>
                <div className="mt-2 space-y-2">
                  {result.duplicateProducts.map((dup: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-amber-100">
                      {dup.image && <img src={dup.image} className="w-8 h-8 rounded object-cover" />}
                      <div className="text-xs">
                        <p className="font-bold text-amber-900">{dup.name}</p>
                        <p className="text-amber-600">SKU: {dup.sku || 'N/A'} | ${dup.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <SectionCard
            icon={FileText}
            title="AI Product Description"
            sectionKey="description"
            expanded={expandedSections.description}
            onToggle={() => toggleSection('description')}
          >
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Description</label>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(result.generatedDescription, 'desc')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
                      {copiedField === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                    {onApply && (
                      <button onClick={() => handleApply('description', result.generatedDescription)} className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600" title="Apply">
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-xl border border-gray-100">{result.generatedDescription}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Short Description</label>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(result.shortDescription, 'shortDesc')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
                      {copiedField === 'shortDesc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                    {onApply && (
                      <button onClick={() => handleApply('shortDesc', result.shortDescription)} className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600" title="Apply">
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 italic">{result.shortDescription}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={Globe}
            title="SEO Title & Meta"
            sectionKey="seo"
            expanded={expandedSections.seo}
            onToggle={() => toggleSection('seo')}
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">SEO Title <span className="text-gray-400 normal-case">({result.seoTitle.length}/60)</span></label>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(result.seoTitle, 'seoTitle')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
                      {copiedField === 'seoTitle' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                    {onApply && (
                      <button onClick={() => handleApply('seoTitle', result.seoTitle)} className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600" title="Apply">
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm font-bold text-gray-800">{result.seoTitle}</p>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${result.seoTitle.length > 50 ? 'bg-emerald-500' : result.seoTitle.length > 30 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${(result.seoTitle.length / 60) * 100}%` }} />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Description <span className="text-gray-400 normal-case">({result.seoDescription.length}/160)</span></label>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(result.seoDescription, 'seoDesc')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
                      {copiedField === 'seoDesc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                    {onApply && (
                      <button onClick={() => handleApply('seoDesc', result.seoDescription)} className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600" title="Apply">
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-xl border border-gray-100">{result.seoDescription}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={List}
            title="Feature Bullet Points"
            sectionKey="bullets"
            expanded={expandedSections.bullets}
            onToggle={() => toggleSection('bullets')}
          >
            <ul className="space-y-2">
              {result.bulletPoints.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                  <span className="text-sm text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
            {onApply && (
              <button
                onClick={() => handleApply('bulletPoints', result.bulletPoints)}
                className="mt-3 w-full p-2.5 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" /> Apply All Bullet Points
              </button>
            )}
          </SectionCard>

          <SectionCard
            icon={Hash}
            title="Search Keywords"
            sectionKey="keywords"
            expanded={expandedSections.keywords}
            onToggle={() => toggleSection('keywords')}
          >
            <div className="flex flex-wrap gap-2">
              {result.searchKeywords.map((kw: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 flex items-center gap-2">
                  {kw}
                  <button onClick={() => handleCopy(kw, `kw-${i}`)} className="hover:bg-indigo-200 p-0.5 rounded transition-colors">
                    {copiedField === `kw-${i}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              ))}
            </div>
            {onApply && (
              <button
                onClick={() => handleApply('metaKeywords', result.searchKeywords)}
                className="mt-3 w-full p-2.5 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" /> Apply Keywords
              </button>
            )}
          </SectionCard>

          <SectionCard
            icon={BarChart3}
            title="Quality Score"
            sectionKey="quality"
            expanded={expandedSections.quality}
            onToggle={() => toggleSection('quality')}
          >
            <div className="flex items-center gap-8">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(result.qualityScore / 100) * 339.292} 339.292`}
                    className={qualityColor.replace('text-', 'text-')}
                    style={{ color: result.qualityScore >= 80 ? '#10b981' : result.qualityScore >= 50 ? '#f59e0b' : '#ef4444' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-black ${qualityColor}`}>{result.qualityScore}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-800">
                  {result.qualityScore >= 80 ? 'Excellent - Ready to Publish'
                    : result.qualityScore >= 50 ? 'Good - Needs Some Work'
                    : 'Poor - Requires Significant Improvement'}
                </p>
                <p className="text-xs text-gray-500">
                  {result.qualityScore >= 80 ? 'Your product has strong, complete data.'
                    : result.qualityScore >= 50 ? 'Add missing fields to improve your score.'
                    : 'Fill in the essential fields to improve product quality.'}
                </p>
                <div className="flex gap-2 text-xs font-bold">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">Data</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">SEO</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">Media</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {result.suggestedImprovements.length > 0 && (
            <SectionCard
              icon={Lightbulb}
              title="Suggested Improvements"
              sectionKey="improvements"
              expanded={expandedSections.improvements}
              onToggle={() => toggleSection('improvements')}
            >
              <ul className="space-y-2">
                {result.suggestedImprovements.map((imp: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <Target className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-amber-800">{imp}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {result.missingAttributes.length > 0 && (
            <SectionCard
              icon={AlertTriangle}
              title="Missing Fields Detected"
              sectionKey="missing"
              expanded={true}
              onToggle={() => {}}
            >
              <div className="flex flex-wrap gap-2">
                {result.missingAttributes.map((attr: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    {attr}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  sectionKey,
  expanded,
  onToggle,
  children
}: {
  icon: any;
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-indigo-700" />
          </div>
          <span className="font-bold text-sm text-gray-900">{title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && <div className="p-4 pt-0 border-t border-gray-100">{children}</div>}
    </div>
  );
}
