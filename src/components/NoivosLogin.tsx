import React, { useState } from 'react';
import { Lock, Check, AlertCircle } from 'lucide-react';

interface NoivosLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (pin: string) => void;
}

export default function NoivosLogin({
  isOpen,
  onClose,
  onLoginSuccess
}: NoivosLoginProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/wedding-info/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('adminPin', pin);
        onLoginSuccess(pin);
        onClose();
        setPin('');
      } else {
        setError(data.message || 'Código PIN inválido!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-sm w-full border border-olive/20 overflow-hidden text-charcoal">
        
        {/* Banner header decor */}
        <div className="bg-[#F5EFEB] py-6 px-4 text-center border-b border-olive/10 relative">
          <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta mx-auto mb-2">
            <Lock size={22} />
          </div>
          <h3 className="font-serif text-lg font-medium text-charcoal">Acesso dos Noivos</h3>
          <p className="text-[10px] font-label text-olive uppercase tracking-widest mt-1 font-bold">Painel de Controle e Finanças</p>
          
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal font-semibold text-base"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2 font-sans animate-shake">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-label uppercase tracking-widest text-charcoal/70 mb-2 font-bold text-center">
              Código PIN de Acesso dos Noivos
            </label>
            <input
              type="password"
              required
              maxLength={12}
              placeholder="Digite o código (Padrão: 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-[#fbfbfa] border border-olive/20 rounded-sm py-3 px-4 text-center text-base font-mono tracking-widest text-charcoal focus:outline-none focus:border-terracotta"
            />
          </div>

          <p className="text-[10px] text-center text-charcoal/50 leading-normal font-sans">
            Apenas Letielly e Wenderson têm acesso a este painel privado, que contém o consolidado financeiro e a lista de convidados confirmados.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta hover:bg-terracotta-hover text-white font-label tracking-widest text-xs uppercase font-bold py-3.5 px-6 rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Validando PIN...</span>
              </>
            ) : (
              <span>Entrar no Painel</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
