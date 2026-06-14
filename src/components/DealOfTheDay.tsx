"use client";

import React from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export const DealOfTheDay = () => {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="bg-zinc-900 rounded-[40px] p-12 md:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-zinc-900 to-transparent z-10" />
          <img src="https://picsum.photos/seed/deal/800/800" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-20 max-w-xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full">
            <Zap className="w-3 h-3 fill-current" /> DEAL OF THE DAY
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">FLASH SALE<br />IS LIVE.</h2>
          <p className="text-white/60 text-lg">Get up to 60% off on selected premium electronics. Limited time only.</p>
          <div className="flex items-center gap-8">
            <div className="flex gap-4">
              {['08', '12', '45'].map((num, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold bg-white/10 backdrop-blur-md border border-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">{num}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{['Hrs', 'Min', 'Sec'][i]}</div>
                </div>
              ))}
            </div>
            <Link href="/products" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors">Shop the Sale</Link>
          </div>
        </div>
      </div>
    </section>
  );
};
