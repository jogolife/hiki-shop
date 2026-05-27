/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Search, Smartphone } from 'lucide-react';
import { Product } from '../types';

interface SEOSectionProps {
  products: Product[];
}

export default function SEOSection({ products }: SEOSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  const [metaTitleSuffix, setMetaTitleSuffix] = useState('Melhores Ofertas e Cupons de Desconto');

  const getSimulatedTitle = () => {
    if (!selectedProduct) return '';
    const truncatedTitle = selectedProduct.title.slice(0, 45);
    return `${truncatedTitle}... por R$ ${selectedProduct.price.toFixed(2)} | ${metaTitleSuffix}`;
  };

  const getSimulatedDescription = () => {
    if (!selectedProduct) return '';
    return `Confira as melhores ofertas e descontos especiais. ${selectedProduct.description.slice(0, 130)}... Aproveite o link promocional oficial e receba em casa!`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-8 space-y-6" id="seo-section-simulator-box">
      {/* Header title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
          <Globe className="w-5 h-5 text-emerald-600" />
          Módulo de Otimização de SEO & Google Indexer
        </h2>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 leading-relaxed">
          Sua vitrine indexa rapidamente no Google. Simule os snippets de resultados de busca e confira os dados estruturados abaixo.
        </p>
      </div>

      {/* Grid containing Simulator and Quick Guides */}
      <div className="space-y-6">
        
        {/* SERP Simulator (Google Search Result Sneak Peek) */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            Simulador de Google SERP (Mobile & Desktop)
          </h3>

          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Escolher produto para simular</label>
                <select
                  onChange={(e) => {
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) setSelectedProduct(prod);
                  }}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-orange-500 font-bold text-slate-800"
                  value={selectedProduct?.id || ''}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Sufixo de Título Meta</label>
                <input
                  type="text"
                  value={metaTitleSuffix}
                  onChange={(e) => setMetaTitleSuffix(e.target.value)}
                  placeholder="Melhores Ofertas e Cupons de Desconto"
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
                />
              </div>
            </div>

            {/* Google Mobile Search Render */}
            <div className="bg-white p-3.5 rounded-sm border border-slate-200 shadow-sm space-y-1">
              <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                Visualização de busca mobile
              </span>
              <div className="text-[10.5px] text-slate-500 truncate flex items-center gap-1 mt-1">
                <span>hiki.shop</span>
                <span>› produto › {selectedProduct?.id}</span>
              </div>
              <h4 className="text-xs font-bold text-blue-850 hover:underline cursor-pointer line-clamp-1">
                {getSimulatedTitle()}
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                {getSimulatedDescription()}
              </p>
              
              {/* Product Rating Rich Snippet indicator */}
              <div className="flex items-center gap-1.5 pt-1.5 text-[9.5px] text-slate-500 font-bold border-t border-slate-100 mt-1">
                <span className="text-amber-500">★★★★★</span>
                <span>Nota: {selectedProduct?.rating}</span>
                <span>• {selectedProduct?.reviewsCount} avaliações</span>
                <span>• Preço: R$ {selectedProduct?.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
