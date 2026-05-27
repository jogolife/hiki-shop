/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Heart, Plus, Minus, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react';
import { CartItem, Product } from '../types';
import ShippingCalculator from './ShippingCalculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  savedProducts: Product[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onSaveForLater: (product: Product) => void;
  onRemoveSaved: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  savedProducts,
  onUpdateQuantity,
  onRemoveItem,
  onSaveForLater,
  onRemoveSaved,
  onMoveToCart,
  onCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [activeShipping, setActiveShipping] = useState<{ id: string; carrier: string; service: string; price: number } | null>(null);

  const totalNormal = cartItems.reduce((acc, item) => {
    const fallbackPrice = item.product.originalPrice || item.product.price;
    return acc + (fallbackPrice * item.quantity);
  }, 0);

  const totalDiscount = cartItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  const savedAmount = totalNormal - totalDiscount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-root">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          id="cart-drawer-backdrop"
        />

        {/* Sliding Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
            id="cart-drawer-container"
          >
            {/* Header top */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                Carrinho Inteligente
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-sm transition-all cursor-pointer border border-transparent"
                id="close-cart-drawer-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
              
              {/* Active Cart Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Produtos Escolhidos</span>
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-orange-100">
                    {cartItems.length} Itens
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <span className="text-3xl">🛒</span>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Seu carrinho está sem produtos.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cartItems.map((item) => {
                      const discountPercentage = item.product.originalPrice 
                        ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
                        : null;

                      return (
                        <div key={item.product.id} className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-800 transition-all flex gap-3 relative shadow-sm">
                          {/* Product Thumbnail */}
                          <div className="w-14 h-14 bg-slate-50 overflow-hidden shrink-0 border border-slate-200 rounded-md">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Info Column */}
                          <div className="flex-1 min-w-0 pr-6">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-1">
                              {item.product.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-xs font-black text-slate-900">
                                R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                              {discountPercentage && (
                                <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-1 rounded-sm border border-orange-100">
                                  -{discountPercentage}%
                                </span>
                              )}
                            </div>

                            {/* Actions bar inside item */}
                            <div className="flex items-center gap-3 mt-2">
                              {/* Quantity switch */}
                              <div className="flex items-center border border-slate-200 bg-slate-50 rounded-sm">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                                  id={`qty-minus-btn-${item.product.id}`}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-1.5 text-xs font-bold text-slate-850">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                                  id={`qty-plus-btn-${item.product.id}`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Save for later button */}
                              <button
                                onClick={() => onSaveForLater(item.product)}
                                className="text-[10px] font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-wider"
                                title="Salvar para depois"
                                id={`save-later-btn-${item.product.id}`}
                              >
                                <Heart className="w-3 h-3" />
                                Salvar
                              </button>
                            </div>
                          </div>

                          {/* Absolute Remove Button */}
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="absolute top-2.5 right-2.5 p-1 text-slate-300 hover:text-slate-905 cursor-pointer transition-all"
                            title="Remover produto"
                            id={`remove-item-btn-${item.product.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Shipping calculator for Cart items */}
                {cartItems.length > 0 && (
                  <div className="pt-2">
                    <ShippingCalculator
                      isCart={true}
                      cartTotal={totalDiscount}
                      onSelectShipping={(opt) => setActiveShipping(opt)}
                      selectedOptionId={activeShipping?.id}
                    />
                  </div>
                )}
              </div>

              {/* Saved For Later Section */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Salvos para Depois ({savedProducts.length})</span>
                
                {savedProducts.length === 0 ? (
                  <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-wider py-2">Nenhum produto salvo.</p>
                ) : (
                  <div className="space-y-2">
                    {savedProducts.map((prod) => (
                      <div key={prod.id} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-10 h-10 object-cover border border-slate-200 rounded-sm shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-bold text-slate-950 uppercase tracking-tight line-clamp-1">{prod.title}</h5>
                            <span className="text-[11px] font-black text-slate-800">
                              R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onMoveToCart(prod)}
                            className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-[9.5px] font-black uppercase tracking-wider rounded-sm border border-orange-250 cursor-pointer transition-all"
                            id={`move-to-cart-btn-${prod.id}`}
                          >
                            Mover
                          </button>
                          <button
                            onClick={() => onRemoveSaved(prod.id)}
                            className="p-1 px-1.5 text-slate-430 hover:text-slate-900 cursor-pointer"
                            id={`remove-saved-btn-${prod.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Sticky summary & checkout CTA */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-white border-t border-slate-200 space-y-3.5 shrink-0" id="cart-drawer-summary">
                
                {/* Micro-saving banner */}
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <div className="text-xs text-emerald-950">
                    <p className="font-black uppercase tracking-wide flex items-center gap-1 text-[10.5px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Economia de R$ {savedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}!
                    </p>
                    <p className="text-[9.5px] text-emerald-700/80 font-semibold mt-0.5">CUPONS E DESCONTOS ATIVADOS AUTOMATICAMENTE.</p>
                  </div>
                </div>

                {/* Subtotals breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between uppercase tracking-wider font-extrabold text-[10px]">
                    <span>Subtotal Original</span>
                    <span className="line-through text-slate-400">
                      R$ {totalNormal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {activeShipping && (
                    <div className="flex justify-between uppercase tracking-wider font-extrabold text-[10px] text-slate-500 pb-0.5">
                      <span>Frete ({activeShipping.carrier} - {activeShipping.service})</span>
                      <span>
                        {activeShipping.price === 0 ? 'Grátis' : `R$ ${activeShipping.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-black uppercase tracking-widest text-[11px] text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total com Desconto</span>
                    <span className="text-orange-600 text-base font-black">
                      R$ {(totalDiscount + (activeShipping ? activeShipping.price : 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Major Affiliate Checkout button */}
                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs rounded-md shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                  id="checkout-trigger-btn"
                >
                  Confirmar & Comprar Agora
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
