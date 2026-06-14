"use client";

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, ShoppingBag } from 'lucide-react';

export const BrandGuarantees = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {[
          { icon: ShieldCheck, title: "Verified Vendors", desc: "100% authentic products from certified global suppliers." },
          { icon: Truck, title: "Global Shipping", desc: "Fast, reliable logistics to over 150 countries." },
          { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free 30-day return policy on all items." },
          { icon: ShoppingBag, title: "Wholesale Ready", desc: "Deep discounts for bulk orders and business accounts." },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-50 border border-black/5 hover:shadow-xl transition-all duration-300">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-black text-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <item.icon className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
            <p className="text-black/40 text-[10px] sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
