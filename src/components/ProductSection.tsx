"use client";

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import Link from 'next/link';

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (p: Product) => void;
  compareList: Product[];
  onToggleCompare: (p: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  subtitle, 
  products, 
  wishlist, 
  onToggleWishlist, 
  compareList, 
  onToggleCompare 
}) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-4 sm:gap-0">
      <div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm sm:text-base text-black/50">{subtitle}</p>
      </div>
      <Link href="/products" className="w-fit text-sm font-bold underline underline-offset-4 hover:text-black/70 transition-colors">Shop All</Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
      {products.map((p) => (
        <ProductCard 
          key={p.id} 
          product={p} 
          isWishlisted={wishlist.some(item => item.id === p.id)}
          onToggleWishlist={onToggleWishlist}
          isCompared={compareList.some(item => item.id === p.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  </section>
);
