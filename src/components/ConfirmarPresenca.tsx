import React, { useState } from 'react';
import { Check, Calendar, Users, Utensils, Sparkles, Smile } from 'lucide-react';

interface ConfirmarPresencaProps {
  weddingDate: string;
  weddingTime: string;
  venueName: string;
}

export default function ConfirmarPresenca({
  weddingDate,
  weddingTime,
  venueName
}: ConfirmarPresencaProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [numGuests, setNumGuests] = useState(1);
  const [dietRestrictions, setDietRestrictions] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmed === null) {
      alert('Por favor, selecione se você irá ou não comparecer.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone,
          confirmed,
          numGuests: confirmed ? numGuests : 0,
          message,
          dietRestrictions
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Erro ao registrar confirmação.');
      }
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      alert('Erro de conexão ao enviar confirmação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-[#F5EFEB]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="label-text text-xs text-olive font-semibold tracking-widest block mb-2">RSVP</span>
          <h2 className="font-serif text-charcoal text-4xl sm:text-5xl font-medium tracking-tight">Confirmar Presença</h2>
          <div className="elegant-divider" />
          <p className="font-sans text-charcoal/70 text-sm max-w-lg mx-auto font-light leading-relaxed">
            Sua confirmação é de extrema importância para nos ajudar no planejamento e organização de cada detalhe da nossa festa. Por favor, responda até <span className="font-semibold text-terracotta">30 dias antes do evento</span>.
          </p>
        </div>

        {submitSuccess ? (
          <div className="bg-white p-8 sm:p-12 rounded-sm border border-olive/15 shadow-md text-center space-y-6 max-w-xl mx-auto animate-fade-in">
            <div className="w-16 h-16 bg-olive-light/40 border border-olive/30 rounded-full flex items-center justify-center text-olive mx-auto">
              <Check size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-medium text-olive">
                {confirmed ? 'Presença Confirmada!' : 'Agradecemos o Retorno'}
              </h3>
              <p className="text-sm font-sans text-charcoal/85 leading-relaxed">
                {confirmed ? (
                  <>
                    Olá <span className="font-bold">{name}</span>, ficamos extremamente felizes com sua presença confirmada! Mal podemos esperar para comemorar cada segundo desse grande dia com você.
                  </>
                ) : (
                  <>
                    Olá <span className="font-bold">{name}</span>, agradecemos por nos avisar. Sentiremos sua falta, mas seu carinho e bons desejos continuam aquecendo nossos corações.
                  </>
                )}
              </p>
            </div>

            {confirmed && (
              <div className="bg-[#F5EFEB] p-4 rounded-sm border border-olive/10 text-xs text-charcoal/80 space-y-2 text-left max-w-sm mx-auto">
                <p className="font-serif italic text-sm text-terracotta font-semibold text-center border-b border-olive/5 pb-1">Sua Ficha de Presença</p>
                <p>🙋‍♂️ <span className="font-bold">Acompanhantes:</span> {numGuests} {numGuests === 1 ? 'pessoa' : 'pessoas'} no total</p>
                <p>📍 <span className="font-bold">Local:</span> {venueName}</p>
                <p>🍲 <span className="font-bold">Restrições Alimentares:</span> {dietRestrictions || 'Nenhuma informada'}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setName('');
                  setPhone('');
                  setConfirmed(null);
                  setNumGuests(1);
                  setDietRestrictions('');
                  setMessage('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-terracotta hover:text-terracotta-hover font-bold"
              >
                <Smile size={14} /> Registrar outra confirmação
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-sm border border-olive/10 shadow-md space-y-8 max-w-2xl mx-auto">
            
            {/* 1. Attend status selection */}
            <div className="space-y-4">
              <span className="text-[11px] font-label uppercase tracking-widest text-olive font-bold">Você comparecerá? *</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className={`p-4 rounded-sm border text-left transition-all flex items-center justify-between ${
                    confirmed === true 
                      ? 'border-terracotta bg-terracotta/5 text-terracotta font-bold shadow-sm' 
                      : 'border-olive/15 bg-white text-charcoal/70 hover:border-terracotta'
                  }`}
                >
                  <span className="font-sans text-sm">Sim, irei comparecer! 🎉</span>
                  {confirmed === true && <div className="w-5 h-5 rounded-full bg-terracotta text-white flex items-center justify-center text-xs"><Check size={12} /></div>}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmed(false)}
                  className={`p-4 rounded-sm border text-left transition-all flex items-center justify-between ${
                    confirmed === false 
                      ? 'border-terracotta bg-terracotta/5 text-terracotta font-bold shadow-sm' 
                      : 'border-olive/15 bg-white text-charcoal/70 hover:border-terracotta'
                  }`}
                >
                  <span className="font-sans text-sm">Não poderei comparecer 😔</span>
                  {confirmed === false && <div className="w-5 h-5 rounded-full bg-terracotta text-white flex items-center justify-center text-xs"><Check size={12} /></div>}
                </button>
              </div>
            </div>

            {/* 2. Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-label uppercase tracking-widest text-charcoal/70 mb-2 font-bold">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro Henrique Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-b border-olive/35 focus:border-terracotta py-2 px-1 text-sm text-charcoal focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-label uppercase tracking-widest text-charcoal/70 mb-2 font-bold">Seu Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border-b border-olive/35 focus:border-terracotta py-2 px-1 text-sm text-charcoal focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 3. Conditional fields if confirmed */}
            {confirmed === true && (
              <div className="space-y-6 pt-4 border-t border-olive/10 animate-fade-in">
                
                {/* Number of attendees selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDFBFAF2] p-4 rounded-sm border border-olive/10">
                  <div className="flex items-center gap-2.5">
                    <Users className="text-olive" size={20} />
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-charcoal">Quantidade de Acompanhantes</h4>
                      <p className="text-[10px] text-charcoal/60 font-sans">Incluindo você. Ex: Marido e esposa = 2 pessoas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setNumGuests(prev => Math.max(prev - 1, 1))}
                      className="w-9 h-9 border border-olive/30 hover:border-terracotta rounded-full flex items-center justify-center font-bold text-lg hover:text-terracotta bg-white transition-colors"
                    >
                      -
                    </button>
                    <span className="font-serif text-lg font-bold w-6 text-center">{numGuests}</span>
                    <button
                      type="button"
                      onClick={() => setNumGuests(prev => Math.min(prev + 1, 10))}
                      className="w-9 h-9 border border-olive/30 hover:border-terracotta rounded-full flex items-center justify-center font-bold text-lg hover:text-terracotta bg-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Diet restrictions */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Utensils size={14} className="text-olive" />
                    <label className="block text-[11px] font-label uppercase tracking-widest text-charcoal/70 font-bold">Restrições Alimentares / Observações</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: Vegetariano, alérgico a frutos do mar, intolerante a glúten..."
                    value={dietRestrictions}
                    onChange={(e) => setDietRestrictions(e.target.value)}
                    className="w-full bg-white border-b border-olive/35 focus:border-terracotta py-2 px-1 text-sm text-charcoal focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* 4. Greeting text area */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={14} className="text-olive animate-pulse" />
                <label className="block text-[11px] font-label uppercase tracking-widest text-charcoal/70 font-bold">Mensagem Especial para os Noivos (Opcional)</label>
              </div>
              <textarea
                placeholder="Escreva uma mensagem cheia de carinho aos noivos..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full bg-white border border-olive/20 focus:border-terracotta rounded-sm p-3 text-sm text-charcoal focus:outline-none transition-colors font-sans"
              />
            </div>

            {/* 5. Submit trigger */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-terracotta hover:bg-terracotta-hover disabled:bg-charcoal/30 text-white font-label tracking-widest text-xs uppercase font-bold py-3.5 px-6 rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar Confirmação</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
