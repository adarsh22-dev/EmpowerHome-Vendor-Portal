import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: number; name: string; price: number; image: string; stock: number;
}

interface RelatedProductsProps {
  productId: number;
  relationType: 'related' | 'cross_sell' | 'upsell';
  title: string;
  subtitle: string;
  onNavigate: (v: string, id?: number) => void;
  onAddToCart: (p: Product) => void;
  wishlist: Product[];
  onToggleWishlist?: (p: Product) => void;
  compareList: Product[];
  onToggleCompare?: (p: Product) => void;
  platformSettings?: { recommendation_limit?: number };
}

export default function RelatedProducts({
  productId, relationType, title, subtitle, onNavigate, onAddToCart,
  wishlist, onToggleWishlist, compareList, onToggleCompare, platformSettings
}: RelatedProductsProps) {
  const [relations, setRelations] = useState<any[]>([]);
  const limit = platformSettings?.recommendation_limit || 4;

  useEffect(() => {
    fetch(`/api/products/${productId}/relations?type=${relationType}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setRelations(data.slice(0, limit));
        }
      })
      .catch(() => {});
  }, [productId, relationType, limit]);

  if (relations.length === 0) return null;

  return (
    <div className="mt-20 sm:mt-32">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-2">{subtitle}</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">{title}</h2>
        </div>
        <button
          onClick={() => onNavigate('products')}
          className="hidden sm:flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {relations.map((rel, idx) => {
          const p: Product = {
            id: rel.related_product_id || rel.id,
            name: rel.name,
            price: rel.price,
            image: rel.image,
            stock: rel.stock ?? 0,
          };
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <ProductCard
                product={p}
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.some(w => w.id === p.id)}
                onToggleWishlist={onToggleWishlist}
                isCompared={compareList.some(c => c.id === p.id)}
                onToggleCompare={onToggleCompare}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ProductCard({ product, onNavigate, onAddToCart, isWishlisted, onToggleWishlist, isCompared, onToggleCompare }: {
  product: Product; onNavigate: (v: string, id?: number) => void; onAddToCart: (p: Product) => void;
  isWishlisted?: boolean; onToggleWishlist?: (p: Product) => void;
  isCompared?: boolean; onToggleCompare?: (p: Product) => void;
}) {
  return (
    <div className="group cursor-pointer" onClick={() => onNavigate('product-detail', product.id)}>
      <div className="aspect-square rounded-2xl overflow-hidden bg-black/5 mb-3 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image'; }}
        />
        {onToggleWishlist && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all"
          >
            <svg className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>
      <h3 className="font-bold text-sm sm:text-base leading-tight mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-sm sm:text-base font-bold text-orange-600">${product.price?.toFixed(2)}</p>
    </div>
  );
}
