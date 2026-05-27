/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Heart, Package, Settings, CreditCard, 
  Trash2, ShoppingCart, Check, ShieldCheck, Mail, Phone, MapPin 
} from 'lucide-react';
import { Product } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'info' | 'orders'>('wishlist');

  // Load user data or provide defaults
  const [userName, setUserName] = useState('Cliente Hiki Shop');
  const [userEmail, setUserEmail] = useState('cliente@hikishop.com.br');
  const [userPhone, setUserPhone] = useState('(11) 98765-4321');
  const [userAddress, setUserAddress] = useState('Av. Paulista, 1000 - São Paulo, SP');
  const [paymentPreference, setPaymentPreference] = useState<'pix' | 'card'>('pix');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem('user_name') || 'Cliente Hiki Shop';
      const savedEmail = localStorage.getItem('user_email') || 'cliente@hikishop.com.br';
      const savedPhone = localStorage.getItem('user_phone') || '(11) 98765-4321';
      const savedAddress = localStorage.getItem('user_address') || 'Av. Paulista, 1000 - São Paulo, SP';
      const savedPref = localStorage.getItem('user_payment_pref') as 'pix' | 'card' || 'pix';
      const savedOrders = localStorage.getItem('user_orders');

      setUserName(savedName);
      setUserEmail(savedEmail);
      setUserPhone(savedPhone);
      setUserAddress(savedAddress);
      setPaymentPreference(savedPref);

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Mock a couple of previous successful purchases for nice visual fill
        const initialMockOrders = [
          {
            id: 'ORD-9841',
            date: '25/05/2026',
            items: ['Ring Light LED de Mesa Portátil'],
            amount: 79.90,
            status: 'Entregue',
            paymentMethod: 'PIX'
          }
        ];
        setOrders(initialMockOrders);
        localStorage.setItem('user_orders', JSON.stringify(initialMockOrders));
      }
    }
  }, [isOpen]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_email', userEmail);
    localStorage.setItem('user_phone', userPhone);
    localStorage.setItem('user_address', userAddress);
    localStorage.setItem('user_payment_pref', paymentPreference);

    // Dynamic toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-[120] bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 border border-emerald-550';
    toast.innerHTML = `<span>✓</span> Perfil atualizado com sucesso!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-slate-100"
          id="user-profile-modal-container"
        >
          {/* Sidebar Area: User Info Summary */}
          <div className="md:w-1/3 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between border-r border-slate-800">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-md border-2 border-white/20 select-none">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight font-sans line-clamp-1 truncate uppercase">{userName}</h2>
                  <p className="text-[10.5px] text-orange-400 font-extrabold uppercase tracking-widest">{paymentPreference === 'pix' ? 'Prefere PIX ⚡' : 'Prefere Cartão 💳'}</p>
                </div>
              </div>

              {/* Navigation Menu Tabs */}
              <div className="space-y-1.5 pt-4">
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left ${
                    activeTab === 'wishlist'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'fill-current' : ''}`} />
                  <span>Wishlist ({wishlist.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left ${
                    activeTab === 'info'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Meus Dados</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-left ${
                    activeTab === 'orders'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Meus Pedidos ({orders.length})</span>
                </button>
              </div>
            </div>

            {/* Quick trust badge */}
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-1 mt-6">
              <span className="text-[9px] uppercase font-black text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Segurança Hiki Shop
              </span>
              <p className="text-[10px] text-slate-400 leading-snug font-medium">Os seus dados de pagamento e favoritos ficam salvos no seu navegador para total privacidade.</p>
            </div>
          </div>

          {/* Main Working Area */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]" id="user-profile-main-area">
            <div>
              {/* Header inside modal */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Ambiente do Cliente</span>
                  <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                    {activeTab === 'wishlist' && 'Minha Lista de Desejos'}
                    {activeTab === 'info' && 'Minhas Informações Pessoais'}
                    {activeTab === 'orders' && 'Histórico de Compras'}
                  </h1>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                  id="close-profile-modal-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* View TAB: Wishlist */}
              {activeTab === 'wishlist' && (
                <div className="space-y-4">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 space-y-4 max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mx-auto">
                        <Heart className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xs font-black uppercase text-slate-800">Sua lista está vazia</h3>
                        <p className="text-xs text-slate-400 leading-normal font-medium">Navegue na Hiki Shop, clique no ícone de coração nos produtos e salve suas melhores ofertas aqui!</p>
                      </div>
                      <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm shadow-orange-600/10"
                      >
                        Descobrir Ofertas
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                      {wishlist.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex gap-3 bg-slate-50 border border-slate-150 rounded-2xl p-3 hover:border-orange-500 transition-all group relative"
                        >
                          {/* Image Box */}
                          <div className="w-20 h-20 bg-white border border-slate-150 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={prod.image}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="text-[11.5px] font-black text-slate-900 leading-tight uppercase line-clamp-2 truncate">
                                {prod.title}
                              </h4>
                              <p className="text-xs font-extrabold text-orange-600 mt-1">
                                R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 mt-2">
                              {/* Add to Cart */}
                              <button
                                onClick={() => onAddToCart(prod)}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-orange-50 hover:border-orange-200 text-slate-700 hover:text-orange-600 text-[9.5px] font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                + Cart
                              </button>

                              {/* Aproveitar */}
                              <button
                                onClick={() => onBuyNow(prod)}
                                className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[9.5px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center gap-1"
                              >
                                Comprar
                              </button>
                            </div>
                          </div>

                          {/* Delete Item bubble */}
                          <button
                            onClick={() => onToggleWishlist(prod)}
                            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
                            title="Remover dos favoritos"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View TAB: Meus Dados / Info */}
              {activeTab === 'info' && (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-orange-500" /> Seu Nome
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-orange-500" /> Seu E-mail
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-orange-500" /> Celular / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-orange-500" /> Método de Pagamento Preferido
                      </label>
                      <select
                        value={paymentPreference}
                        onChange={(e) => setPaymentPreference(e.target.value as 'pix' | 'card')}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 font-bold cursor-pointer"
                      >
                        <option value="pix">PIX Inteligente ⚡</option>
                        <option value="card">Cartão de Crédito (via Stripe) 💳</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" /> Endereço de Entrega Completo
                    </label>
                    <textarea
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800 font-bold h-16 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-950 hover:bg-orange-600 text-white font-black text-[10.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                </form>
              )}

              {/* View TAB: Meus Pedidos */}
              {activeTab === 'orders' && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {orders.length === 0 ? (
                    <p className="text-xs text-center text-gray-400 py-10 font-medium">Você ainda não realizou compras através do checkout interno.</p>
                  ) : (
                    orders.map((ord: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] uppercase font-black bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-sm">
                              {ord.id || `ORD-${Math.floor(Math.random() * 10000)}`}
                            </span>
                            <span className="text-[10.5px] text-gray-400 font-bold">{ord.date}</span>
                          </div>
                          
                          <h4 className="text-xs font-black text-slate-900 line-clamp-2 uppercase">
                            {Array.isArray(ord.items) ? ord.items.join(', ') : ord.items}
                          </h4>
                          
                          <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                            Pagamento: <span className="text-slate-800 fill-orange-500">{ord.paymentMethod || 'Cartão/Stripe'}</span>
                          </p>
                        </div>

                        <div className="text-right flex md:flex-col justify-between items-baseline md:items-end border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-150">
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            ✓ {ord.status || 'Processado'}
                          </span>
                          <span className="text-sm font-black text-slate-950 mt-1">
                            R$ {parseFloat(ord.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hiki Shop Perfil do Cliente &copy; 2026</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
