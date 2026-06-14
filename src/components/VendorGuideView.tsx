import React from 'react';
import { BookOpen, HelpCircle, MessageSquare, PlayCircle, FileText, ExternalLink, ChevronRight } from 'lucide-react';

const VendorGuideView = () => {
  const guides = [
    { title: 'Getting Started', description: 'Learn the basics of setting up your store and adding products.', icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Order Fulfillment', description: 'How to process orders, manage shipments, and handle returns.', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Marketing & Growth', description: 'Use promotions and analytics to grow your business.', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Payments & Fees', description: 'Understand how payouts work and view your earnings.', icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Vendor Guide</h2>
        <p className="text-black/40 text-sm mt-1">Everything you need to know about selling on our platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-start gap-6">
              <div className={`w-14 h-14 ${guide.bg} ${guide.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <guide.icon className="w-7 h-7" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{guide.title}</h3>
                  <ChevronRight className="w-5 h-5 text-black/20 group-hover:text-black transition-colors" />
                </div>
                <p className="text-sm text-black/60 leading-relaxed">{guide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-12 rounded-[40px] relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-6">
          <h3 className="text-3xl font-bold tracking-tight">Need more help?</h3>
          <p className="text-white/60 leading-relaxed">
            Our support team is available 24/7 to help you with any issues or questions you might have regarding your store.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-all flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Contact Support
            </button>
            <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Visit Help Center
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default VendorGuideView;
