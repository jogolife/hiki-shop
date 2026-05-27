/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Loader2, AlertCircle, Calendar, Check, Info } from 'lucide-react';
import { Product } from '../types';

interface FreightOption {
  id: string;
  carrier: string;
  service: string;
  price: number;
  days: number;
  icon: string;
  color: string;
}

interface ShippingCalculatorProps {
  product?: Product | null;
  isCart?: boolean;
  cartTotal?: number;
  onSelectShipping?: (option: FreightOption) => void;
  selectedOptionId?: string;
}

export default function ShippingCalculator({
  product,
  isCart = false,
  cartTotal = 0,
  onSelectShipping,
  selectedOptionId
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressInfo, setAddressInfo] = useState<{ city: string; state: string } | null>(null);
  const [results, setResults] = useState<FreightOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<FreightOption | null>(null);

  // Core API Freight Calculation wrapper
  const fetchFreightRates = async (targetCep: string) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    const cleanCep = targetCep.replace(/\D/g, '');

    try {
      const response = await fetch('/api/frete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to_cep: cleanCep,
          products: product ? [
            {
              id: product.id,
              width: 15,
              height: 10,
              length: 20,
              weight: 0.5,
              price: product.price,
              quantity: 1
            }
          ] : [
            {
              id: "cart",
              width: 15,
              height: 10,
              length: 20,
              weight: 0.8,
              price: cartTotal,
              quantity: 1
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao calcular frete no servidor de envio.');
      }

      const data = await response.json();
      
      if (data.address) {
        setAddressInfo({ city: data.address.city, state: data.address.state });
        localStorage.setItem('vitrine_user_address', JSON.stringify(data.address));
      } else if (data.options?.length > 0) {
        setAddressInfo({ city: 'Destino', state: 'Calculado' });
      }

      // Check for free shipping eligibility threshold
      const threshold = 199.00;
      const isEligibleFreeShipping = isCart ? (cartTotal >= threshold) : (product && product.price >= threshold);

      let finalOptions = data.options || [];
      if (isEligibleFreeShipping && finalOptions.length > 0) {
        finalOptions = finalOptions.map((opt: any) => {
          if (opt.service === 'PAC' || opt.service === 'Package') {
            return { ...opt, price: 0 }; // Free Shipping on PAC/Package
          }
          return opt;
        });
      }

      setResults(finalOptions);
      localStorage.setItem('vitrine_user_cep', cep || targetCep);

      if (onSelectShipping && finalOptions.length > 0) {
        const activeId = selectedOptionId || finalOptions[0].id;
        const found = finalOptions.find((o: any) => o.id === activeId) || finalOptions[0];
        setSelectedOption(found);
        onSelectShipping(found);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao obter dados de entrega. Verifique o CEP ou tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved CEP and potential previous calculation
  useEffect(() => {
    const savedCep = localStorage.getItem('vitrine_user_cep');
    if (savedCep) {
      setCep(savedCep);
      // Retrieve previous calculated address if any
      const savedAddress = localStorage.getItem('vitrine_user_address');
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress);
          setAddressInfo(parsedAddress);
          fetchFreightRates(savedCep);
        } catch (e) {
          // ignore
        }
      }
    }
  }, [product, isCart, cartTotal]);

  // Handle Input Mask for CEP (99999-999)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Keep only numbers
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    // Apply XXXXX-XXX mask
    if (value.length > 5) {
      value = `${value.substring(0, 5)}-${value.substring(5)}`;
    }
    
    setCep(value);
    setError(null);
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setError('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }

    await fetchFreightRates(cleanCep);
  };

  const handleSelectOptionLocal = (option: FreightOption) => {
    setSelectedOption(option);
    if (onSelectShipping) {
      onSelectShipping(option);
    }
  };


  return (
    <div className="bg-slate-50/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4" id={`shipping-calculator-${isCart ? 'cart' : 'product'}`}>
      
      {/* Title block */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-500" />
          Melhor Envio — Cálculo de Frete
        </h4>
      </div>

      {/* Input query form */}
      <form onSubmit={handleCalculateShipping} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={cep}
            onChange={handleCepChange}
            placeholder="00000-000"
            className="w-full text-xs p-3 pl-9 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono font-bold tracking-wider placeholder:text-slate-350"
            maxLength={9}
            id="cep-calculator-input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 bg-slate-900 hover:bg-orange-600 text-white font-extrabold uppercase text-[11px] tracking-wider rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          id="calculate-shipping-btn"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular Frete'
          )}
        </button>
      </form>

      {/* Error layout */}
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 font-semibold" id="shipping-error-block">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-center" id="shipping-loading-spinner-block">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Obtendo tarifas reais Melhor Envio...</span>
        </div>
      )}

      {/* Results output */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-2.5" id="shipping-results-container">
          
          {/* Resolved address banner */}
          {addressInfo && (
            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase bg-white border border-slate-100 p-2 rounded-lg">
              <span className="text-orange-500">📍</span>
              Entrega para: <strong className="text-slate-800">{addressInfo.city} - {addressInfo.state}</strong>
            </p>
          )}

          {/* Table display */}
          <div className="space-y-1.5">
            {results.map((opt) => {
              const isSelected = selectedOption?.id === opt.id || selectedOptionId === opt.id;
              
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOptionLocal(opt)}
                  className={`border rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  id={`shipping-option-${opt.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{opt.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{opt.carrier}</span>
                        <span className="text-[9.5px] font-heavy text-slate-500 bg-slate-100 px-1 py-0.5 rounded-sm uppercase tracking-wide">{opt.service}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Prazo estimado: {opt.days} {opt.days === 1 ? 'dia útil' : 'dias úteis'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      {opt.price === 0 ? (
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-wider">Gratis</span>
                      ) : (
                        <span className="text-xs font-black text-slate-900">
                          R$ {opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-1 pb-1">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[9px] text-slate-400 font-semibold leading-normal">
              Preços e prazos reais calculados através dos gateways de integração Melhor Envio. O CEP permanece salvo na sua sessão para facilitar novas compras!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
