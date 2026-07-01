/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PORTFOLIO_OWNER } from './types';
import Masthead from './components/Masthead';
import Toolbox from './components/Toolbox';
import ProjectLedger from './components/ProjectLedger';
import ChronicleTimeline from './components/ChronicleTimeline';
import CorrespondenceDesk from './components/CorrespondenceDesk';
import { 
  Github, 
  Linkedin, 
  FileText, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  CheckCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import { motion } from 'motion/react';

// Exact generated image path from image-generation tool
const workspaceImage = "/src/assets/images/craftsman_workspace_1782882150107.jpg";

export default function App() {
  const today = new Date("2026-06-30T21:58:43-07:00");
  const [isPlayingClacks, setIsPlayingClacks] = useState(false);
  const [activeChapter, setActiveChapter] = useState('frontpage');

  // Simple vintage typewriter click sound simulation (synthesized locally using Web Audio API!)
  const playTypewriterClick = () => {
    if (!isPlayingClacks) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Keystroke sound (clicky click)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio context block protection
    }
  };

  // Keyboard clack trigger handler
  const handleKeyboardClack = () => {
    playTypewriterClick();
  };

  // Safe scroll helper to jump smoothly to section chapters
  const scrollToChapter = (id: string) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className="min-h-screen bg-paper text-ink selection:bg-vintage-red selection:text-paper font-serif-body border-[12px] md:border-[16px] border-ink p-4 sm:p-6 md:p-8"
      onKeyDown={handleKeyboardClack}
    >
      <div className="max-w-7xl mx-auto py-2" id="frontpage">
        
        {/* Navigation / Chapter Indicator Line */}
        <div className="w-full flex justify-between items-center border-b border-ink pb-3 mb-6 text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-ink">
          <div className="flex gap-4 overflow-x-auto py-1 scrollbar-none">
            <button 
              onClick={() => scrollToChapter('frontpage')}
              className={`hover:text-vintage-red cursor-pointer transition-all ${activeChapter === 'frontpage' ? 'border-b border-ink text-vintage-red pb-0.5' : ''}`}
            >
              I. Frontpage
            </button>
            <span className="opacity-30">/</span>
            <button 
              onClick={() => scrollToChapter('project-ledger')}
              className={`hover:text-vintage-red cursor-pointer transition-all ${activeChapter === 'project-ledger' ? 'border-b border-ink text-vintage-red pb-0.5' : ''}`}
            >
              II. Ledger of Works
            </button>
            <span className="opacity-30">/</span>
            <button 
              onClick={() => scrollToChapter('toolbox')}
              className={`hover:text-vintage-red cursor-pointer transition-all ${activeChapter === 'toolbox' ? 'border-b border-ink text-vintage-red pb-0.5' : ''}`}
            >
              III. Gauge Cabinet
            </button>
            <span className="opacity-30">/</span>
            <button 
              onClick={() => scrollToChapter('chronicle-timeline')}
              className={`hover:text-vintage-red cursor-pointer transition-all ${activeChapter === 'chronicle-timeline' ? 'border-b border-ink text-vintage-red pb-0.5' : ''}`}
            >
              IV. Chronicle
            </button>
            <span className="opacity-30">/</span>
            <button 
              onClick={() => scrollToChapter('correspondence-desk')}
              className={`hover:text-vintage-red cursor-pointer transition-all ${activeChapter === 'correspondence-desk' ? 'border-b border-ink text-vintage-red pb-0.5' : ''}`}
            >
              V. Correspondence
            </button>
          </div>

          {/* Mechanical Sound Switcher */}
          <button
            onClick={() => {
              setIsPlayingClacks(!isPlayingClacks);
              // Trigger a test click if turning on
              if (!isPlayingClacks) {
                setTimeout(() => {
                  try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1000, ctx.currentTime);
                    g.gain.setValueAtTime(0.05, ctx.currentTime);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                    osc.connect(g);
                    g.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.06);
                  } catch(e){}
                }, 50);
              }
            }}
            className="flex items-center gap-1.5 hover:text-vintage-red cursor-pointer focus:outline-none shrink-0 pl-4 font-bold"
            title="Toggle authentic mechanical typewriter sound on keys click"
          >
            {isPlayingClacks ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-vintage-red animate-pulse" />
                <span className="hidden sm:inline">Sound: Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline opacity-60">Sound: Off</span>
              </>
            )}
          </button>
        </div>

        {/* Masthead component */}
        <Masthead onCorrespondenceClick={() => scrollToChapter('correspondence-desk')} />

        {/* FRONT PAGE NEWS GRID - Classic Broadsheet Editorial columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Main Cover Story Article (8 cols) */}
          <article className="lg:col-span-8 flex flex-col gap-5 border-r border-ink/10 lg:pr-8">
            
            <div className="border-b border-ink/20 pb-3">
              <span className="font-mono text-[10px] text-vintage-red uppercase font-bold tracking-wider">
                ★ FEATURED ESSAY • VOL. XXIV No. 128
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mt-1.5 leading-tight select-none">
                Craftsmanship in the Digital Era: Blending Relational Foundations with Fluid Storefronts.
              </h2>
            </div>

            {/* Generated illustration - Vintage woodcut wood frame wrapper */}
            <div className="w-full flex flex-col items-center border border-ink/20 p-2.5 bg-paper-dark/30 rounded-sm shadow-sm my-1">
              <div className="relative border-4 border-double border-vintage-gold/50 rounded-sm overflow-hidden w-full max-h-[380px] aspect-video">
                <img 
                  src={workspaceImage} 
                  alt="Abhishek Makwana's Digital Craftsman desk illustration in classic 1800s newspaper woodcut style" 
                  className="w-full h-full object-cover grayscale brightness-95 contrast-105"
                  referrerPolicy="no-referrer"
                />
                {/* Visual filter overlay mimicking old textured print */}
                <div className="absolute inset-0 bg-amber-950/5 mix-blend-multiply pointer-events-none"></div>
              </div>
              <p className="text-center text-xs font-serif-body text-ink-muted mt-2 italic px-4 leading-normal">
                Figure I. <strong className="text-ink font-semibold">The Devised Bureau</strong> — An ink-sketch representing Abhishek's workplace: leather books, oil lamps, relational ledgers, and standard digital terminals synchronized.
              </p>
            </div>

            {/* Editorial Content Columns (Traditional Print Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed text-ink/90 font-serif-body">
              <div className="space-y-4">
                <p className="dropcap">
                  In an epoch saturated with ephemeral digital scaffolding and rapid code-scaffolding compilers, the true beauty of full-stack system layout has shifted. Rather than assembly-line deployments, engineering must return to its meticulous, architectural foundations. It is here that Abhishek Makwana has built his guild practice.
                </p>
                <p>
                  As an artisan operating at the intersection of robust backend ledgers and responsive front-end viewports, his trade focuses on complete systemic balance. In his philosophies, a database schema layout is not just a collection of columns, but a double-entry ledger that must represent perfect architectural truth.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Using the robust architecture of <strong className="text-vintage-teal font-semibold">Laravel and modern PHP 8.x</strong>, he builds secure database matrices capable of sub-millisecond query cycles. These core logical engines are balanced by highly responsive, modular consumer portals built with <strong className="text-vintage-teal font-semibold">React and Vue 3</strong>.
                </p>
                <p>
                  "We build software to endure," Makwana notes. "Every controller, every hook, and every relational constraint we forge is designed to stand firmly against structural decay, ensuring that businesses can scale with absolute technical assurance."
                </p>
                {/* Ornaments */}
                <div className="flex justify-center py-2 text-vintage-gold">
                  <span>❦ ❦ ❦</span>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar / Profile Desk (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* The Master Craftsman Portrait Summary Card */}
            <div className="border-4 border-double border-ink p-5 bg-paper rounded-sm shadow-sm relative">
              {/* Wax Stamp */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-dashed border-vintage-red flex items-center justify-center text-vintage-red font-serif-display font-bold text-xs select-none rotate-12">
                AHM
              </div>

              <span className="font-mono text-[9px] text-vintage-gold uppercase tracking-wider block font-bold mb-1">
                The Master Craftsman
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-ink leading-none mb-1.5">
                {PORTFOLIO_OWNER.name}
              </h3>
              <p className="font-serif-display text-sm italic text-vintage-teal font-semibold mb-4 border-b border-ink/10 pb-2">
                {PORTFOLIO_OWNER.title}
              </p>

              <div className="space-y-3.5 text-xs text-ink-muted leading-relaxed">
                <p>
                  Located in the bustling software quarters of <strong className="text-ink">{PORTFOLIO_OWNER.contact.location}</strong>.
                </p>
                <p>
                  A seasoned full-stack engineer specialized in creating transactional Laravel engines, pristine PHP services, modular React interfaces, and fast Vue applications.
                </p>

                {/* Physical-style Contact Card details */}
                <div className="border border-dashed border-vintage-gold/50 p-3 bg-paper-dark/30 rounded-sm space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-ink-muted">
                    <span>DISPATCH POST:</span>
                    <span className="text-ink lowercase text-right">{PORTFOLIO_OWNER.contact.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-ink-muted">
                    <span>SEALED CREDENTIALS:</span>
                    <span className="text-vintage-red font-bold">VERIFIED 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-ink-muted">
                    <span>HOURLY CHARTER:</span>
                    <span className="text-vintage-teal">COMMISSIONS OPEN</span>
                  </div>
                </div>
              </div>

              {/* External Links Links */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                <a
                  href={PORTFOLIO_OWNER.contact.ghLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-2 border border-ink/15 hover:border-ink hover:bg-paper-dark rounded text-[10px] font-mono uppercase font-bold text-center text-ink-muted hover:text-ink flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Github className="w-3 h-3 text-ink-muted" />
                  Github
                </a>
                <a
                  href={PORTFOLIO_OWNER.contact.linkedinLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-2 border border-ink/15 hover:border-ink hover:bg-paper-dark rounded text-[10px] font-mono uppercase font-bold text-center text-ink-muted hover:text-ink flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Linkedin className="w-3 h-3 text-ink-muted" />
                  LinkedIn
                </a>
                <button
                  onClick={() => scrollToChapter('correspondence-desk')}
                  className="py-1.5 px-2 bg-vintage-red text-paper rounded text-[10px] font-mono uppercase font-bold text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  Contact
                </button>
              </div>
            </div>

            {/* General Editorial Column: The Code Guild Creed */}
            <div className="border border-ink/20 p-4 rounded bg-paper-dark/10">
              <h4 className="font-serif-display text-sm font-bold uppercase text-vintage-teal tracking-wide mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-vintage-gold" />
                The Craftsman's Code Guild
              </h4>
              <p className="font-serif-body text-xs text-ink-muted leading-relaxed italic">
                "I pledge to construct digital frameworks that operate with complete database equilibrium. To avoid bloated dependencies, to document all foreign index paths, to optimize state caches, and to style responsive viewport dimensions using pure, beautiful utility rules."
              </p>
            </div>
            
          </aside>
        </div>

        {/* SECTION: Ledger of Works (Projects) */}
        <section className="mb-12 py-4" id="project-ledger">
          <div className="text-center mb-6">
            <span className="font-mono text-xs text-vintage-gold uppercase font-bold tracking-wider">── CHAPTER II ──</span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-ink mt-1">THE LEDGER OF COMPILED SCHEMAS</h2>
            <div className="w-16 h-[1px] bg-vintage-gold mx-auto mt-2"></div>
          </div>
          <ProjectLedger />
        </section>

        {/* SECTION: Toolbox (Skills) */}
        <section className="mb-12 py-4" id="toolbox">
          <div className="text-center mb-6">
            <span className="font-mono text-xs text-vintage-gold uppercase font-bold tracking-wider">── CHAPTER III ──</span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-ink mt-1">THE INSTRUMENT CALIBRATIONS</h2>
            <div className="w-16 h-[1px] bg-vintage-gold mx-auto mt-2"></div>
          </div>
          <Toolbox />
        </section>

        {/* SECTION: Timeline */}
        <section className="mb-12 py-4" id="chronicle-timeline">
          <div className="text-center mb-6">
            <span className="font-mono text-xs text-vintage-gold uppercase font-bold tracking-wider">── CHAPTER IV ──</span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-ink mt-1">THE HISTORICAL LANDMARKS</h2>
            <div className="w-16 h-[1px] bg-vintage-gold mx-auto mt-2"></div>
          </div>
          <ChronicleTimeline />
        </section>

        {/* SECTION: Correspondence Desk (Contact & Guest Ledger) */}
        <section className="mb-12 py-4" id="correspondence-desk">
          <div className="text-center mb-6">
            <span className="font-mono text-xs text-vintage-gold uppercase font-bold tracking-wider">── CHAPTER V ──</span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-ink mt-1">THE CORRESPONDENCE BUREAU</h2>
            <div className="w-16 h-[1px] bg-vintage-gold mx-auto mt-2"></div>
          </div>
          <CorrespondenceDesk />
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t-4 border-double border-ink/40 pt-6 mt-12 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-ink-muted gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="uppercase font-bold tracking-wide text-ink">
              © {today.getFullYear()} Abhishek Makwana • All Rights Reserved.
            </p>
            <p className="font-serif-body italic">
              Crafted meticulously using React, Vite, Tailwind CSS, and local persistence.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-vintage-teal"></span>
            <span className="uppercase text-[9px] tracking-widest text-vintage-teal">STRICT AUDIT TRACINGS ONLINE</span>
            <span className="h-2 w-2 rounded-full bg-vintage-teal"></span>
          </div>
        </footer>

      </div>
    </div>
  );
}
