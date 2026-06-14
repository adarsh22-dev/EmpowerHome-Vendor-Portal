"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  ShoppingCart, 
  Bell, 
  Globe, 
  Heart,
  Store,
  Users,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { useCart, useAuth } from './Providers';

export const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [currency, setCurrency] = useState('USD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="px-4 sm:px-6 py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden hover:bg-black/5 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">N</div>
            <span className="hidden xs:inline">NEXUS</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-black/60">
            <Link href="/products" className="hover:text-black transition-colors">Shop All</Link>
            <Link href="/categories" className="hover:text-black transition-colors">Categories</Link>
            {!user && (
              <>
                <Link href="/vendor-auth" className="hover:text-black transition-colors flex items-center gap-2">
                  <Store className="w-4 h-4" /> Sell on Nexus
                </Link>
                <Link href="/wholesaler-auth" className="hover:text-black transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" /> Wholesale
                </Link>
              </>
            )}
            {user?.role === 'vendor' && (
              <Link href="/vendor" className="hover:text-black transition-colors">Vendor Portal</Link>
            )}
            {user?.role === 'customer' && (
              <Link href="/customer" className="hover:text-black transition-colors">My Dashboard</Link>
            )}
            {user?.role === 'wholesaler' && (
              <Link href="/wholesaler" className="hover:text-black transition-colors">Wholesale Portal</Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="hover:text-black transition-colors font-bold text-black">Admin Panel</Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-black/5 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10 w-64"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full text-[10px] font-bold">
            <Globe className="w-3 h-3" />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          
          <Link href="/cart" className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <Link href="/wishlist" className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
            <Heart className="w-5 h-5" />
          </Link>

          <button className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4 ml-1 sm:ml-2">
              <Link href="/profile" className="flex flex-col items-end hidden md:flex hover:opacity-80 transition-opacity">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 leading-none mb-1">{user.role}</span>
                <span className="text-xs font-bold leading-none">{user.name}</span>
              </Link>
              <button onClick={logout} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <UserIcon className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-black/5 mt-4"
          >
            <div className="flex flex-col gap-4 py-6 px-4">
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-bold text-lg">Shop All</Link>
              <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-bold text-lg">Categories</Link>
              <div className="h-px bg-black/5 my-2" />
              {!user && (
                <div className="flex flex-col gap-4">
                  <Link href="/vendor-auth" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-medium">
                    <Store className="w-5 h-5" /> Sell on Nexus
                  </Link>
                  <Link href="/wholesaler-auth" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-medium">
                    <Users className="w-5 h-5" /> Wholesale
                  </Link>
                </div>
              )}
              {user?.role === 'vendor' && (
                <Link href="/vendor" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-medium">Vendor Portal</Link>
              )}
              {user?.role === 'customer' && (
                <Link href="/customer" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-medium">My Dashboard</Link>
              )}
              {user?.role === 'wholesaler' && (
                <Link href="/wholesaler" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-medium">Wholesale Portal</Link>
              )}
              {user?.role === 'admin' && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-bold text-orange-600">Admin Panel</Link>
              )}
              <div className="h-px bg-black/5 my-2" />
              <div className="flex items-center gap-4 px-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full text-[10px] font-bold">
                  <Globe className="w-3 h-3" />
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-bold">
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
