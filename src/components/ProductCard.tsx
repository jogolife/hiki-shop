/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, ExternalLink, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onViewDetails: (product: Product) => void;
  onAffiliateRedirect: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  onAffiliateRedirect
}: ProductCardProps) {
  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    const diff = product.originalPrice - product.price;
    return Math.round((diff / product.originalPrice) * 100);
  };

  const discountVal = calculateDiscount();

  return (
    <motion.div
      layout
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-900 transition-all flex flex-col h-full group select-none relative"
      onClick={() => onViewDetails(product)}
      id={`product-card-${product.id}`}
    >
      {/* Badges container */}
      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
        {discountVal && (
          <span className="bg-orange-600 text-white font-black text-[9.5px] px-2 py-0.5 rounded-sm shadow-sm uppercase tracking-wider flex items-center gap-0.5">
            -{discountVal}% OFF
          </span>
        )}
        {product.isDailyDeal && (
          <span className="bg-slate-900 text-white font-black text-[9px] px-2 py-0.5 rounded-sm shadow-sm uppercase tracking-widest">
            SUPER OFERTA
          </span>
        )}
      </div>

      {/* Image Block */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden border-b border-slate-100" id={`product-card-img-block-${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="bg-white text-slate-900 border border-slate-200 font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-sm shadow-sm flex items-center gap-1">
            Ver Detalhes <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Content Block */}
      <div className="p-3.5 flex flex-col flex-1" id={`product-card-content-${product.id}`}>
        {/* Category & Tags */}
        <div className="flex flex-wrap gap-1 mb-1.5">
          <span className="text-[9px] uppercase font-black text-orange-600 tracking-wider">
            {product.category}
          </span>
          {product.tags?.slice(0, 2).map((tg, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-600 text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-slate-200/50">
              {tg}
            </span>
          ))}
        </div>

        {/* Product Title */}
        <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[36px] leading-tight mb-2 font-sans uppercase tracking-tight">
          {product.title}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1 mb-2.5">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-800">{product.rating}</span>
          <span className="text-slate-300 text-[10px]">•</span>
          <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">{product.reviewsCount} avaliações</span>
        </div>

        {/* Pricing Layout */}
        <div className="mt-auto mb-3.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-slate-900">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 font-bold line-through">
                R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <p className="text-[9px] text-emerald-600 font-semibold tracking-wider uppercase mt-0.5">
            ✓ MELHOR PREÇO COM DESCONTO
          </p>
        </div>

        {/* Interactive Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-auto" onClick={(e) => e.stopPropagation()}>
          {/* Add to Cart */}
          <button
            onClick={(e) => onAddToCart(product, e)}
            className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-[10px] font-bold uppercase tracking-wider py-2 px-1 rounded-md transition-all cursor-pointer border border-slate-200 hover:border-orange-300"
            title="Adicionar ao Carrinho"
            id={`add-to-cart-btn-${product.id}`}
          >
            <ShoppingCart className="w-3 h-3" />
            + Carrinho
          </button>

          {/* Buy Now (Direct Affiliate Link) */}
          <button
            onClick={() => onAffiliateRedirect(product)}
            className="flex items-center justify-center gap-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider py-2 px-1 rounded-md shadow-sm cursor-pointer hover:bg-orange-700 transition-all shrink-0"
            title="Aproveitar Desconto Exclusivo"
            id={`buy-now-btn-${product.id}`}
          >
            Aproveite
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
