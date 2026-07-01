import { useState } from 'react';
import { PORTFOLIO_OWNER } from '../types';
import { Cpu, HelpCircle, MapPin, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface MastheadProps {
  onCorrespondenceClick: () => void;
  isPlayingClacks: boolean;
  setIsPlayingClacks: (play: boolean) => void;
}

type RobotFace = 'happy' | 'cool' | 'coding' | 'excited' | 'dizzy';

export default function Masthead({ onCorrespondenceClick, isPlayingClacks, setIsPlayingClacks }: MastheadProps) {
  const [robotFace, setRobotFace] = useState<RobotFace>('happy');
  const [statusMessage, setStatusMessage] = useState('SYSTEM ONLINE. WAITING FOR COMMITS...');
  const [clickCount, setClickCount] = useState(0);

  // Play synthetic 8-bit retro sounds!
  const playRoboSound = (type: 'chirp' | 'boop' | 'laser' | 'success') => {
    if (!isPlayingClacks) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'chirp') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'boop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(400, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.16);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.32);
      }
    } catch (e) {
      // Audio context might be blocked by browser autoplay rules
    }
  };

  const handleRobotClick = () => {
    const faces: RobotFace[] = ['happy', 'cool', 'coding', 'excited', 'dizzy'];
    const currentIdx = faces.indexOf(robotFace);
    const nextIdx = (currentIdx + 1) % faces.length;
    const nextFace = faces[nextIdx];
    
    setRobotFace(nextFace);
    setClickCount(prev => prev + 1);

    // Dynamic responses based on faces
    if (nextFace === 'happy') {
      setStatusMessage('GREETINGS HUMAN! I HAVE AMBITIOUS CODING CAPABILITIES!');
      playRoboSound('chirp');
    } else if (nextFace === 'cool') {
      setStatusMessage('SWAG PROTOCOL INITIALIZED. BOOTING COGNITIVE FLOWS.');
      playRoboSound('laser');
    } else if (nextFace === 'coding') {
      setStatusMessage('PROCESSING COMPILER RECURSIONS... INJECTING REACT COMPONENT.');
      playRoboSound('success');
    } else if (nextFace === 'excited') {
      setStatusMessage('WOW! A NEW CORRESPONDENCE HAS ENTERED THE PORTFOLIO PIPELINE!');
      playRoboSound('chirp');
    } else if (nextFace === 'dizzy') {
      setStatusMessage('WHOA... INSUFFICIENT MEMORY STACK! BRAIN UNDERGOING GARBAGE COLLECTION!');
      playRoboSound('boop');
    }
  };

  return (
    <header className="w-full flex flex-col items-center border-[3px] border-ink p-4 md:p-6 bg-white toy-shadow mb-8 rounded-lg relative overflow-hidden grid-bg" id="masthead">
      
      {/* Dynamic Warn Striping Accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-repeating-gradient" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #FFF176, #FFF176 10px, #111111 10px, #111111 20px)'
      }}></div>

      {/* Retro Utility Belt */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-bold uppercase text-ink border-b-[3px] border-ink pb-4 mb-6 mt-2 px-1 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-robot-yellow toy-border toy-shadow-sm rounded font-bold text-xs">MODEL AB-2026</span>
          <span className="flex items-center gap-1 text-ink-muted">
            <MapPin className="w-3.5 h-3.5 text-vintage-red shrink-0" />
            {PORTFOLIO_OWNER.contact.location}
          </span>
        </div>
        
        {/* Playful system status message bar */}
        <div className="flex-1 max-w-md mx-4 bg-ink text-[#00FF66] font-mono px-3 py-1 text-[10px] rounded border border-ink overflow-hidden whitespace-nowrap text-ellipsis text-center hidden md:block">
          ⚡ {statusMessage}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextState = !isPlayingClacks;
              setIsPlayingClacks(nextState);
              if (nextState) {
                // Play directly bypassing state check to give immediate user response
                try {
                  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                  if (AudioContext) {
                    const ctx = new AudioContext();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(450, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.15);
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                  }
                } catch (e) {}
              }
            }}
            className={`px-3 py-1.5 text-[10px] uppercase font-mono font-black tracking-wide toy-border toy-shadow-sm rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              isPlayingClacks ? 'bg-robot-green' : 'bg-paper-dark hover:bg-robot-yellow'
            }`}
            title="Toggle delightful retro click sounds throughout the app"
          >
            {isPlayingClacks ? <Volume2 className="w-3.5 h-3.5 text-ink" /> : <VolumeX className="w-3.5 h-3.5 text-ink-muted" />}
            {isPlayingClacks ? 'RETRO SOUNDS: ON' : 'RETRO SOUNDS: MUTED'}
          </button>
          
          <button 
            onClick={() => {
              onCorrespondenceClick();
              playRoboSound('success');
            }}
            className="px-3 py-1 bg-vintage-red hover:bg-ink text-white text-[10px] uppercase font-mono font-black tracking-wide toy-border toy-shadow-sm rounded-sm transition-all cursor-pointer"
          >
            PING DEVELOPER
          </button>
        </div>
      </div>

      {/* Main Interactive Row: Layout Never Seen Before */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-center py-4 gap-6">
        
        {/* Left Hand: Gauges, Knobs & Calibration Meters */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-paper p-4 toy-border toy-shadow rounded-lg space-y-3 relative">
            <div className="absolute top-2 right-2 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-vintage-red animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-vintage-red"></span>
            </div>
            
            <h3 className="font-mono text-xs font-black text-ink flex items-center gap-1.5 uppercase tracking-wide">
              <Cpu className="w-4 h-4 text-vintage-teal" />
              SYSTEM TELEMETRY
            </h3>
            
            {/* Laravel Fuel Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono font-bold text-ink-muted">
                <span>LARAVEL FUEL ENGINE</span>
                <span className="text-vintage-red font-black">98.5% (STABLE)</span>
              </div>
              <div className="h-4 bg-white toy-border rounded overflow-hidden p-0.5 relative">
                <div className="h-full bg-robot-yellow rounded" style={{ width: '98.5%' }}></div>
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black tracking-widest text-ink">PHP 8.3 FLUID</div>
              </div>
            </div>

            {/* React Interface Charge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono font-bold text-ink-muted">
                <span>REACT COMPILATION COILS</span>
                <span className="text-vintage-teal font-black">100% OVERCHARGED</span>
              </div>
              <div className="h-4 bg-white toy-border rounded overflow-hidden p-0.5 relative">
                <div className="h-full bg-robot-blue rounded" style={{ width: '100%' }}></div>
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black tracking-widest text-ink">VITE POWERED</div>
              </div>
            </div>

            {/* Coffee level */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono font-bold text-ink-muted">
                <span>ORGANIC COFFEE STORAGE</span>
                <span className="text-vintage-gold font-black">82.4% (WARM)</span>
              </div>
              <div className="h-4 bg-white toy-border rounded overflow-hidden p-0.5 relative">
                <div className="h-full bg-robot-orange rounded" style={{ width: '82.4%' }}></div>
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black tracking-widest text-ink">AHMEDABAD ROAST</div>
              </div>
            </div>
          </div>
        </div>

        {/* Central Character: Giant Animated Interactive Robot Face ("Robo-Abhi") */}
        <div className="flex-1 flex flex-col items-center text-center px-4 max-w-lg">
          <div className="relative group cursor-pointer" onClick={handleRobotClick}>
            
            {/* Spinning gears in the background */}
            <div className="absolute -top-6 -left-6 text-paper-dark opacity-30 animate-spin-gear-cw">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10-1.5V11.5L20 11a7.7 7.7 0 0 0-.6-1.5l1.3-1.3-1.4-1.4-1.3 1.3A7.7 7.7 0 0 0 16.5 7.5L16 5.5h-2v2a7.7 7.7 0 0 0-1.5.6l-1.3-1.3-1.4 1.4 1.3 1.3A7.7 7.7 0 0 0 7.5 11l-2 .5v2l2 .5c.2.5.4 1 .6 1.5l-1.3 1.3 1.4 1.4 1.3-1.3c.5.2 1 .4 1.5.6l.5 2h2v-2c.5-.2 1-.4 1.5-.6l1.3 1.3 1.4-1.4-1.3-1.3c.2-.5.4-1 .6-1.5l2-.5z"/></svg>
            </div>
            <div className="absolute -bottom-4 -right-6 text-paper-dark opacity-30 animate-spin-gear-ccw">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10-1.5V11.5L20 11a7.7 7.7 0 0 0-.6-1.5l1.3-1.3-1.4-1.4-1.3 1.3A7.7 7.7 0 0 0 16.5 7.5L16 5.5h-2v2a7.7 7.7 0 0 0-1.5.6l-1.3-1.3-1.4 1.4 1.3 1.3A7.7 7.7 0 0 0 7.5 11l-2 .5v2l2 .5c.2.5.4 1 .6 1.5l-1.3 1.3 1.4 1.4 1.3-1.3c.5.2 1 .4 1.5.6l.5 2h2v-2c.5-.2 1-.4 1.5-.6l1.3 1.3 1.4-1.4-1.3-1.3c.2-.5.4-1 .6-1.5l2-.5z"/></svg>
            </div>

            {/* Robot Floating Container */}
            <div className="w-48 h-48 bg-white toy-border toy-shadow-lg rounded-2xl flex flex-col items-center justify-center p-4 animate-float-robot hover:rotate-3 transition-transform relative z-10">
              
              {/* Antenna on Top */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-4 h-4 bg-vintage-red toy-border rounded-full animate-ping absolute -top-1"></div>
                <div className="w-4 h-4 bg-vintage-red toy-border rounded-full z-10"></div>
                <div className="w-2 h-6 bg-ink toy-border -mt-1 rounded-sm animate-antenna"></div>
              </div>

              {/* Glowing Ears */}
              <div className="absolute -left-3 top-20 w-3 h-8 bg-robot-yellow toy-border rounded-l-md"></div>
              <div className="absolute -right-3 top-20 w-3 h-8 bg-robot-yellow toy-border rounded-r-md"></div>

              {/* CRT Face Screen Mask */}
              <div className="w-40 h-32 bg-[#1C201C] rounded-xl toy-border p-3 flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
                {/* Horizontal scan line background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] pointer-events-none"></div>

                {/* Grid stats in corner */}
                <div className="w-full flex justify-between text-[6px] font-mono text-[#00FF66] opacity-70">
                  <span>RAM: OK</span>
                  <span>HZ: 60</span>
                </div>

                {/* Animated Face Expressions */}
                <div className="flex-1 flex flex-col justify-center items-center w-full mt-2">
                  {robotFace === 'happy' && (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="flex gap-8">
                        <div className="w-5 h-5 bg-[#00FF66] rounded-full animate-blink flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#1C201C] rounded-full"></div>
                        </div>
                        <div className="w-5 h-5 bg-[#00FF66] rounded-full animate-blink flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#1C201C] rounded-full"></div>
                        </div>
                      </div>
                      <div className="w-12 h-3 border-b-4 border-[#00FF66] rounded-full"></div>
                    </div>
                  )}

                  {robotFace === 'cool' && (
                    <div className="space-y-4 flex flex-col items-center">
                      {/* Sunglasses style */}
                      <div className="flex gap-2 items-center">
                        <div className="w-8 h-4 bg-[#00FF66] rounded-sm transform rotate-3"></div>
                        <div className="w-4 h-1 bg-[#00FF66]"></div>
                        <div className="w-8 h-4 bg-[#00FF66] rounded-sm transform -rotate-3"></div>
                      </div>
                      <div className="w-8 h-1 bg-[#00FF66] rounded"></div>
                    </div>
                  )}

                  {robotFace === 'coding' && (
                    <div className="space-y-2 flex flex-col items-center w-full">
                      <div className="flex gap-8 text-[11px] font-mono text-[#00FF66] font-bold">
                        <span>&lt;/&gt;</span>
                        <span>{}</span>
                      </div>
                      <div className="text-[7px] font-mono text-[#00FF66] tracking-tighter">
                        while(true) {'{'} code() {'}'}
                      </div>
                    </div>
                  )}

                  {robotFace === 'excited' && (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="flex gap-6">
                        <div className="w-6 h-6 bg-[#00FF66] rounded-full flex items-center justify-center animate-bounce">
                          <div className="w-1.5 h-1.5 bg-[#1C201C] rounded-full"></div>
                        </div>
                        <div className="w-6 h-6 bg-[#00FF66] rounded-full flex items-center justify-center animate-bounce">
                          <div className="w-1.5 h-1.5 bg-[#1C201C] rounded-full"></div>
                        </div>
                      </div>
                      <div className="w-6 h-6 border-4 border-[#00FF66] rounded-full animate-pulse"></div>
                    </div>
                  )}

                  {robotFace === 'dizzy' && (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="flex gap-8 text-[#00FF66] font-extrabold text-xl font-mono leading-none">
                        <span className="animate-spin inline-block">✖</span>
                        <span className="animate-spin inline-block">✖</span>
                      </div>
                      <div className="w-10 h-1.5 bg-[#00FF66] rounded-full transform rotate-6"></div>
                    </div>
                  )}
                </div>

                <div className="text-[6px] font-mono text-center text-[#00FF66] opacity-70 w-full">
                  [ TAP FACE TO SWITCH ]
                </div>
              </div>
            </div>
          </div>

          <h1 className="font-serif-display text-4xl lg:text-5xl font-black text-ink tracking-tight mt-4 uppercase">
            ABHISHEK MAKWANA
          </h1>
          <p className="font-mono text-xs text-vintage-red uppercase font-black tracking-widest mt-1.5">
            // Full-Stack Robot Engine Developer
          </p>
          <p className="font-medium text-ink-muted text-sm mt-3 max-w-sm">
            Merging high-performance Laravel backends with playful, lively frontend client visual modules.
          </p>
        </div>

        {/* Right Hand: Achievements Stamps / Micro Cards */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-robot-pink p-4 toy-border toy-shadow rounded-lg space-y-2 text-center relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-1 font-mono text-[8px] bg-ink text-white font-bold rounded-bl uppercase">STAMP</div>
            <span className="text-3xl">🤖</span>
            <h4 className="font-serif-display text-base font-black uppercase text-ink">NEVER SEEN PORTFOLIO</h4>
            <p className="font-mono text-[10px] text-ink-muted leading-snug">
              Every card, dial, knob and layout has been completely reconstructed for maximum fun and responsiveness.
            </p>
          </div>

          <div className="bg-robot-green p-4 toy-border toy-shadow rounded-lg flex items-center justify-between gap-3 text-left">
            <div>
              <h4 className="font-serif-display text-sm font-black uppercase text-ink">AHMEDABAD ED. 1.0</h4>
              <p className="text-[10px] font-mono text-ink-muted leading-tight mt-1">
                Hand-delivered with atomic performance, structural integrity, and clean database engineering.
              </p>
            </div>
            <div className="w-14 h-14 shrink-0 rounded-full bg-white toy-border flex flex-col items-center justify-center font-bold text-ink hover:rotate-12 transition-transform">
              <span className="text-[14px] font-black leading-none">AM</span>
              <span className="text-[6px] font-mono font-bold uppercase mt-0.5 text-vintage-red">DEV</span>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Warning Stripe Band on Bottom */}
      <div className="w-full mt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono font-bold tracking-wider text-ink bg-paper-dark/60 py-2.5 px-3 rounded border-[2.5px] border-ink gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-vintage-gold animate-spin" />
          <span>PORTFOLIO CORE MODULES LOADED SUCESSFULLY</span>
        </div>
        <div className="text-[10px] text-vintage-red font-black">
          [ 4 CRITICAL ENGINES ACTIVE ]
        </div>
      </div>
    </header>
  );
}
