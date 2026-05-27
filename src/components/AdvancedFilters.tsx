/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Star, RotateCcw, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Product } from '../types';

export interface FilterState {
  brands: string[];
  minPrice: number | '';
  maxPrice: number | '';
  minRating: number;
  attributes: Record<string, string[]>;
}

interface AdvancedFiltersProps {
  products: Product[];
  currentCategory: string;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

export default function AdvancedFilters({
  products,
  currentCategory,
  filters,
  onChange,
  onClear,
}: AdvancedFiltersProps) {
  // Extract dynamic values depending on category/search subset
  const categoryProducts = useMemo(() => {
    if (currentCategory === 'all') return products;
    return products.filter((p) => p.category === currentCategory);
  }, [products, currentCategory]);

  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [categoryProducts]);

  const priceStats = useMemo(() => {
    if (categoryProducts.length === 0) return { min: 0, max: 5000 };
    const prices = categoryProducts.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [categoryProducts]);

  // Extract all category-specific attributes dynamically
  const dynamicAttributeGroups: Record<string, string[]> = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    categoryProducts.forEach((p) => {
      if (p.attributes) {
        Object.entries(p.attributes).forEach(([key, val]) => {
          if (!groups[key]) {
            groups[key] = new Set<string>();
          }
          groups[key].add(val as string);
        });
      }
    });

    const result: Record<string, string[]> = {};
    Object.entries(groups).forEach(([key, valSet]) => {
      result[key] = Array.from(valSet).sort();
    });
    return result;
  }, [categoryProducts]);

  const handleBrandToggle = (brand: string) => {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: nextBrands });
  };

  const handleAttributeValueToggle = (attrKey: string, value: string) => {
    const currentVals = filters.attributes[attrKey] || [];
    const nextVals = currentVals.includes(value)
      ? currentVals.filter((v) => v !== value)
      : [...currentVals, value];

    onChange({
      ...filters,
      attributes: {
        ...filters.attributes,
        [attrKey]: nextVals,
      },
    });
  };

  const hasActiveFilters = 
    filters.brands.length > 0 ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minRating > 0 ||
    Object.values(filters.attributes).some((arr) => arr.length > 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-5 shadow-xs" id="advanced-filters-widget">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
          Filtros de Busca
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-[10px] font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1 cursor-pointer"
            id="clear-all-filters-btn"
          >
            <RotateCcw className="w-3 h-3" />
            Limpar
          </button>
        )}
      </div>

      {/* Brand Selector */}
      {uniqueBrands.length > 0 && (
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Marca</span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
            {uniqueBrands.map((brand) => {
              const checked = filters.brands.includes(brand);
              return (
                <label key={brand} className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleBrandToggle(brand)}
                    className="accent-orange-600 w-3.5 h-3.5 border-slate-300 rounded-sm focus:ring-0"
                  />
                  <span>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-2.5 border-b border-slate-100 pb-4">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Faixa de Preço</span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mínimo (R$)</label>
            <input
              type="number"
              value={filters.minPrice}
              min={priceStats.min}
              max={priceStats.max}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value);
                onChange({ ...filters, minPrice: val });
              }}
              placeholder={`${priceStats.min}`}
              className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-orange-500 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Máximo (R$)</label>
            <input
              type="number"
              value={filters.maxPrice}
              min={priceStats.min}
              max={priceStats.max}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value);
                onChange({ ...filters, maxPrice: val });
              }}
              placeholder={`${priceStats.max}`}
              className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-orange-500 font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-1.5 border-b border-slate-100 pb-4">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Avaliação do Cliente</span>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5].map((stars) => {
            const active = filters.minRating === stars;
            return (
              <button
                key={stars}
                onClick={() => onChange({ ...filters, minRating: active ? 0 : stars })}
                className={`w-full flex items-center justify-between p-2 text-xs font-semibold rounded-sm transition-all border outline-none text-left cursor-pointer ${
                  active
                    ? 'bg-orange-50 border-orange-300 text-orange-600'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-medium">{'★'.repeat(Math.floor(stars))}</span>
                  <span>{stars.toFixed(1)} ou mais</span>
                </div>
                {active && <span className="text-[9px] font-black uppercase">Ativo</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Category Specific Attributes */}
      {Object.entries(dynamicAttributeGroups).map(([attrKey, rawValues]) => {
        const values = rawValues as string[];
        if (values.length === 0) return null;
        return (
          <div key={attrKey} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-orange-500" />
              {attrKey}
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
              {values.map((v) => {
                const checked = (filters.attributes[attrKey] as string[] | undefined)?.includes(v) || false;
                return (
                  <label key={v} className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAttributeValueToggle(attrKey, v)}
                      className="accent-orange-600 w-3.5 h-3.5 border-slate-300 rounded-sm focus:ring-0"
                    />
                    <span>{v}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
