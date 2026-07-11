import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronDown } from 'lucide-react';

interface HeroProps {
  noivaName: string;
  noivoName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueCity: string;
  onNavigateToRSVP: () => void;
}

export default function Hero({
  noivaName,
  noivoName,
  weddingDate,
  weddingTime,
  venueName,
  venueCity,
  onNavigateToRSVP
}: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(weddingDate + 'T' + weddingTime) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate, weddingTime]);

  // Format date elegantly: e.g. "14 de Novembro de 2026"
  const formatDateString = (dateStr: string) => {
    try {
      const dateParts = dateStr.split('-');
      if (dateParts.length !== 3) return dateStr;
      const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
      return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image with Dark Romantic Filter */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-charcoal/45 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center pt-12 pb-6">
        <span className="label-text text-white/90 text-xs sm:text-sm tracking-[0.25em] mb-4 block animate-fade-in font-medium">
          JUNTE-SE A NÓS PARA CELEBRAR
        </span>

        <h1 className="font-serif text-white text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 leading-tight drop-shadow-lg">
          {noivaName} <span className="text-white/80 font-normal italic">&</span> {noivoName}
        </h1>

        <div className="w-12 h-[1px] bg-white/40 my-4" />

        <p className="font-serif italic text-white/90 text-lg sm:text-2xl max-w-xl mx-auto mb-8 font-light leading-relaxed">
          Um fim de semana de amor, risadas e cumplicidade em meio à natureza.
        </p>

        {/* Action Button */}
        <button
          onClick={onNavigateToRSVP}
          className="bg-white text-charcoal hover:bg-terracotta hover:text-white transition-all duration-300 font-label tracking-widest text-xs uppercase font-bold py-3 px-8 rounded-sm shadow-md hover:scale-105 active:scale-95"
        >
          Confirmar Presença
        </button>

        {/* Info Grid Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-16 bg-white/10 backdrop-blur-md p-6 rounded-md border border-white/20 shadow-xl text-white">
          <div className="flex flex-col items-center justify-center p-3 text-center border-b md:border-b-0 md:border-r border-white/10">
            <Calendar className="text-white/80 mb-2" size={24} />
            <span className="text-[10px] uppercase font-label tracking-widest text-white/60 mb-1">A Data</span>
            <span className="font-serif font-medium text-base">{formatDateString(weddingDate)}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 text-center border-b md:border-b-0 md:border-r border-white/10">
            <Clock className="text-white/80 mb-2" size={24} />
            <span className="text-[10px] uppercase font-label tracking-widest text-white/60 mb-1">Horário</span>
            <span className="font-serif font-medium text-base">{weddingTime}h</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 text-center">
            <MapPin className="text-white/80 mb-2" size={24} />
            <span className="text-[10px] uppercase font-label tracking-widest text-white/60 mb-1">O Local</span>
            <span className="font-serif font-medium text-base">{venueName}</span>
            <span className="text-xs text-white/80">{venueCity}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mt-12 text-white">
          <p className="label-text text-[10px] tracking-[0.2em] mb-4 text-white/70">CONTAGEM REGRESSIVA</p>
          <div className="flex space-x-4 sm:space-x-8">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
              { label: 'Segundos', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="font-serif text-3xl sm:text-5xl font-semibold bg-black/35 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-sm border border-white/10">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-label uppercase tracking-widest mt-2 text-white/80">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce cursor-pointer">
        <ChevronDown size={28} />
      </div>
    </div>
  );
}
