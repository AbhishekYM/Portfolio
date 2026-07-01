/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PORTFOLIO_OWNER } from './types';
import Masthead from './components/Masthead';
import Toolbox from './components/Toolbox';
import ProjectLedger from './components/ProjectLedger';
import ChronicleTimeline from './components/ChronicleTimeline';
import CorrespondenceDesk from './components/CorrespondenceDesk';
import AdminSanctum from './components/AdminSanctum';
import { 
  Github, 
  Linkedin, 
  FileText, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bot,
  Zap,
  Cpu,
  RefreshCw,
  Terminal,
  HelpCircle,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Newly generated cute robot desk illustration
const workspaceImage = "/src/assets/images/robot_developer_desk_1782884171549.jpg";

const COMPANION_JOKES = [
  "SCANNING DECK... All systems 100% awesome! 🚀",
  "Laravel fuel is highly combustible! Code compiles at 0ms delay!",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🔗",
  "Why do robots love modern PHP 8? Strong typing makes our gears happy! ⚙️",
  "My companion scanners detect a highly competent recruiter looking at this screen! 👀",
  "I've computed 10 billion outcomes... and Abhishek Makwana is hired in all of them! 🏆",
  "React hooks are cool, but have you tried plugging into our main charging dock? 🔋",
  "Garbage collection in progress... beep boop... memory cleared!",
  "Warning: Excessively clean code detected on our Laravel repository modules! 🔧"
];

export default function App() {
  const today = new Date("2026-06-30T21:58:43-07:00");
  const [isPlayingClacks, setIsPlayingClacks] = useState(false);
  const [activeChapter, setActiveChapter] = useState('frontpage');
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  
  // Interactive Companion Bot State
  const [companionOpen, setCompanionOpen] = useState(true);
  const [companionBubble, setCompanionBubble] = useState("Greetings, carbon unit! Tap me for fun computational comments!");
  const [jokeIndex, setJokeIndex] = useState(0);

  // Dynamic database records
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [chronicle, setChronicle] = useState<any[]>([]);
  const [guestbook, setGuestbook] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    const interval = setInterval(handleLocationChange, 200);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(interval);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentRoute(path);
  };

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setSkills(data.skills || []);
        setChronicle(data.chronicle || []);
        setGuestbook(data.guestbook || []);
      }
    } catch (e) {
      console.log("Using static fallback for portfolio records:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const playSynthNote = (freq: number, type: OscillatorType = 'triangle', duration = 0.1) => {
    if (!isPlayingClacks) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  // Global tactile click sound effect when isPlayingClacks is ON
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!isPlayingClacks) return;
      
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Check if target or parent is an interactive control
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer') ||
        target.getAttribute('role') === 'button' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA';
        
      if (isInteractive) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          // Mechanical typewriter/micro-switch sound signature (short click & high pitch)
          const pitch = 850 + Math.random() * 250;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.05);
        } catch (err) {}
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [isPlayingClacks]);

  const handleKeyboardClack = () => {
    playSynthNote(600 + Math.random() * 300, 'triangle', 0.05);
  };

  const handleCompanionClick = () => {
    playSynthNote(880, 'square', 0.12);
    setTimeout(() => playSynthNote(1320, 'sine', 0.08), 80);
    const nextIdx = (jokeIndex + 1) % COMPANION_JOKES.length;
    setJokeIndex(nextIdx);
    setCompanionBubble(COMPANION_JOKES[nextIdx]);
  };

  const scrollToChapter = (id: string) => {
    setActiveChapter(id);
    playSynthNote(400, 'sine', 0.1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (currentRoute === '/admin' || currentRoute === '/admin/' || currentRoute.startsWith('/admin')) {
    return (
      <div 
        className="min-h-screen bg-paper text-ink selection:bg-vintage-red selection:text-paper font-sans border-[12px] md:border-[16px] border-ink p-4 sm:p-6 md:p-8 flex flex-col justify-between grid-bg"
        onKeyDown={handleKeyboardClack}
      >
        <div className="max-w-7xl mx-auto w-full py-2 space-y-6">
          
          {/* Standing Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-[3px] border-ink p-4 rounded-xl bg-robot-yellow toy-shadow pb-4 mb-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white toy-border rounded-lg flex items-center justify-center animate-spin-gear-ccw">
                <span className="text-xl">🔐</span>
              </div>
              <div>
                <span className="font-mono text-[9px] text-ink font-black uppercase tracking-wider block">── EXCLUSIVE SECURITY LAYER ──</span>
                <h1 className="font-serif-display text-2xl font-black text-ink tracking-tight">THE GUILD ARCHIVE SYSTEM</h1>
              </div>
            </div>
            <button
              onClick={() => {
                playSynthNote(500, 'sine', 0.15);
                navigateTo('/');
              }}
              className="px-4 py-2 bg-white hover:bg-robot-blue text-ink toy-border toy-shadow-sm font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              ← Escape to Portfolio Hub
            </button>
          </div>

          <AdminSanctum 
            projects={projects}
            skills={skills}
            chronicle={chronicle}
            onRefreshData={fetchPortfolioData}
          />
        </div>

        {/* Standalone admin page footer */}
        <footer className="max-w-7xl mx-auto w-full border-t-[3px] border-ink pt-4 mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-ink-muted gap-2 text-center sm:text-left">
          <span>ABHISHEK MAKWANA • SECURITY VAULT</span>
          <span className="text-vintage-red font-bold">● BIO-MATRIX ENCRYPTED ACCESS ONLY</span>
        </footer>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-paper text-ink selection:bg-vintage-teal selection:text-white font-sans border-[12px] md:border-[16px] border-ink p-4 sm:p-6 md:p-8 relative"
      onKeyDown={handleKeyboardClack}
    >
      <div className="max-w-7xl mx-auto py-2" id="frontpage">
        
        {/* Playful Interactive Chapter Navigation Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center border-[3px] border-ink p-2 mb-6 text-[10px] font-mono font-bold uppercase text-ink bg-white rounded-xl toy-shadow gap-3">
          <div className="flex flex-wrap gap-1 w-full md:w-auto justify-center md:justify-start">
            <button 
              onClick={() => scrollToChapter('frontpage')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-black text-[9px] uppercase tracking-wider ${
                activeChapter === 'frontpage' 
                  ? 'bg-robot-yellow toy-border' 
                  : 'hover:bg-paper-dark'
              }`}
            >
              🔋 I. FRONTPAGE
            </button>
            <button 
              onClick={() => scrollToChapter('project-ledger')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-black text-[9px] uppercase tracking-wider ${
                activeChapter === 'project-ledger' 
                  ? 'bg-robot-blue toy-border' 
                  : 'hover:bg-paper-dark'
              }`}
            >
              🎮 II. CODE CARTRIDGES
            </button>
            <button 
              onClick={() => scrollToChapter('toolbox')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-black text-[9px] uppercase tracking-wider ${
                activeChapter === 'toolbox' 
                  ? 'bg-robot-purple toy-border' 
                  : 'hover:bg-paper-dark'
              }`}
            >
              🎛️ III. CALIBRATIONS
            </button>
            <button 
              onClick={() => scrollToChapter('chronicle-timeline')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-black text-[9px] uppercase tracking-wider ${
                activeChapter === 'chronicle-timeline' 
                  ? 'bg-robot-green toy-border' 
                  : 'hover:bg-paper-dark'
              }`}
            >
              📅 IV. LANDMARKS
            </button>
            <button 
              onClick={() => scrollToChapter('correspondence-desk')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-black text-[9px] uppercase tracking-wider ${
                activeChapter === 'correspondence-desk' 
                  ? 'bg-robot-pink toy-border' 
                  : 'hover:bg-paper-dark'
              }`}
            >
              📡 V. SIGNAL DISPATCH
            </button>
          </div>

          {/* Typewriter Audio controller */}
          <button
            onClick={() => {
              const nextState = !isPlayingClacks;
              setIsPlayingClacks(nextState);
              if (nextState) {
                try {
                  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                  const osc = audioCtx.createOscillator();
                  const gain = audioCtx.createGain();
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
                  osc.connect(gain);
                  gain.connect(audioCtx.destination);
                  osc.start();
                  osc.stop(audioCtx.currentTime + 0.1);
                } catch (e) {}
              }
            }}
            className={`px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer border-[2px] border-ink ${
              isPlayingClacks ? 'bg-robot-green' : 'bg-paper-dark'
            }`}
            title="Toggle to enable delightful retro 8-bit synthetic sound clicks on interactive elements!"
          >
            {isPlayingClacks ? '🔈 RETRO SOUNDS: ON' : '🔇 RETRO SOUNDS: MUTED'}
          </button>
        </div>

        {/* Dynamic Masthead component */}
        <Masthead 
          onCorrespondenceClick={() => scrollToChapter('correspondence-desk')} 
          isPlayingClacks={isPlayingClacks}
          setIsPlayingClacks={setIsPlayingClacks}
        />

        {/* PLAYFUL FRONT PAGE STORY LAYOUT (Never Seen Grid Design) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Main Cover Story Article (8 cols) */}
          <article className="lg:col-span-8 flex flex-col gap-5 border-[3px] border-ink rounded-xl bg-white p-5 md:p-6 toy-shadow relative overflow-hidden grid-bg">
            
            <div className="border-b-[3px] border-ink pb-3">
              <span className="font-mono text-[10px] text-vintage-red uppercase font-black tracking-widest flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-vintage-gold animate-bounce" />
                ★ HIGH-VOLTAGE LEAD STORY • SYS VERSION 2026.06.30
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-4xl font-black tracking-tight text-ink mt-2 leading-tight">
                THE CYBERNETIC ARTISAN: HOW ABHISHEK CODES PIXEL-PERFECT MODULAR SYSTEM ARCHITECTURES.
              </h2>
            </div>

            {/* Generated illustration - Beautifully framed */}
            <div className="w-full flex flex-col items-center border-[3px] border-ink p-2.5 bg-paper rounded-xl shadow-inner my-1 relative overflow-hidden">
              <div className="relative border-[3px] border-ink rounded-lg overflow-hidden w-full max-h-[380px] aspect-video bg-white">
                <img 
                  src={workspaceImage} 
                  alt="Abhishek Makwana's robot developer cartoon workspace" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-center font-mono text-[9px] text-ink-muted mt-3 px-4 leading-normal font-bold">
                ⚙️ DIAGRAM 1.0 — <strong className="text-ink font-black">THE DEV STATION COMPILER</strong> — Representation of a modern senior developer robot assembling Laravel matrices, Redis caching pipes, and Vue rendering engines.
              </p>
            </div>

            {/* Editorial Content Columns (Tactile Light Theme) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-ink/90 font-medium font-sans">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="w-10 h-10 rounded-lg bg-robot-yellow toy-border flex items-center justify-center font-mono font-black text-lg shrink-0 select-none shadow-[2px_2px_0px_0px_#111111]">
                    A
                  </span>
                  <p className="leading-relaxed">
                    t the dawn of decentralized, over-engineered frameworks and bulky dependencies, a new breed of developers has returned to logical craftsmanship. Abhishek Makwana operates as a premier full-stack cybernetic engineer, dedicated to constructing streamlined database pipelines and high-contrast, playful interfaces.
                  </p>
                </div>
                <p>
                  Rather than deploying unstable scaffolding, his philosophy is simple: software must be constructed like modular toy blocks—robust, resilient, beautifully aligned, and completely reliable. Each controller, each query hook, and each migration schema is treated as custom-milled cabinetry designed to withstand structural code decay.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Specializing in modern <strong className="text-vintage-red font-black">Laravel and robust PHP 8.x</strong> backends, Abhishek crafts transactional logical ledgers capable of sub-millisecond query execution speeds. These core data services are seamlessly integrated with interactive, lightweight consumer portals powered by <strong className="text-vintage-teal font-black">React and modern Vue 3</strong>.
                </p>
                <p>
                  "We construct code to outlast the waves of ephemeral trends," Abhishek says. "By marrying database integrity with fluid, responsive styling, we enable systems to scale flawlessly and bring joy to the end-users who tap them."
                </p>
                
                {/* Circuit schematic dividers */}
                <div className="flex justify-center items-center py-2 text-ink gap-2 font-mono text-[9px] font-black opacity-60">
                  <span>── [✦ SK-RD✦] ──</span>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar / Profile Desk (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* The Master Craftsman Portrait Summary Card */}
            <div className="border-[3px] border-ink p-5 bg-white rounded-xl toy-shadow relative overflow-hidden grid-bg">
              
              {/* Corner badge */}
              <div className="absolute -top-1 -right-1 py-1 px-3 font-mono text-[8px] bg-ink text-white font-black rounded-bl-lg uppercase tracking-wider">
                CORE VERIFIED
              </div>

              <span className="font-mono text-[9px] text-vintage-teal uppercase tracking-widest block font-black mb-1">
                // SYSTEM LEAD ENGINEER
              </span>
              <h3 className="font-serif-display text-2xl font-black text-ink leading-none mb-1.5 uppercase">
                {PORTFOLIO_OWNER.name}
              </h3>
              <p className="font-mono text-[10px] text-vintage-red font-black mb-4 border-b-[2px] border-ink pb-2 uppercase tracking-wide">
                ⚡ {PORTFOLIO_OWNER.title}
              </p>

              <div className="space-y-3.5 text-xs text-ink-muted leading-relaxed font-sans font-medium">
                <p>
                  Operating directly from the high-tech development sectors of <strong className="text-ink">{PORTFOLIO_OWNER.contact.location}</strong>.
                </p>
                <p>
                  A veteran developer with years of specialized practice in compiling Laravel double-entry bookkeeping systems, modular React interfaces, and performant Redis structures.
                </p>

                {/* Cyber-Credential Card Details */}
                <div className="border-[2px] border-ink p-3.5 bg-paper rounded-lg space-y-2 font-mono text-[9px] font-black">
                  <div className="flex justify-between items-center text-ink-muted">
                    <span>DISPATCH FREQ:</span>
                    <span className="text-ink lowercase text-right">{PORTFOLIO_OWNER.contact.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-ink-muted">
                    <span>SECTOR STATUS:</span>
                    <span className="text-vintage-teal">ONLINE • AHMEDABAD</span>
                  </div>
                  <div className="flex justify-between items-center text-ink-muted">
                    <span>COMPILER:</span>
                    <span className="text-vintage-red">STRICT COMPILATION OK</span>
                  </div>
                </div>
              </div>

              {/* Interactive external link widgets */}
              <div className="grid grid-cols-3 gap-2.5 mt-5">
                <a
                  href={PORTFOLIO_OWNER.contact.ghLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 border-[2px] border-ink hover:bg-robot-yellow text-ink rounded-lg text-[9px] font-mono uppercase font-black text-center flex items-center justify-center gap-1 cursor-pointer transition-all toy-shadow-sm active:translate-y-[1px]"
                  onClick={() => playSynthNote(600, 'sine', 0.08)}
                >
                  <Github className="w-3.5 h-3.5 shrink-0" />
                  Github
                </a>
                <a
                  href={PORTFOLIO_OWNER.contact.linkedinLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 border-[2px] border-ink hover:bg-robot-blue text-ink rounded-lg text-[9px] font-mono uppercase font-black text-center flex items-center justify-center gap-1 cursor-pointer transition-all toy-shadow-sm active:translate-y-[1px]"
                  onClick={() => playSynthNote(700, 'sine', 0.08)}
                >
                  <Linkedin className="w-3.5 h-3.5 shrink-0" />
                  LinkedIn
                </a>
                <button
                  onClick={() => scrollToChapter('correspondence-desk')}
                  className="py-2 bg-vintage-red hover:bg-ink text-white border-[2px] border-ink rounded-lg text-[9px] font-mono uppercase font-black text-center flex items-center justify-center gap-1 cursor-pointer transition-all toy-shadow-sm active:translate-y-[1px]"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  Contact
                </button>
              </div>
            </div>

            {/* General Editorial Column: The Code Guild Creed */}
            <div className="border-[3px] border-ink p-4 rounded-xl bg-robot-yellow/25 relative overflow-hidden">
              <div className="absolute top-1 right-1 font-mono text-[7px] text-ink opacity-35 font-bold">CREED-V1</div>
              <h4 className="font-serif-display text-sm font-black uppercase text-vintage-teal tracking-wide mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-vintage-gold animate-spin" />
                THE COMPILER OATH
              </h4>
              <p className="font-mono text-[10px] text-ink-muted leading-relaxed italic font-bold">
                "We pledge to write controllers that require zero redundant db calls. We optimize caching indices, design strictly typed objects, and craft tactile, animated visual layouts that deliver pure delight to humans."
              </p>
            </div>
            
          </aside>
        </div>

        {/* SECTION: Ledger of Works (Projects) */}
        <section className="mb-14 py-2" id="project-ledger">
          <div className="text-center mb-8">
            <span className="font-mono text-[10px] text-vintage-teal uppercase font-black tracking-widest block">// CHAPTER II</span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-black text-ink mt-1 uppercase">THE DIGITAL CARTRIDGE CONSOLE</h2>
            <div className="w-20 h-1 bg-ink mx-auto mt-2"></div>
          </div>
          <ProjectLedger projects={projects} isPlayingClacks={isPlayingClacks} />
        </section>

        {/* SECTION: Toolbox (Skills) */}
        <section className="mb-14 py-2" id="toolbox">
          <div className="text-center mb-8">
            <span className="font-mono text-[10px] text-vintage-teal uppercase font-black tracking-widest block">// CHAPTER III</span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-black text-ink mt-1 uppercase">DIAL & GAUGE CABINETS</h2>
            <div className="w-20 h-1 bg-ink mx-auto mt-2"></div>
          </div>
          <Toolbox categories={skills} isPlayingClacks={isPlayingClacks} />
        </section>

        {/* SECTION: Timeline */}
        <section className="mb-14 py-2" id="chronicle-timeline">
          <div className="text-center mb-8">
            <span className="font-mono text-[10px] text-vintage-teal uppercase font-black tracking-widest block">// CHAPTER IV</span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-black text-ink mt-1 uppercase">THE CHRONOLOGY CHASSIS</h2>
            <div className="w-20 h-1 bg-ink mx-auto mt-2"></div>
          </div>
          <ChronicleTimeline chronicle={chronicle} isPlayingClacks={isPlayingClacks} />
        </section>

        {/* SECTION: Correspondence Desk (Contact & Guest Ledger) */}
        <section className="mb-14 py-2" id="correspondence-desk">
          <div className="text-center mb-8">
            <span className="font-mono text-[10px] text-vintage-teal uppercase font-black tracking-widest block">// CHAPTER V</span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-black text-ink mt-1 uppercase">SIGNAL TRANSMISSION GRID</h2>
            <div className="w-20 h-1 bg-ink mx-auto mt-2"></div>
          </div>
          <CorrespondenceDesk guestbook={guestbook} onRefreshGuestbook={fetchPortfolioData} isPlayingClacks={isPlayingClacks} />
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t-[4px] border-ink pt-6 mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-ink-muted gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="uppercase font-black tracking-wider text-ink">
              © {today.getFullYear()} Abhishek Makwana • Core Operating Unit.
            </p>
            <p className="font-mono text-[9px] text-ink-muted">
              Engineered using React 19, Motion, Vite compiler, and fully compliant SQLite/Local storage buffers.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-ink text-[#00FF66] p-2 rounded border border-ink shadow-inner font-bold text-[8px] tracking-widest uppercase">
            <span className="h-2 w-2 rounded-full bg-[#00FF66] animate-ping"></span>
            <span>SYSTEM ACTIVE • COGNITIVE RECURSION LOADED</span>
          </div>
        </footer>

      </div>

      {/* FLOATING INTERACTIVE COMPANION ROBOT (Never Seen Before Design) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <AnimatePresence>
          {companionOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              className="mb-3 max-w-[200px] bg-white text-ink border-[2.5px] border-ink p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] relative font-mono text-[10px] leading-relaxed"
            >
              {/* Chat bubble tail */}
              <div className="absolute bottom-[-8px] right-6 w-3 h-3 bg-white border-r-[2.5px] border-b-[2.5px] border-ink transform rotate-45"></div>
              
              <div className="flex justify-between items-center border-b border-ink/10 pb-1 mb-1.5 text-[8px] text-ink-muted font-bold">
                <span>SYSTEM BOT CHAT</span>
                <button 
                  onClick={() => setCompanionOpen(false)}
                  className="hover:text-vintage-red text-[10px] font-black cursor-pointer"
                >
                  ✖
                </button>
              </div>
              <p className="italic font-bold">"{companionBubble}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating clicker button */}
        <div className="flex gap-2.5 items-center">
          {!companionOpen && (
            <button
              onClick={() => {
                setCompanionOpen(true);
                playSynthNote(800, 'sine', 0.08);
              }}
              className="bg-robot-yellow text-ink text-[9px] font-mono font-black border-[2px] border-ink px-2.5 py-1.5 rounded-lg toy-shadow-sm hover:translate-y-[1px] transition-all cursor-pointer"
            >
              💬 OPEN COMPANION
            </button>
          )}
          
          <button
            onClick={handleCompanionClick}
            className="w-14 h-14 bg-robot-yellow hover:bg-robot-blue text-ink rounded-full border-[3px] border-ink flex items-center justify-center toy-shadow hover:scale-105 active:translate-y-[3px] transition-all relative group animate-float-robot cursor-pointer"
            title="Tap my copper casing for code metrics!"
          >
            {/* Blinking eyes */}
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ink flex items-center justify-center p-0.5">
                  <span className="w-1 h-1 bg-[#00FF66] rounded-full animate-ping"></span>
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-ink flex items-center justify-center p-0.5">
                  <span className="w-1 h-1 bg-[#00FF66] rounded-full animate-ping"></span>
                </span>
              </div>
              <span className="text-[14px] leading-none mt-1 select-none font-bold">🤖</span>
            </div>

            {/* Glowing signal antenna */}
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-vintage-red border border-ink animate-pulse"></span>
          </button>
        </div>
      </div>

    </div>
  );
}
