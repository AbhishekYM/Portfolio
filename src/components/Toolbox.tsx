import { useState, useEffect } from 'react';
import { SKILL_CATEGORIES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, Sliders, Activity, Info } from 'lucide-react';

interface ToolboxProps {
  categories?: any[];
  isPlayingClacks?: boolean;
}

export default function Toolbox({ categories = SKILL_CATEGORIES, isPlayingClacks = false }: ToolboxProps) {
  const activeCategories = categories.length > 0 ? categories : SKILL_CATEGORIES;
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState<any>(activeCategories[0]?.skills[0] || SKILL_CATEGORIES[0].skills[0]);

  const activeCategory = activeCategories[activeCategoryIndex] || activeCategories[0] || SKILL_CATEGORIES[0];

  // Auto-reset selected skill when category updates
  useEffect(() => {
    if (activeCategory?.skills?.length > 0) {
      setSelectedSkill(activeCategory.skills[0]);
    }
  }, [activeCategoryIndex, categories]);

  const playSkillBeep = (level: number) => {
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
      // Pitch is proportional to the level of the skill selected!
      const pitch = 250 + level * 5;
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 0.15);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  return (
    <div className="w-full flex flex-col border-[3px] border-ink rounded-xl bg-white p-4 md:p-6 toy-shadow grid-bg" id="toolbox">
      
      {/* Component Title and Robot Emblem */}
      <div className="flex items-center gap-3 mb-6 border-b-[3px] border-ink pb-4">
        <div className="w-10 h-10 bg-robot-yellow toy-border rounded-lg flex items-center justify-center animate-spin-gear-cw">
          <span className="text-xl">⚙️</span>
        </div>
        <div>
          <span className="font-mono text-[9px] text-vintage-red uppercase font-black tracking-wider block">── ENGINE CALIBRATION DECK ──</span>
          <h3 className="font-serif-display text-2xl font-black text-ink uppercase tracking-tight leading-none mt-1">
            SKILL RADAR & CALIBRATION
          </h3>
        </div>
      </div>

      {/* Grid Layout containing mechanical selectors & the SkillBot character */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL (4 Cols): Category Switch Board */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="font-mono text-[9px] uppercase font-black text-ink-muted tracking-wider block">
            🔋 SELECT PROPULSION CELL:
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {activeCategories.map((category, index) => (
              <button
                key={category.title}
                onClick={() => {
                  setActiveCategoryIndex(index);
                  if (category.skills?.length > 0) {
                    setSelectedSkill(category.skills[0]);
                    playSkillBeep(category.skills[0].level);
                  }
                }}
                className={`p-3 text-left toy-border rounded-lg transition-all cursor-pointer flex justify-between items-center relative overflow-hidden group ${
                  activeCategoryIndex === index
                    ? 'bg-robot-blue text-ink toy-shadow-sm translate-x-1'
                    : 'bg-paper hover:bg-robot-yellow text-ink-muted hover:text-ink hover:translate-x-1'
                }`}
                style={{
                  boxShadow: activeCategoryIndex === index ? '2px 2px 0px 0px #111111' : '4px 4px 0px 0px #111111'
                }}
              >
                <div>
                  <span className="font-serif-display text-sm font-black uppercase tracking-tight block">
                    {category.title}
                  </span>
                  <span className="font-mono text-[9px] block text-ink-muted/80 mt-0.5">
                    {category.skills?.length || 0} Calibrations ACTIVE
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full bg-white toy-border flex items-center justify-center font-bold text-xs ${
                  activeCategoryIndex === index ? 'animate-bounce' : 'opacity-60'
                }`}>
                  {index === 0 ? '💻' : '⚡'}
                </div>
              </button>
            ))}
          </div>

          {/* Micro retro status block */}
          <div className="mt-2 bg-paper p-3 toy-border rounded-lg border-dashed">
            <span className="font-mono text-[8px] uppercase font-black text-ink block">// CONSOLE TELEMETRY</span>
            <p className="text-[10px] font-mono text-ink-muted mt-1 leading-normal">
              {activeCategory.description}
            </p>
          </div>
        </div>

        {/* MIDDLE PANEL (4 Cols): Instruments Level Meter Controls */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="font-mono text-[9px] uppercase font-black text-ink-muted tracking-wider block">
            🎛️ ADJUST COMPONENT POTENTIOMETERS:
          </span>
          <div className="space-y-2">
            {activeCategory.skills?.map((skill: any) => (
              <button
                key={skill.name}
                onClick={() => {
                  setSelectedSkill(skill);
                  playSkillBeep(skill.level);
                }}
                className={`w-full p-3 text-left toy-border rounded-lg transition-all cursor-pointer flex flex-col gap-1.5 relative overflow-hidden ${
                  selectedSkill?.name === skill.name
                    ? 'bg-robot-yellow text-ink'
                    : 'bg-white text-ink-muted hover:text-ink hover:bg-paper'
                }`}
                style={{
                  boxShadow: selectedSkill?.name === skill.name ? '2px 2px 0px 0px #111111' : '3px 3px 0px 0px #111111'
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-mono text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-vintage-red animate-pulse"></span>
                    {skill.name}
                  </span>
                  <span className="font-mono text-[10px] font-black">{skill.level}%</span>
                </div>
                
                {/* Level Progress Micro Bar */}
                <div className="w-full h-3 bg-white toy-border p-0.5 rounded-sm overflow-hidden">
                  <div 
                    className="h-full bg-robot-blue transition-all duration-500 rounded-xs" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (3 Cols): Custom Animated Interactive Character SkillBot-9000 */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center">
          <div className="w-full bg-robot-purple/25 toy-border rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Robo Character Container */}
            <div className="w-28 h-28 bg-white toy-border rounded-full flex flex-col items-center justify-center relative p-2 shadow-inner group cursor-pointer hover:rotate-6 transition-transform" onClick={() => playSkillBeep(selectedSkill?.level || 80)}>
              
              {/* Antenna */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-robot-yellow border-2 border-ink inline-block animate-ping"></span>
                <span className="w-1 h-3 bg-ink"></span>
              </div>

              {/* Eyes */}
              <div className="flex gap-4 mb-2 mt-2">
                <div className="w-4 h-4 bg-ink rounded-full flex items-center justify-center p-0.5">
                  <div className="w-1.5 h-1.5 bg-[#00FF66] rounded-full animate-pulse"></div>
                </div>
                <div className="w-4 h-4 bg-ink rounded-full flex items-center justify-center p-0.5">
                  <div className="w-1.5 h-1.5 bg-[#00FF66] rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Digital speaker teeth */}
              <div className="flex gap-0.5 mb-1.5">
                <span className="w-1 h-2.5 bg-ink rounded-xs"></span>
                <span className="w-1 h-1.5 bg-ink rounded-xs"></span>
                <span className="w-1.5 h-3.5 bg-[#FF0055] rounded-xs animate-pulse"></span>
                <span className="w-1 h-1.5 bg-ink rounded-xs"></span>
                <span className="w-1 h-2.5 bg-ink rounded-xs"></span>
              </div>

              <span className="text-[7px] font-mono font-black text-ink-muted uppercase">TAP TO BE CHIRPED</span>
            </div>

            {/* Glowing calibration data readout screen */}
            <div className="w-full mt-4 bg-black toy-border rounded-lg p-2.5 text-left text-green-400 font-mono text-[9px] leading-relaxed relative overflow-hidden h-28 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
              
              {selectedSkill ? (
                <div className="space-y-1">
                  <div className="flex justify-between border-b border-green-500/20 pb-1 text-[8px] text-[#00FF66]/80">
                    <span>COILS READOUT</span>
                    <span className="animate-pulse">LOAD: ACTIVE</span>
                  </div>
                  <p className="font-bold text-[#00FF66] text-[10px] uppercase">{selectedSkill.name}</p>
                  <p className="text-green-300/80 leading-normal text-[8px]">
                    {selectedSkill.detail}
                  </p>
                </div>
              ) : (
                <p className="text-center text-[#00FF66]/40 py-4">No active connection to calibrator cores.</p>
              )}

              <div className="text-[7px] text-[#00FF66]/50 uppercase tracking-tighter flex justify-between pt-1 border-t border-green-500/20">
                <span>SKILLBOT_v9000</span>
                <span>LEVEL: {selectedSkill?.level || 100}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
