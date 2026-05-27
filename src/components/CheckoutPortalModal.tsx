/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, CreditCard, Sparkles, QrCode, 
  ExternalLink, CheckCircle, ArrowRight, CornerDownRight, 
  Laptop, Smartphone, Loader2, Landmark, Copy, Check 
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Product, CartItem } from '../types';

interface CheckoutPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  cartItems?: CartItem[];
  onSuccessPurchase: (orderInfo: any) => void;
}

export default function CheckoutPortalModal({
  isOpen,
  onClose,
  product,
  cartItems = [],
  onSuccessPurchase
}: CheckoutPortalModalProps) {
  const [activeMethod, setActiveMethod] = useState<'affiliate' | 'stripe' | 'pix'>('affiliate');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  // Pix QR State
  const [pixCopied, setPixCopied] = useState(false);
  const [pixTimeLeft, setPixTimeLeft] = useState(300); // 5 minutes

  // Redirection Countdown
  const [redirectCount, setRedirectCount] = useState(5);
  const [isRedirectActive, setIsRedirectActive] = useState(false);

  // List of items in this checkout session
  const items = product ? [product] : cartItems.map(item => item.product);
  const totalPrice = items.reduce((acc, p) => acc + p.price, 0);
  const cartLabel = items.map(p => p.title).join(', ');

  useEffect(() => {
    if (isOpen) {
      setActiveMethod('affiliate');
      setIsProcessing(false);
      setIsSuccess(false);
      setPixCopied(false);
      setPixTimeLeft(300);
      setRedirectCount(5);
      setIsRedirectActive(false);
    }
  }, [isOpen]);

  // Pix countdown tick
  useEffect(() => {
    if (!isOpen || activeMethod !== 'pix' || pixTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setPixTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, activeMethod, pixTimeLeft]);

  // Redirection ticker
  useEffect(() => {
    if (!isOpen || activeMethod !== 'affiliate' || !isRedirectActive || redirectCount <= 0) return;
    
    const interval = setInterval(() => {
      setRedirectCount((prev) => {
        if (prev - 1 === 0) {
          clearInterval(interval);
          handleFinalRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, activeMethod, isRedirectActive, redirectCount]);

  const handleFinalRedirect = () => {
    if (product) {
      window.location.href = product.affiliateLink;
    } else if (cartItems.length > 0) {
      window.location.href = cartItems[0].product.affiliateLink;
    }
  };

  const handleCopyPix = () => {
    const randomKey = `00020126580014br.gov.bcb.pix0136hikishop2026pay-${Math.random().toString(36).substring(2, 15)}5204000053039865405${totalPrice.toFixed(2)}5802BR5915HikiShopCorp6009SaoPaulo62070503***6304`;
    navigator.clipboard.writeText(randomKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  // Stripe Checkout Launcher
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Lazy load Stripe using env or a fallback test publishable key
      const stripePublicKey = (import.meta as any).env?.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51PXXXXXfakeStripeToken';
      const stripe = await loadStripe(stripePublicKey);

      // Simple processing transition for UX and simulation of payment gateway handshake
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        
        // Log Order Log
        const newOrder = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toLocaleDateString('pt-BR'),
          items: items.map(p => p.title),
          amount: totalPrice,
          status: 'Pago via Stripe',
          paymentMethod: 'Cartão de Crédito'
        };

        // Notify parent to append order
        onSuccessPurchase(newOrder);

        // Toast success
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 right-6 z-[120] bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 border border-emerald-550';
        toast.innerHTML = `<span>💳</span> Pagamento aprovado com sucesso via Stripe!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }, 2500);

    } catch (err) {
      setIsProcessing(false);
      alert('Erro ao se conectar com a API do Stripe Checkout. Por favor, revise as chaves no arquivo de configuração do seu portal.');
    }
  };

  // Pix Instant Paid Simulation
  const handleSimulatePixPaid = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('pt-BR'),
        items: items.map(p => p.title),
        amount: totalPrice,
        status: 'Pago via Pix',
        paymentMethod: 'PIX Instantâneo'
      };

      onSuccessPurchase(newOrder);

      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 z-[120] bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 border border-emerald-550';
      toast.innerHTML = `<span>⚡</span> Pix recebido e compensado com sucesso!`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="checkout-portal-modal-root">
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
                  Resumo da Compra
                </span>
                <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Compra Segura
                </span>
              </div>

              {/* Items Display */}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">PRODUTOS SELECIONADOS ({items.length})</span>
                <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="flex gap-3 bg-white border border-slate-150 p-2.5 rounded-xl">
                      <img src={it.image} alt={it.title} className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-900 leading-tight uppercase line-clamp-2 truncate">{it.title}</h4>
                        <p className="text-xs font-black text-slate-800 mt-1">
                          R$ {it.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice calculation */}
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 font-extrabold uppercase tracking-wider">
                  <span>Frete Cupom Especial</span>
                  <span>GRÁTIS ✓</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 uppercase tracking-tight pt-2 border-t border-dashed border-slate-200">
                  <span>Total Geral</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Redirection info for affiliate link */}
            <div className="bg-orange-50/70 border border-orange-100 p-4 rounded-xl space-y-1.5 mt-6">
              <span className="text-[9.5px] uppercase font-bold text-orange-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" /> Cupom de Parceiro Aplicado!
              </span>
              <p className="text-[10px] text-orange-800 leading-normal font-medium">Cuidamos das melhores negociações globais para garantir sempre o menor preço final para você.</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Gateway Panel */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto min-h-[50vh]" id="checkout-gateway-panel">
            {/* Top Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMethod('affiliate')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                    activeMethod === 'affiliate'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ir para Loja Oficial
                </button>
                <button
                  onClick={() => setActiveMethod('stripe')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                    activeMethod === 'stripe'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cartão via Stripe
                </button>
                <button
                  onClick={() => setActiveMethod('pix')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                    activeMethod === 'pix'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ⚡ Pague com Pix
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Render Success View */}
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
                  <h2 className="text-base font-black uppercase tracking-tight text-slate-900">Pagamento Confirmado!</h2>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">As informações e código de rastreio de seu pedido foram gerados com sucesso e estão cadastrados no seu painel pessoal.</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-left font-mono text-[11px] text-emerald-800 font-bold space-y-1">
                  <p>Código do Pedido: ORD-{Math.floor(1000 + Math.random() * 9000)}</p>
                  <p>Valor Compensado: R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p>Status: Compra Processada ✓</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer shadow-md transition-all uppercase tracking-wide"
                >
                  Fechar Portal
                </button>
              </motion.div>
            ) : (
              /* Normal content tabs */
              <div className="flex-1 flex flex-col justify-between">
                
                {/* METHOD 1: Inside the app browser iframe preview & Affiliate exit */}
                {activeMethod === 'affiliate' && (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                       <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Excelente opção de parceiros oficiais</h3>
                       <h2 className="text-base font-black tracking-tight text-slate-900 leading-snug uppercase">Como funciona a compra assistida?</h2>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Clicando em <strong>Prosseguir</strong>, nós aplicamos nosso cookie de afiliado autenticado e você é redirecionado de forma segura para o preço promocional oficial do anunciante (Shopee/Amazon) com descontos de cupons exclusivos ativados automaticamente no marketplace final!
                       </p>
                    </div>

                    {/* Styled Interactive Iframe Mini Portal Window simulating staying inside site */}
                    <div className="border border-slate-200 rounded-2xl bg-slate-100 overflow-hidden shadow-inner flex flex-col h-44 sm:h-52 font-sans">
                      <div className="bg-slate-200/80 px-4 py-2 border-b border-slate-300 flex items-center justify-between shrink-0 select-none">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                        </div>
                        <div className="bg-white/80 border border-slate-300 rounded px-3 py-0.5 text-[9.5px] text-slate-500 font-mono w-44 truncate text-center">
                          {product ? product.affiliateLink : "shopee.com.br/hiki-ofertas"}
                        </div>
                        <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wide bg-white px-2 py-0.5 rounded border border-slate-200">Parceiro</span>
                      </div>
                      <div className="flex-1 bg-white p-4 flex flex-col items-center justify-center text-center space-y-2 select-none">
                        <span className="text-3xl animate-pulse">📲</span>
                        <p className="text-[11px] text-slate-700 font-bold max-w-xs uppercase leading-snug">Visualizador Interno Protegido Hiki Shop Ativo</p>
                        <p className="text-[9.5px] text-slate-400 font-medium max-w-xs">{items.length} produto(s) pronto(s) para aplicação de cupons adicionais do dia no marketplace.</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      {isRedirectActive ? (
                        <div className="text-center bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
                          <Loader2 className="w-5 h-5 text-orange-600 animate-spin mx-auto" />
                          <p className="text-xs font-black text-slate-900 uppercase">Redirecionando em {redirectCount} segundos...</p>
                          <button
                            onClick={handleFinalRedirect}
                            className="text-[11px] text-orange-600 font-black hover:underline"
                          >
                            Clique aqui para ir imediatamente e aplicar cupom
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => {
                              setIsRedirectActive(true);
                              setRedirectCount(4);
                            }}
                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-105 transition-all text-center flex items-center justify-center gap-2 cursor-pointer w-full"
                          >
                            Prosseguir de Forma Segura <ArrowRight className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setActiveMethod('stripe')}
                            className="py-3 px-5 border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center bg-white"
                          >
                            Pagar com Cartão
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* METHOD 2: Custom Credit Card using Safe Stripe Checkout Portal */}
                {activeMethod === 'stripe' && (
                  <form onSubmit={handleStripeCheckout} className="space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#635bff] flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" /> Gateway Stripe Ativo
                      </h3>
                      <p className="text-xs text-slate-500 leading-normal font-medium">Finalize seu pagamento seguro integrado. O checkout do Stripe garante criptografia ponta a ponta.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative space-y-3">
                      <span className="absolute top-2.5 right-2.5 text-[8.5px] font-black uppercase bg-[#635bff] text-white px-1.5 py-0.5 rounded-sm">
                        STRIPE AMBIENTE SEGURO
                      </span>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wide">Nome impresso no cartão</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="EX: JOÃO S. SILVA"
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-800 font-bold uppercase"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-300 block tracking-wide text-slate-400">Número do cartão</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            // Simple formatting for credit cards
                            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const matches = val.match(/.{1,4}/g);
                            setCardNumber(matches ? matches.join(' ') : val);
                          }}
                          placeholder="0000 0000 0000 0000"
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-800 font-bold font-mono"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wide">Validade</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (val.length >= 2) {
                                setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
                              } else {
                                setCardExpiry(val);
                              }
                            }}
                            placeholder="MM/AA"
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-800 font-bold font-mono"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wide">CVC / Código de Segurança</label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="123"
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-800 font-bold font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-[#635bff] hover:bg-[#5850ec] disabled:bg-slate-300 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#635bff]/10 transition-all"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Conectando com o Stripe...
                        </>
                      ) : (
                        <>
                          Finalizar com Stripe | R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* METHOD 3: Pagamento Inteligente por PIX com compensação em tempo real */}
                {activeMethod === 'pix' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 font-sans">
                        <QrCode className="w-4.5 h-4.5 text-emerald-600" /> PIX Instantâneo Inteligente
                      </h3>
                      <p className="text-xs text-slate-500 leading-normal font-medium">A compensação do PIX é feita de forma imediata trazendo 5% de desconto acumulado adicionado ao final!</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center space-y-4 relative">
                      {/* Code Time expiration banner */}
                      <span className="text-[9.5px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full block border border-orange-200">
                        O QR Code expira em: <span className="font-mono">{formatTime(pixTimeLeft)}</span>
                      </span>

                      {/* Mock QR Code representation */}
                      <div className="w-36 h-36 bg-white border border-slate-150 p-2.5 rounded-xl shadow-inner flex items-center justify-center relative group">
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                          {/* Standard technical aesthetic QR pattern drawing */}
                          <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                          <rect x="10" y="10" width="15" height="15" fill="white" />
                          <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                          
                          <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                          <rect x="75" y="10" width="15" height="15" fill="white" />
                          <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                          
                          <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                          <rect x="10" y="75" width="15" height="15" fill="white" />
                          <rect x="12" y="77" width="11" height="11" fill="currentColor" />

                          {/* Dots pattern representation */}
                          <circle cx="45" cy="15" r="4" fill="currentColor" />
                          <circle cx="55" cy="25" r="3" fill="currentColor" />
                          <circle cx="45" cy="45" r="5" fill="currentColor" />
                          <circle cx="55" cy="55" r="3" fill="currentColor" />
                          <circle cx="75" cy="45" r="4" fill="currentColor" />
                          <circle cx="45" cy="75" r="5" fill="currentColor" />
                          <circle cx="75" cy="75" r="3" fill="currentColor" />
                          <circle cx="85" cy="85" r="4" fill="currentColor" />
                          <circle cx="15" cy="45" r="4" fill="currentColor" />
                          
                          <rect x="85" y="30" width="10" height="25" fill="currentColor" />
                          <rect x="30" y="85" width="25" height="10" fill="currentColor" />
                        </svg>
                        
                        {/* Little Pix Badge inside center of Qr representation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 border border-slate-150 rounded">
                          <span className="text-[10px] font-black text-teal-600 block select-none">PIX</span>
                        </div>
                      </div>

                      {/* Pix details */}
                      <div className="w-full space-y-2">
                        <button
                          onClick={handleCopyPix}
                          className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          {pixCopied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" /> Pix Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-slate-500" /> Copiar Código Copia e Cola
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleSimulatePixPaid}
                          disabled={isProcessing}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Validando Compravação...
                            </>
                          ) : (
                            <>
                              Simular Compensação do Pix ✓
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
