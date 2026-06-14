import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FaqSectionProps {
  category?: string;
  title?: string;
  subtitle?: string;
}

export default function FaqSection({ category, title = 'Frequently Asked Questions', subtitle = 'Got Questions?' }: FaqSectionProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const url = category ? `/api/faqs?category=${category}` : '/api/faqs';
    fetch(url)
      .then(r => r.json())
      .then(setFaqs)
      .catch(() => {});
  }, [category]);

  if (faqs.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">{subtitle}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">{title}</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
            className="border border-black/10 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-black/[0.02] transition-colors"
            >
              <span className="font-semibold text-sm sm:text-base pr-4">{faq.question}</span>
              <motion.div
                animate={{ rotate: openId === faq.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-black/40" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm sm:text-base text-black/60 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
