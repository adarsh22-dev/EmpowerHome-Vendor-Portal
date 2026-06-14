"use client";

import React from 'react';
import Link from 'next/link';

export const WholesaleBanner = () => {
  return (
    <section className="px-6">
      <div className="max-w-7xl mx-auto bg-black text-white rounded-3xl p-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold tracking-tighter mb-6">Scale Your Business with Nexus Wholesale.</h2>
          <p className="text-white/60 text-lg mb-8">Access tiered pricing, dedicated account managers, and bulk logistics. Join 50,000+ businesses sourcing from Nexus.</p>
          <div className="flex gap-4">
            <Link href="/wholesaler-auth" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors">Apply for Wholesale</Link>
            <button className="border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">View Pricing</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white/10 p-6 rounded-2xl text-center">
            <p className="text-3xl font-bold mb-1">50k+</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Businesses</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-center">
            <p className="text-3xl font-bold mb-1">150+</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Countries Served</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-center">
            <p className="text-3xl font-bold mb-1">24h</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Support Response</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-center">
            <p className="text-3xl font-bold mb-1">30%</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Avg. Savings</p>
          </div>
        </div>
      </div>
    </section>
  );
};
