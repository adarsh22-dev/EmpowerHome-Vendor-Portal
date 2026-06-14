"use client";

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-zinc-50 border-t border-black/5 py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
        <div className="space-y-6">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">N</div>
            NEXUS
          </div>
          <p className="text-black/50 text-sm leading-relaxed">
            The premier marketplace for innovative products and independent vendors. Built for the future of commerce.
          </p>
          <div className="flex gap-4">
            <img src="https://picsum.photos/seed/visa/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Visa" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/mastercard/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Mastercard" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/paypal/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Paypal" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/applepay/40/25" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" alt="Apple Pay" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-black/60">
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/products?sort=newest">New Arrivals</Link></li>
            <li><Link href="/products?featured=true">Featured</Link></li>
            <li><Link href="/products?sale=true">Sale</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-black/60">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/shipping">Shipping Info</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/blog">Insights Blog</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Newsletter</h4>
          <p className="text-sm text-black/60 mb-4">Get the latest updates on new products and upcoming sales.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-white border border-black/10 rounded-lg px-4 py-2 text-sm flex-1" />
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 sm:mt-20 pt-8 border-t border-black/5 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-4 text-[10px] sm:text-xs font-bold text-black/40 uppercase tracking-widest text-center sm:text-left">
        <p>© 2026 NEXUS MARKETPLACE. ALL RIGHTS RESERVED.</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Settings</Link>
        </div>
      </div>
    </footer>
  );
};
