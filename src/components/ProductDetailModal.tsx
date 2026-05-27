/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingCart, ExternalLink, Calendar, Plus, MessageSquare } from 'lucide-react';
import { Product, Review } from '../types';
import ShippingCalculator from './ShippingCalculator';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAffiliateRedirect: (product: Product) => void;
  onAddNewReview: (productId: string, review: Review) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAffiliateRedirect,
  onAddNewReview
}: ProductDetailModalProps) {
  if (!product) return null;

  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `new-rev-${Date.now()}`,
      userName: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    onAddNewReview(product.id, newReview);
    setFormSuccess(true);
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);

    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
  const savingAmount = hasOriginalPrice ? (product.originalPrice! - product.price) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="product-detail-modal-root">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          id="product-detail-modal-backdrop"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
          id="product-detail-modal-box"
        >
          {/* Top Sticky Close Banner for Mobile */}
          <div className="flex justify-end p-4 border-b border-gray-100 shrink-0">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
              aria-label="Fechar Modal"
              id="close-detail-modal-btn"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Main Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" id="detail-modal-grid">
              
              {/* Left Column: Premium Image Preview */}
              <div className="flex flex-col gap-4">
                <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    id="zoomable-product-detail-image"
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      Desconto Ativo ✓
                    </span>
                  )}
                </div>
                <div className="bg-orange-50/50 rounded-xl p-3.5 border border-orange-100 text-xs text-orange-850 flex items-start gap-2.5">
                  <span className="text-xl leading-none">💡</span>
                  <p className="font-medium leading-relaxed">
                    <strong>Como funciona?</strong> Clicando em <strong>Aproveite</strong>, você garante as melhores ofertas e promoções selecionadas na loja oficial com o cupom de desconto aplicado automaticamente!
                  </p>
                </div>
              </div>

              {/* Right Column: Descriptions & Live CTAs */}
              <div className="flex flex-col gap-5">
                {/* Category indicator & Rating Header */}
                <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-4">
                  <span className="bg-gray-100 text-gray-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-sm tracking-widest">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-sm font-black text-gray-950">{product.rating}</span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-gray-500 font-medium">({product.reviewsCount} avaliações)</span>
                  </div>
                </div>

                {/* Main Identity */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-950 leading-tight mb-3">
                    {product.title}
                  </h1>
                </div>

                {/* Price Display Block */}
                <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-100/70">
                  <span className="text-xs font-bold text-gray-400 block mb-1">Preço Especial Recomendado</span>
                  
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {hasOriginalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        R$ {product.originalPrice!.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>

                  {savingAmount > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-md">
                      <span>✓ Você economiza: R$ {savingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>

                {/* Full HTML Description */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-gray-400 mb-2">Descrição do Produto</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                {/* Core Buttons panel */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="flex-1 py-3.5 px-5 bg-gray-900 text-white hover:bg-orange-600 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    id="modal-add-to-cart-action-btn"
                  >
                    <ShoppingCart className="w-4.5 h-4.5" />
                    Adicionar ao Carrinho
                  </button>

                  <button
                    onClick={() => onAffiliateRedirect(product)}
                    className="flex-1 py-3.5 px-5 bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 text-white rounded-xl font-black text-sm hover:brightness-105 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    id="modal-buy-now-action-btn"
                  >
                    Aproveitar Oferta
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Integration of Shipping Calculator */}
                <div className="mt-2 text-slate-850">
                  <ShippingCalculator product={product} />
                </div>
              </div>

            </div>

            {/* Bottom Section: Active Reviews & Submission Panel */}
            <div className="mt-14 pt-8 border-t border-gray-100" id="reviews-block">
              <h3 className="text-lg font-black text-gray-950 flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                Avaliações de Clientes ({product.reviews?.length || 0})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left side: Review stats grid */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-gray-50/60 rounded-2xl p-5 border border-gray-100 text-center flex flex-col items-center justify-center">
                    <span className="text-4.5xl font-black text-gray-950 font-sans">{product.rating}</span>
                    <div className="flex items-center text-amber-500 my-1 justify-center">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <Star
                          key={st}
                          className={`w-4 h-4 ${st <= Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 font-medium">Classificação média da vitrine</span>
                  </div>

                  {/* Add simulated Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4 shadow-xs">
                    <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">Deixar uma avaliação</h4>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Seu Nome</label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sua Nota ({reviewRating} Estrelas)</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <button
                            type="button"
                            key={st}
                            onClick={() => setReviewRating(st)}
                            className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-5 h-5 ${st <= reviewRating ? 'fill-current' : 'text-gray-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Comentário</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="O que achou deste produto e do desconto aplicado?"
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 h-20 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-gray-950 text-white hover:bg-orange-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Enviar Avaliação
                    </button>

                    {formSuccess && (
                      <span className="block text-[10px] font-bold text-emerald-600 text-center animate-pulse">
                        ✓ Avaliação enviada com sucesso!
                      </span>
                    )}
                  </form>
                </div>

                {/* Right side: Reviews List */}
                <div className="md:col-span-3 space-y-4">
                  {(!product.reviews || product.reviews.length === 0) ? (
                    <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-xs text-gray-400 font-medium">Ainda não há avaliações neste produto. Seja o primeiro a opinar!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 no-scrollbar">
                      {product.reviews.map((rev) => (
                        <div key={rev.id} className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {rev.date}
                            </span>
                          </div>
                          
                          <div className="flex text-amber-500 mb-2">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <Star
                                key={st}
                                className={`w-3 h-3 ${st <= rev.rating ? 'fill-current' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>

                          <p className="text-xs text-gray-600 font-normal leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
