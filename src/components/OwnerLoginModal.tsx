/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, X, Eye, EyeOff, Lock, HelpCircle } from 'lucide-react';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function OwnerLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: OwnerLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      // Valid owner security gate
      if (cleanEmail === 'narutofamilyhinata@gmail.com' && password === 'dtvhdmiSTI1!') {
        onLoginSuccess(cleanEmail);
        setEmail('');
        setPassword('');
        setError('');
        setLoading(false);
      } else {
        setError('E-mail ou Senha Administrativa incorretos. Acesso restrito ao proprietário do site.');
        setLoading(false);
      }
    }, 850);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white border border-slate-200 rounded-lg w-full max-w-md overflow-hidden shadow-xl animate-fade-in relative"
        id="owner-login-modal-panel"
      >
        {/* Header decoration banner */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-black uppercase tracking-widest font-mono">Autenticação do Proprietário</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-1"
            title="Fechar"
            id="close-login-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info panel */}
        <div className="bg-orange-50/70 border-b border-orange-100 p-4 text-xs font-bold text-slate-700 leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="uppercase text-orange-600 text-[10px] font-black tracking-wider mb-0.5">Aviso Importante</p>
            O painel de controle administrativo agora é restrito exclusivamente ao e-mail registrado do dono brasileiro deste portal de afiliados. 
            <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-tight">
              E-mail: <span className="font-extrabold text-slate-800 underline">narutofamilyhinata@gmail.com</span><br />
              Senha Privada do Dono: <span className="font-extrabold text-slate-800">dtvhdmiSTI1!</span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs font-bold text-red-600 text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">E-mail Registrado</label>
            <input
              type="email"
              required
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
            />
          </div>

          <div className="space-y-1 relative">
            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">Senha Secreta do Dono</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validando Credenciais...
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Desbloquear Painel Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
