import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  noivaName: string;
  noivoName: string;
}

export default function Footer({ noivaName, noivoName }: FooterProps) {
  return (
    <footer className="bg-charcoal text-white py-16 px-4 border-t border-olive/10">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Monogram / Title */}
        <p className="font-serif italic text-3xl text-ivory tracking-wide">
          {noivaName} <span className="text-[#e1d8d2] font-normal">&</span> {noivoName}
        </p>

        <div className="w-12 h-[1px] bg-white/20 mx-auto" />

        <p className="text-xs uppercase font-label tracking-[0.25em] text-white/50">
          SALVE A DATA • 14 DE NOVEMBRO DE 2026
        </p>

        <p className="font-serif italic text-sm text-[#e1d8d2]/70 max-w-sm mx-auto font-light">
          "Assim, já não são dois, mas uma só carne. Portanto, o que Deus uniu, não o separe o homem."
          <span className="block text-[10px] uppercase font-label tracking-widest text-[#e1d8d2]/40 mt-1">Mateus 19:6</span>
        </p>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:justify-between items-center gap-4 text-[10px] text-white/40 uppercase font-label tracking-widest">
          <div>
            © 2026 {noivaName} & {noivoName}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1.5">
            Feito com <Heart size={10} className="fill-terracotta text-terracotta animate-pulse" /> para o dia mais feliz de nossas vidas
          </div>
        </div>

      </div>
    </footer>
  );
}
