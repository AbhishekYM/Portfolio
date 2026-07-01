import { useState } from 'react';
import { Project, PROJECTS_ARCHIVE } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Folder, Shield, Zap, Sparkles, Binary } from 'lucide-react';

interface ProjectLedgerProps {
  projects?: Project[];
  isPlayingClacks?: boolean;
}

export default function ProjectLedger({ projects = PROJECTS_ARCHIVE, isPlayingClacks = false }: ProjectLedgerProps) {
  const activeProjects = projects.length > 0 ? projects : PROJECTS_ARCHIVE;
  const [activeProjectId, setActiveProjectId] = useState<string>(activeProjects[0]?.id || PROJECTS_ARCHIVE[0].id);
  const [isScanning, setIsScanning] = useState(false);

  const currentActiveId = activeProjects.some(p => p.id === activeProjectId) 
    ? activeProjectId 
    : (activeProjects[0]?.id || PROJECTS_ARCHIVE[0].id);

  const activeProject = activeProjects.find(p => p.id === currentActiveId) || activeProjects[0] || PROJECTS_ARCHIVE[0];

  const triggerScanSound = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);

    if (!isPlayingClacks) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.6);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  const playClickSound = () => {
    if (!isPlayingClacks) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(900, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  return (
    <div className="w-full flex flex-col border-[3px] border-ink rounded-xl bg-white toy-shadow overflow-hidden grid-bg" id="project-ledger">
      
      {/* Console Header Bar */}
      <div className="bg-robot-purple p-4 border-b-[3px] border-ink flex flex-col md:flex-row justify-between items-center gap-4 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-white toy-border flex items-center justify-center animate-bounce">
            <span className="text-lg">💾</span>
          </div>
          <div>
            <h3 className="font-serif-display text-lg font-black uppercase text-ink flex items-center gap-1.5 leading-none">
              DB SCHEMA SCANNER v2.0
            </h3>
            <p className="font-mono text-[9px] text-ink-muted uppercase tracking-wider mt-0.5">
              // Plug in code cartridges to inspect engineering pipelines
            </p>
          </div>
        </div>

        {/* Traditional Cartridge Tabs styled like physical game boy cartridges */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
          {activeProjects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => {
                setActiveProjectId(proj.id);
                playClickSound();
              }}
              className={`px-3.5 py-2 border-[2.5px] font-mono text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer rounded-t-md relative -mb-4 pt-1.5 ${
                currentActiveId === proj.id
                  ? 'bg-white text-ink border-ink border-b-white z-10 scale-105'
                  : 'bg-paper-dark hover:bg-robot-yellow border-ink text-ink-muted hover:text-ink'
              }`}
              style={{
                boxShadow: currentActiveId === proj.id ? 'none' : '0px 2px 0px 0px #111111'
              }}
            >
              <span className="mr-1">🎮</span> {proj.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 bg-white pt-8">
        
        {/* Left Side: Selected Project Cartridge Detail */}
        <div className="flex-1 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[9px] px-2 py-0.5 bg-robot-pink toy-border rounded font-black text-ink uppercase">
                ⚙️ {activeProject.category} PROJECT
              </span>
              <h4 className="font-serif-display text-2xl font-extrabold text-ink tracking-tight mt-1">
                {activeProject.title}
              </h4>
            </div>
            <div className="font-mono text-xs text-vintage-red bg-robot-yellow/40 toy-border px-3 py-1 rounded font-bold self-start sm:self-center">
              📅 {activeProject.period}
            </div>
          </div>

          <p className="text-sm font-medium text-ink-muted leading-relaxed">
            {activeProject.longDescription}
          </p>

          {/* Key Features Block - Styled as diagnostic reports */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase font-black text-ink tracking-wider block">
              🔧 COMPILED FUNCTION MODULES:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeProject.keyFeatures.map((feat, idx) => (
                <div key={idx} className="bg-paper p-3 toy-border toy-shadow-sm rounded-lg flex items-start gap-2">
                  <span className="text-xs mt-0.5">🤖</span>
                  <p className="text-[11px] font-medium text-ink leading-normal">
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Chips styled as micro-batteries */}
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase font-black text-ink tracking-wider block">
              ⚡ POWERED BY COMPATIBLE CORE DRIVERS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-white toy-border text-[10px] font-mono font-black text-ink uppercase rounded-full flex items-center gap-1 hover:bg-robot-green transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-vintage-teal inline-block animate-pulse"></span>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Animated Interactive CRT Database Schema Screen - Never Seen Layout */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          
          {/* Mechanical Dial controls */}
          <div className="flex justify-between items-center bg-paper-dark/60 p-3 toy-border rounded-lg">
            <div className="flex gap-2">
              <button 
                onClick={triggerScanSound}
                className="w-10 h-10 rounded-full bg-robot-yellow hover:bg-yellow-400 toy-border flex items-center justify-center font-black text-sm relative group hover:rotate-45 transition-transform cursor-pointer"
              >
                🔄
              </button>
              <div className="text-[9px] font-mono leading-tight">
                <span className="block font-black text-ink">SCAN SCHEMAS</span>
                <span className="text-ink-muted">RE-CALIBRATE COILS</span>
              </div>
            </div>

            {/* Simulated LEDs */}
            <div className="flex gap-2">
              <div className="flex flex-col items-center gap-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-robot-green animate-pulse"></span>
                <span className="text-[7px] font-mono font-black text-ink-muted">LINK</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-vintage-red animate-ping' : 'bg-red-300'}`}></span>
                <span className="text-[7px] font-mono font-black text-ink-muted">SCAN</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-robot-blue"></span>
                <span className="text-[7px] font-mono font-black text-ink-muted">AUTO</span>
              </div>
            </div>
          </div>

          {/* CRT Screen Frame */}
          <div className="bg-[#181B18] toy-border rounded-xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden h-72">
            
            {/* Scan Beam animation overlay */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-[#00FF66] opacity-80 scan-beam shadow-[0_0_8px_#00FF66]"></div>
            )}
            
            {/* CRT Phosphor Screen Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] pointer-events-none"></div>

            {/* Screen Header */}
            <div className="w-full flex justify-between items-center text-[7px] font-mono text-[#00FF66] opacity-80 border-b border-[#00FF66]/30 pb-2">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#00FF66] animate-ping"></span>
                SCHEMA_DUMP_STREAM
              </span>
              <span>INDEX: ENABLED</span>
            </div>

            {/* Screen Content - Database Layout representation */}
            <div className="flex-1 flex flex-col justify-center py-2 font-mono text-[9px] text-[#00FF66] space-y-2 select-none overflow-auto">
              {activeProject.schemaLayout ? (
                <div className="space-y-2 leading-relaxed">
                  <span className="text-[8px] opacity-60 block">// STRUCTURAL DATABASE MAP</span>
                  <pre className="whitespace-pre overflow-x-auto text-left leading-normal font-bold">
                    {activeProject.schemaLayout}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 space-y-1">
                  <span className="text-lg block animate-bounce">🤖</span>
                  <span className="text-[8px] uppercase tracking-wide block font-bold">SCHEMATIC LOAD FAIL</span>
                  <span className="text-[7px] text-[#00FF66]/60 block">NO RELATIONAL PIPES SET ON THIS MODULE</span>
                </div>
              )}
            </div>

            {/* Interactive Miniature crawling scanning robot */}
            <div className="w-full flex justify-between items-center text-[7px] font-mono text-[#00FF66] opacity-80 border-t border-[#00FF66]/30 pt-2">
              <span className="animate-pulse">
                {isScanning ? '⏳ DIAGNOSTIC SCAN ACTIVE...' : '✅ READY TO INDEX SCHEMA'}
              </span>
              <span className="font-bold flex items-center gap-1">
                <span>BOT: OK</span>
                <span className="animate-bounce">👾</span>
              </span>
            </div>
          </div>

          {/* Micro metrics underneath */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {activeProject.stats.map((stat) => (
              <div key={stat.label} className="bg-white toy-border toy-shadow-sm p-2 rounded-lg">
                <span className="block text-[8px] font-mono font-black text-ink-muted uppercase">{stat.label}</span>
                <span className="block text-xs font-mono font-black text-vintage-red mt-0.5">{stat.value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
