import { PORTFOLIO_OWNER } from '../types';
import { Mail, MapPin, Feather } from 'lucide-react';

interface MastheadProps {
  onCorrespondenceClick: () => void;
}

export default function Masthead({ onCorrespondenceClick }: MastheadProps) {
  // Format current date in a traditional editorial manner
  const today = new Date("2026-06-30T21:58:43-07:00");
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full flex flex-col items-center border-b-2 border-ink pb-4 mb-8" id="masthead">
      {/* Newspaper Ears (Utility Rails) in Sans Serif with elegant tracking */}
      <div className="w-full flex justify-between items-center text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-ink border-b border-ink pb-3 mb-5 px-1">
        <div className="flex items-center gap-1 italic">
          <span>EST. 2020 — AHMEDABAD</span>
        </div>
        <div className="hidden md:flex items-center gap-5">
          <span className="flex items-center gap-1.5 opacity-80">
            <MapPin className="w-3 h-3 text-vintage-red shrink-0" />
            {PORTFOLIO_OWNER.contact.location}
          </span>
          <span className="h-3.5 w-[1px] bg-ink"></span>
          <button 
            onClick={onCorrespondenceClick}
            className="flex items-center gap-1 text-vintage-red hover:underline cursor-pointer font-bold tracking-[0.2em]"
          >
            <Mail className="w-3 h-3" />
            Write Post
          </button>
        </div>
        <div className="flex items-center gap-1 font-extrabold text-vintage-teal">
          <span>PRICE: ONE HIRE OFFER</span>
        </div>
      </div>

      {/* Main Newspaper Masthead Title */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center py-6 gap-6">
        {/* Left ear */}
        <div className="hidden lg:flex flex-col text-left text-xs uppercase font-sans tracking-widest text-ink-muted max-w-[200px] leading-relaxed">
          <span className="font-bold text-ink">The Broadside</span>
          <span>A compilation of systems & structures</span>
        </div>

        {/* Central Title */}
        <div className="text-center flex flex-col items-center flex-1">
          {/* Decorative Leaf Ornament */}
          <div className="text-vintage-gold flex items-center justify-center gap-3 mb-3">
            <span className="h-[1px] w-12 bg-vintage-gold/50"></span>
            <Feather className="w-5 h-5 rotate-45" />
            <span className="h-[1px] w-12 bg-vintage-gold/50"></span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter text-ink uppercase select-none leading-none">
            ABHISHEK MAKWANA
          </h1>
          
          <p className="font-serif-display italic text-base sm:text-lg text-vintage-gold mt-2.5 max-w-xl px-4">
            "Software is a craft. Every database schema, Laravel migration, and React viewport should represent pristine digital architecture."
          </p>
        </div>

        {/* Right ear: Alexandre Dubois style Circle Initials Stamp */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-ink flex flex-col items-center justify-center p-1 bg-paper hover:bg-paper-dark transition-all select-none">
            <span className="text-2xl font-bold italic font-serif leading-none">AM</span>
            <span className="text-[7px] font-sans font-bold uppercase tracking-[0.15em] mt-1 text-vintage-red">CRAFTSMAN</span>
          </div>
        </div>
      </div>

      {/* Broadside Information Band matching design layout spacing */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-2 sm:gap-0 border-t-4 border-b-2 border-ink py-2.5 text-xs font-sans uppercase font-bold tracking-[0.2em] text-ink w-full px-2">
        <div>
          <span>EDITION: LARAVEL • PHP • VUE • REACT</span>
        </div>
        <div className="hidden lg:block italic font-serif-body text-ink-muted text-xs tracking-normal normal-case">
          Traditional hand-crafted architecture built on structural integrity.
        </div>
        <div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </header>
  );
}
