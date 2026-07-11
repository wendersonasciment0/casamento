import React from 'react';
import { Heart } from 'lucide-react';

interface NossaHistoriaProps {
  noivaName: string;
  noivoName: string;
  ourStory: string;
  ourStoryImageUrl: string;
}

export default function NossaHistoria({
  noivaName,
  noivoName,
  ourStory,
  ourStoryImageUrl
}: NossaHistoriaProps) {
  return (
    <section className="py-20 px-4 bg-[#FDFBFAF2]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="label-text text-xs text-olive font-semibold tracking-widest block mb-2">UM POUCO DE NÓS</span>
          <h2 className="font-serif text-charcoal text-4xl sm:text-5xl font-medium tracking-tight">Nossa História</h2>
          <div className="elegant-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Couple Photo Container */}
          <div className="md:col-span-6 relative group">
            {/* Elegant physical paper-style border wrap */}
            <div className="absolute -inset-2 border border-olive/10 rounded-sm pointer-events-none translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300" />
            <div className="relative overflow-hidden rounded-sm aspect-4/3 shadow-md bg-white">
              <img
                src={ourStoryImageUrl}
                alt={`${noivaName} & ${noivoName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-sm shadow-sm border border-olive/10">
              <span className="font-serif italic text-sm text-terracotta flex items-center gap-1.5 font-semibold">
                <Heart size={14} className="fill-terracotta" /> Desde o primeiro dia
              </span>
            </div>
          </div>

          {/* Narrative Text */}
          <div className="md:col-span-6 space-y-6">
            <h3 className="font-serif text-2xl text-terracotta font-medium leading-tight">
              O início de um grande sonho...
            </h3>
            
            <div className="w-10 h-0.5 bg-terracotta/20" />
            
            <p className="font-sans text-charcoal/85 text-base leading-relaxed whitespace-pre-line font-light">
              {ourStory}
            </p>
            
            <div className="border-t border-olive/10 pt-6">
              <p className="font-serif italic text-olive text-lg">
                "O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção."
              </p>
              <p className="text-xs font-label text-charcoal/50 uppercase tracking-wider mt-2">
                — Antoine de Saint-Exupéry
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
