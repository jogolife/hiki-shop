/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { PromoBanner as BannerType } from '../types';

interface PromoBannerProps {
  banners: BannerType[];
  onBannerClick?: (banner: BannerType) => void;
}

export default function PromoBanner({ banners, onBannerClick }: PromoBannerProps) {
  const activeBanners = banners.filter(b => b.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div 
      className="relative w-full h-[220px] sm:h-[340px] md:h-[380px] bg-slate-900 rounded-lg overflow-hidden shadow-sm group cursor-pointer border border-slate-200"
      onClick={() => onBannerClick?.(currentBanner)}
      id="promo-banner-carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Cover image */}
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover brightness-[0.6] group-hover:scale-102 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-slate-950/50 to-transparent pointer-events-none" />

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 flex flex-col items-start gap-2 sm:gap-3 max-w-3xl">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black tracking-widest uppercase text-white bg-orange-600 rounded-sm shadow-sm">
              <Sparkles className="w-3 h-3" />
              Campanha Afiliada Ativa
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-none font-sans uppercase tracking-tight">
              {currentBanner.title}
            </h2>
            {currentBanner.subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-slate-200 font-semibold line-clamp-2 uppercase tracking-wide">
                {currentBanner.subtitle}
              </p>
            )}
            <div className="mt-2 px-5 py-2.5 bg-orange-600 text-white text-[10.5px] font-black uppercase tracking-widest rounded-sm group-hover:bg-orange-700 transition-all shadow-sm">
              Aproveitar Ofertas de Hoje &rarr;
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-orange-600 text-white p-2 rounded-sm cursor-pointer backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-250 z-10"
            aria-label="Anterior"
            id="banner-prev-arrow"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-orange-600 text-white p-2 rounded-sm cursor-pointer backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-250 z-10"
            aria-label="Próximo"
            id="banner-next-arrow"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-sm border border-white/20 transition-all ${
                  idx === currentIndex ? 'bg-orange-500 w-5' : 'bg-white/40'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
                id={`banner-dot-indicator-${idx}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
