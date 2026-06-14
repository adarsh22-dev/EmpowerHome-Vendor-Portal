"use client";

import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Heart, 
  Layers, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import { useCart } from './Providers';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (p: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isWishlisted, 
  onToggleWishlist, 
  isCompared, 
  onToggleCompare 
}) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-black/5 mb-3 sm:mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {product.wholesale_price && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 h-3" /> WHOLESALE
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-1.5 sm:gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
            className={`p-1.5 sm:p-2 rounded-full shadow-sm transition-all duration-300 ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-black/40 hover:text-rose-500'}`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare?.(product);
            }}
            className={`p-1.5 sm:p-2 rounded-full shadow-sm transition-all duration-300 ${isCompared ? 'bg-black text-white' : 'bg-white text-black/40 hover:text-black'}`}
            title="Compare Product"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <Link 
            href={`/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 sm:p-2 rounded-full bg-white text-black/40 hover:text-orange-600 shadow-sm transition-all duration-300"
            title="360° View"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white text-black p-2 sm:p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <Link href={`/products/${product.id}`}>
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <p className="text-[8px] sm:text-[10px] font-bold text-black/40 uppercase tracking-widest">{product.category_name || 'General'}</p>
          {product.brand && <p className="text-[8px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest">{product.brand}</p>}
        </div>
        <h3 className="font-bold text-sm sm:text-lg leading-tight mb-0.5 sm:mb-1 group-hover:text-black transition-colors line-clamp-2">{product.name}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="font-bold text-base sm:text-xl">${(product.price ?? 0).toFixed(2)}</p>
            {product.wholesale_price && (
              <p className="text-emerald-600 font-bold text-[10px] sm:text-sm">Wholesale: ${(product.wholesale_price ?? 0).toFixed(2)}</p>
            )}
          </div>
          <span className={`w-fit text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
