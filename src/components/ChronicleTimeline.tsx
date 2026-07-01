import { useState } from 'react';
import { TimelineEvent, TIMELINE_HISTORY } from '../types';
import { Calendar, Briefcase, GraduationCap, Star, Milestone, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChronicleTimelineProps {
  chronicle?: TimelineEvent[];
  isPlayingClacks?: boolean;
}

export default function ChronicleTimeline({ chronicle = TIMELINE_HISTORY, isPlayingClacks = false }: ChronicleTimelineProps) {
  const activeHistory = chronicle.length > 0 ? chronicle : TIMELINE_HISTORY;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const playClankSound = () => {
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
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 0.2);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  };

  return (
    <div className="w-full flex flex-col border-[3px] border-ink rounded-xl bg-white p-4 md:p-6 toy-shadow grid-bg" id="chronicle-timeline">
      
      {/* Dynamic Warn Striping Accent */}
      <div className="flex items-center gap-3 mb-8 border-b-[3px] border-ink pb-4">
        <div className="w-10 h-10 bg-robot-pink toy-border rounded-lg flex items-center justify-center animate-float-robot">
          <span className="text-xl">📅</span>
        </div>
        <div>
          <span className="font-mono text-[9px] text-vintage-red uppercase font-black tracking-wider block">── TEMPORAL TIMELINE MATRIX ──</span>
          <h3 className="font-serif-display text-2xl font-black text-ink uppercase tracking-tight leading-none mt-1">
            CAREER SYSTEM CHRONOLOGY
          </h3>
        </div>
      </div>

      {/* Vertical Timeline Structure with Robotic Charging Core */}
      <div className="relative border-l-[4px] border-ink ml-4 sm:ml-8 pl-8 md:pl-12 space-y-10 py-4">
        
        {/* Central Charging Indicator Bot on top of rail */}
        <div className="absolute -top-1 -left-[14px] w-6 h-6 rounded-full bg-robot-yellow toy-border flex items-center justify-center animate-bounce z-10">
          <Bot className="w-3.5 h-3.5 text-ink" />
        </div>

        {activeHistory.map((event, index) => {
          const isExp = event.type === 'experience';
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={event.year + event.title}
              className="relative cursor-pointer"
              onMouseEnter={() => {
                setHoveredIndex(index);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => playClankSound()}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Timeline Bullet Anchor - Custom mechanical wire junction */}
              <div 
                className={`absolute -left-[54px] sm:-left-[70px] top-4 w-10 h-10 rounded-lg toy-border flex items-center justify-center transition-all z-10 ${
                  isHovered 
                    ? 'bg-robot-yellow rotate-12 scale-110' 
                    : isExp 
                      ? 'bg-robot-green' 
                      : 'bg-robot-purple'
                }`}
                style={{
                  boxShadow: isHovered ? '2px 2px 0px 0px #111111' : '3px 3px 0px 0px #111111'
                }}
              >
                {isExp ? (
                  <Briefcase className="w-4.5 h-4.5 text-ink shrink-0" />
                ) : (
                  <GraduationCap className="w-4.5 h-4.5 text-ink shrink-0" />
                )}
              </div>

              {/* Horizontal Connecting laser line */}
              <div className="absolute -left-8 top-8 w-8 h-[3px] bg-ink"></div>

              {/* Career Milestone Card - Styled as custom robot chassis panel */}
              <div 
                className={`p-4 sm:p-5 toy-border rounded-xl transition-all relative overflow-hidden ${
                  isHovered 
                    ? 'bg-white toy-shadow-lg -translate-y-1' 
                    : 'bg-paper toy-shadow'
                }`}
              >
                {/* Robot diagnostic indicator lights in card corners */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-vintage-red animate-ping' : 'bg-ink/10'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${isExp ? 'bg-robot-green' : 'bg-robot-purple'}`}></span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-dashed border-ink/10 pb-3 mb-3">
                  <div>
                    <span className="font-mono text-[9px] uppercase font-black text-vintage-red tracking-wider block">
                      {isExp ? '// MISSION OBJECTIVE COMPLETED' : '// KNOWLEDGE UPGRADE PROTOCOL'}
                    </span>
                    <h4 className="font-serif-display text-lg sm:text-xl font-black text-ink uppercase tracking-tight mt-0.5">
                      {event.title}
                    </h4>
                  </div>
                  
                  {/* Calendar Bubble */}
                  <div className="px-3 py-1 bg-white toy-border rounded font-mono text-[10px] font-black text-ink flex items-center gap-1.5 self-start sm:self-center">
                    <Calendar className="w-3.5 h-3.5 text-vintage-teal" />
                    {event.year}
                  </div>
                </div>

                {/* Organization name / client node */}
                <div className="flex items-center gap-1.5 font-mono text-xs text-ink font-bold mb-3 uppercase tracking-wide">
                  <span className="text-vintage-teal">📍 MODULE DEPLOYED AT:</span>
                  <span className="px-1.5 py-0.5 bg-ink text-white rounded text-[10px]">
                    {event.organization}
                  </span>
                </div>

                <p className="text-sm font-medium text-ink-muted leading-relaxed">
                  {event.description}
                </p>

                {/* Animated hover bonus: Robot stamp comment */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-3 border-t border-ink/10 flex items-center gap-2 text-[10px] font-mono text-vintage-red font-black uppercase tracking-wider"
                    >
                      <Bot className="w-4 h-4 animate-bounce" />
                      <span>Diagnostics: System Integrity Verified at 100% Core Load.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
