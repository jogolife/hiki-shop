/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, Sparkles, ExternalLink, 
  CheckCircle, ArrowRight, CornerDownRight, 
  ShoppingBag, Trash2
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface CheckoutPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  cartItems?: CartItem[];
  onSuccessPurchase: (orderInfo: any) => void;
  officialStoreLink?: string;
  redirectionType?: 'product' | 'global';
}

export default function CheckoutPortalModal({
  isOpen,
  onClose,
  product,
  cartItems = [],
  onSuccessPurchase,
  officialStoreLink = '',
  redirectionType = 'product'
}: CheckoutPortalModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCount, setRedirectCount] = useState(4);
  const [isRedirectActive, setIsRedirectActive] = useState(false);

  // List of items in this checkout session
  const items = product ? [product].filter(Boolean) : (cartItems || []).map(item => item?.product).filter(Boolean);
  const totalPrice = items.reduce((acc, p) => acc + (p?.price || 0), 0);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setRedirectCount(4);
      setIsRedirectActive(false);
    }
  }, [isOpen]);

  // Handle opening all links
  const handleOpenAllLinks = () => {
    // Generate order logged beautifully
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('pt-BR'),
      items: items.map(p => p.title),
      amount: totalPrice,
      status: 'Redirecionado para Loja Parceira',
      paymentMethod: 'Link de Afiliado'
    };

    onSuccessPurchase(newOrder);
    setIsSuccess(true);

    // Open first link immediately, and let user click others or open them
    items.forEach((it, idx) => {
      const link = redirectionType === 'global' && officialStoreLink 
        ? officialStoreLink 
        : (it.affiliateLink || officialStoreLink || 'https://shopee.com.br/hiki-ofertas');
      // Open in new tab
      window.open(link, '_blank', 'noopener,noreferrer');
    });

    // Notify with a toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-[120] bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 border border-emerald-550';
    toast.innerHTML = `<span>🚀</span> Carrinho Hiki Shop integrado com sucesso à Loja Original!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  // Helper to determine marketplace name based on URL
  const getMarketplaceName = (url: string) => {
    const raw = url.toLowerCase();
    if (raw.includes('shopee')) return 'Shopee';
    if (raw.includes('amazon')) return 'Amazon';
    if (raw.includes('aliexpress')) return 'AliExpress';
    if (raw.includes('magazineluiza') || raw.includes('magazinevoce') || raw.includes('magalu')) return 'Magalu';
    return 'Loja Oficial';
  };

  const getMarketplaceColor = (name: string) => {
    switch (name) {
      case 'Shopee': return 'bg-orange-600 text-white border-orange-700';
      case 'Amazon': return 'bg-amber-500 text-slate-900 border-amber-600';
      case 'AliExpress': return 'bg-rose-600 text-white border-rose-700';
      case 'Magalu': return 'bg-blue-600 text-white border-blue-700';
      default: return 'bg-slate-800 text-white border-slate-900';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="checkout-portal-modal-root">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-slate-100"
        >
          {/* LEFT COLUMN: Summary & Trust */}
          <div className="md:w-5/12 bg-slate-50 p-6 sm:p-8 border-r border-slate-200 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-orange-100 text-orange-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border border-orange-200">
                  Resumo do Carrinho
                </span>
                <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Cupom Ativo
                </span>
              </div>

              {/* Items Display */}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">PRODUTOS NO SEU PORTAL ({items.length})</span>
                <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="flex gap-3 bg-white border border-slate-150 p-2.5 rounded-xl shadow-sm">
                      <img src={it.image} alt={it.title} className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-900 leading-tight uppercase line-clamp-2">{it.title}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <p className="text-xs font-black text-slate-800">
                            R$ {it.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <span className={`text-[8px] font-mono font-bold uppercase px-1 rounded-sm border ${getMarketplaceColor(getMarketplaceName(it.affiliateLink))}`}>
                            {getMarketplaceName(it.affiliateLink)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice calculation */}
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Subtotal Estimado</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 font-extrabold uppercase tracking-wider">
                  <span>Envio de Cupons</span>
                  <span>GRÁTIS NO MEU PORTUARIO ✓</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 uppercase tracking-tight pt-2 border-t border-dashed border-slate-200">
                  <span>Total Inteligente</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Certifications footer */}
            <div className="mt-8 pt-4 border-t border-slate-200/60 text-center select-none space-y-2 hidden md:block">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">🔒 REDIRECIONAMENTO COM SEGURANÇA SSL</span>
              <p className="text-[9.5px] text-slate-400 leading-relaxed font-semibold">Os cupons de afiliados são validados em tempo real com os maiores e-commerces operantes no Brasil para máxima economia da sua compra.</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Streamlined Redirect Panel */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto min-h-[50vh]" id="checkout-gateway-panel">
            {/* Top Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm border border-orange-200">
                  🛒 Carrinho Direto Hiki Shop
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Render Redirect Confirmation View */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-5 max-w-sm mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto border-2 border-emerald-100 animate-bounce">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-base font-black uppercase tracking-tight text-slate-900 font-sans">Redirecionado com Sucesso!</h2>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Suas abas foram abertas nos parceiros oficiais. Caso alguma aba tenha sido bloqueada pelo navegador, você pode usar os links individuais abaixo para fechar sua compra diretamente na respectiva loja oficial de cada produto.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-[11px] text-slate-800 space-y-2.5 max-h-[22vh] overflow-y-auto">
                  <p className="font-bold text-[9.5px] uppercase tracking-wider text-slate-400">Links Rápidos de Finalização:</p>
                  {items.map((it, index) => (
                    <div key={it.id} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 last:border-none">
                      <span className="font-bold truncate text-[10.5px] uppercase flex-1">{it.title}</span>
                      <a
                        href={redirectionType === 'global' && officialStoreLink ? officialStoreLink : (it.affiliateLink || 'https://shopee.com.br/hiki-ofertas')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-100 text-orange-600 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm hover:bg-orange-600 hover:text-white transition-all whitespace-nowrap"
                      >
                        Abrir Loja ↗
                      </a>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer shadow-md transition-all uppercase tracking-wide w-full"
                >
                  Fechar Portal de Redirecionamento
                </button>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                {/* Information Header */}
                <div className="space-y-4">
                  <div className="space-y-2">
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Excelente opção para economia e segurança, sem taxas extras</h3>
                     <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-snug uppercase">Conexão Automática de Carrinho</h2>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        A Hiki Shop atua integrando o seu carrinho para redirecionamento. As compras finais são consolidadas e processadas de forma criptografada nos maiores canais oficiais do Brasil. Para sua comodidade de conversão e proteção contra golpes, você pode comprar cada um dos itens clicando em seus respectivos links abaixo, ou simplesmente clicando no botão para abrir todos os produtos de uma só vez!
                     </p>
                  </div>

                  {/* Dynamic Product Affiliate List for each product in checkout */}
                  <div className="space-y-2.5 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">PRODUTOS PARA CONECTAR INDIVIDUALMENTE</span>
                    <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                      {items.map((it) => {
                        const market = getMarketplaceName(it.affiliateLink);
                        return (
                          <div key={it.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs hover:border-slate-800 transition-all">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={it.image}
                                alt={it.title}
                                className="w-10 h-10 object-cover border border-slate-200 rounded-lg shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-bold text-slate-950 uppercase tracking-tight line-clamp-1">{it.title}</h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[11px] font-black text-slate-800">
                                    R$ {it.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className={`text-[8px] font-bold px-1 rounded-sm border ${getMarketplaceColor(market)}`}>
                                    {market}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <a
                              href={redirectionType === 'global' && officialStoreLink ? officialStoreLink : (it.affiliateLink || 'https://shopee.com.br/hiki-ofertas')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all shrink-0 flex items-center gap-1 shadow-sm"
                            >
                              Comprar na Loja ↗
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Major Call To Action */}
                <div className="pt-6 border-t border-slate-100 mt-6">
                  <button
                    onClick={handleOpenAllLinks}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-105 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    CONECTAR TODO O CARRINHO E IR PARA AS LOJAS PARCEIRAS <ExternalLink className="w-4.5 h-4.5" />
                  </button>
                  <p className="text-center text-[9px] text-slate-400 font-bold uppercase mt-2.5 tracking-wider">
                    ⚡ DESCONTOS E CUPONS PROMOCIONAIS ATIVADOS INTERNAMENTE DE FORMA AUTOMÁTICA!
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
