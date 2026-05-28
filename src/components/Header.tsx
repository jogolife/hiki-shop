/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Search, User, Sparkles, SlidersHorizontal, Heart } from 'lucide-react';
import { defaultCategories } from '../data/defaultProducts';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  isAdminMode: boolean;
  onHomeClick: () => void;
  onProfileClick: () => void;
  isOwner?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  onCartClick,
  onAdminClick,
  isAdminMode,
  onHomeClick,
  onProfileClick,
  isOwner = false,
  onLoginClick,
  onLogoutClick
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm" id="custom-app-header">
      {/* Top micro-banner */}
      <div className="bg-orange-600 text-white text-[11px] py-1.5 px-4 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Descontos especiais aplicados automaticamente. Melhor preço garantido!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center cursor-pointer select-none shrink-0" onClick={onHomeClick} id="app-logo-container">
            <span className="text-2xl font-black tracking-tight text-orange-600 flex items-center gap-1.5 font-sans uppercase">
              <ShoppingCart className="w-5.5 h-5.5 text-orange-600" />
              HIKI<span className="text-slate-800 font-light">SHOP</span>
            </span>
          </div>

          {/* Smart Search Bar */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6" id="search-bar-container">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar produtos, marcas, categorias gamer, celulares..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-transparent rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                id="search-input-field"
              />
              <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Profile & Wishlist button */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-orange-600 hover:bg-orange-50/50 rounded-xl transition-all border border-slate-200 cursor-pointer"
              title="Meu Perfil & Favoritos"
              id="profile-toggle-btn"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="hidden sm:inline">Meu Perfil</span>
            </button>

            {/* Smart Cart Toggle */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1.5 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-xs hover:bg-orange-100 transition-all cursor-pointer"
              title="Abrir Carrinho"
              id="cart-drawer-toggle-btn"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{cartCount} Ítens</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="py-2 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center justify-start gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 pr-2 mr-2 border-r border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            {defaultCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
                }`}
                id={`cat-filter-btn-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
