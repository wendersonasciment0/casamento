import React from 'react';
import { MapPin, Map, Calendar, Clock, Navigation } from 'lucide-react';

interface LocalProps {
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueMapUrl: string;
  weddingDate: string;
  weddingTime: string;
}

export default function Local({
  venueName,
  venueAddress,
  venueCity,
  venueMapUrl,
  weddingDate,
  weddingTime
}: LocalProps) {
  
  // Format wedding date: e.g. "Sábado, 14 de Novembro de 2026"
  const getLongDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const timelineEvents = [
    {
      time: weddingTime,
      title: 'A Cerimônia',
      desc: 'Troca de votos e benção solene na capela aberta integrada ao bosque.'
    },
    {
      time: '17:45',
      title: 'Fotos & Coquetel de Boas-Vindas',
      desc: 'Canapés e drinks refrescantes ao pôr do sol na alameda principal.'
    },
    {
      time: '19:30',
      title: 'Recepção & Jantar',
      desc: 'Banquete gastronômico e discursos dos padrinhos e familiares no salão nobre.'
    },
    {
      time: '21:30',
      title: 'Abertura da Pista & Festa',
      desc: 'Música ao vivo, bar de coquetéis artesanais e muita alegria até o amanhecer!'
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#F5EFEB]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="label-text text-xs text-olive font-semibold tracking-widest block mb-2">ONDE E QUANDO</span>
          <h2 className="font-serif text-charcoal text-4xl sm:text-5xl font-medium tracking-tight">O Grande Dia</h2>
          <div className="elegant-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Venue Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white p-8 rounded-sm shadow-md border border-olive/10">
            <div className="space-y-6">
              <span className="label-text text-xs text-terracotta tracking-widest font-bold">O ESPAÇO</span>
              <h3 className="font-serif text-3xl text-charcoal font-medium leading-tight">
                {venueName}
              </h3>
              
              <p className="font-sans text-charcoal/70 text-sm leading-relaxed font-light">
                O local foi escolhido com muito amor para oferecer aconchego e uma imersão na natureza aos nossos convidados mais queridos. Um refúgio perfeito onde celebraremos a vida e o amor.
              </p>

              <div className="border-t border-olive/10 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-terracotta shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs uppercase font-label tracking-widest text-olive/80 font-semibold">Endereço</p>
                    <p className="text-sm font-sans text-charcoal/80 font-light mt-0.5">{venueAddress}</p>
                    <p className="text-sm font-sans text-charcoal/80 font-medium">{venueCity}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-terracotta shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs uppercase font-label tracking-widest text-olive/80 font-semibold">Data</p>
                    <p className="text-sm font-sans text-charcoal/80 font-medium mt-0.5 capitalize">{getLongDate(weddingDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-terracotta shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs uppercase font-label tracking-widest text-olive/80 font-semibold">Horário</p>
                    <p className="text-sm font-sans text-charcoal/80 font-medium mt-0.5">{weddingTime}h (Recomendamos chegar com 15 minutos de antecedência)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-6">
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-olive hover:bg-olive/90 text-white font-label tracking-widest text-xs uppercase font-semibold py-3.5 px-6 rounded-sm transition-all"
              >
                <Navigation size={14} />
                <span>Como Chegar (Google Maps)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Venue Map Image / Custom Map Container */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative rounded-sm overflow-hidden border border-olive/10 shadow-md h-80 lg:h-96 bg-white flex flex-col justify-center items-center group">
              {/* Map Screenshot placeholder of static elegant map vector */}
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                alt="Mapa Local"
                className="absolute inset-0 w-full h-full object-cover filter brightness-75 select-none"
              />
              <div className="absolute inset-0 bg-charcoal/20 backdrop-blur-[1px] transition-all group-hover:backdrop-blur-none" />
              
              {/* Center Map pin effect */}
              <div className="relative z-10 flex flex-col items-center bg-white/95 backdrop-blur-md p-6 rounded-sm border border-olive/20 shadow-xl max-w-sm text-center mx-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta mb-3">
                  <MapPin size={24} className="animate-pulse" />
                </div>
                <h4 className="font-serif font-semibold text-lg text-charcoal mb-1">{venueName}</h4>
                <p className="text-xs font-sans text-charcoal/60 mb-3">{venueAddress}, {venueCity}</p>
                <a
                  href={venueMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase font-label tracking-wider font-bold text-terracotta hover:text-terracotta-hover flex items-center gap-1"
                >
                  <Map size={12} /> Abrir rota de navegação
                </a>
              </div>
            </div>

            {/* Timeline Row below */}
            <div className="bg-white p-6 rounded-sm border border-olive/10 shadow-sm">
              <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold mb-6">Programação do Dia</h4>
              <div className="relative border-l border-olive/10 ml-4 pl-6 space-y-6">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet marker */}
                    <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-terracotta rounded-full border-2 border-white" />
                    <div>
                      <span className="font-serif text-sm font-semibold text-terracotta">{evt.time}</span>
                      <h5 className="font-sans font-medium text-charcoal text-sm mt-0.5">{evt.title}</h5>
                      <p className="font-sans text-xs text-charcoal/65 font-light mt-0.5">{evt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
