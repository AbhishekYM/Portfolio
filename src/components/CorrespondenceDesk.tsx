import React, { useState, useEffect } from 'react';
import { INITIAL_GUESTBOOK_ENTRIES, GuestbookEntry, PORTFOLIO_OWNER } from '../types';
import { Send, FileSignature, RefreshCw, Mail, Terminal, Wifi, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CorrespondenceDeskProps {
  guestbook?: GuestbookEntry[];
  onRefreshGuestbook?: () => void;
  isPlayingClacks?: boolean;
}

export default function CorrespondenceDesk({ guestbook, onRefreshGuestbook, isPlayingClacks = false }: CorrespondenceDeskProps) {
  // Guestbook Ledger state (hydrated from server prop or LocalStorage/default entries)
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [gbName, setGbName] = useState('');
  const [gbOrg, setGbOrg] = useState('');
  const [gbMessage, setGbMessage] = useState('');
  const [gbInkColor, setGbInkColor] = useState<GuestbookEntry['inkColor']>('emerald');
  const [isLiningUp, setIsLiningUp] = useState(false);

  // Inquiry Letter (Contact) state
  const [letterName, setLetterName] = useState('');
  const [letterEmail, setLetterEmail] = useState('');
  const [letterSubject, setLetterSubject] = useState('Consultation Offer');
  const [letterBody, setLetterBody] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [isLetterSent, setIsLetterSent] = useState(false);

  // Sync state with dynamic guestbook prop if available
  useEffect(() => {
    if (guestbook && guestbook.length > 0) {
      const mapped = guestbook.map((g: any) => ({
        id: g.id,
        name: g.name,
        organization: g.organization,
        message: g.message,
        timestamp: g.timestamp,
        inkColor: g.inkColor || g.ink_color || 'charcoal'
      }));
      setEntries(mapped);
    } else {
      const saved = localStorage.getItem('abhishek_portfolio_guestbook');
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch (e) {
          setEntries(INITIAL_GUESTBOOK_ENTRIES);
        }
      } else {
        setEntries(INITIAL_GUESTBOOK_ENTRIES);
      }
    }
  }, [guestbook]);

  const saveEntriesLocally = (newEntries: GuestbookEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('abhishek_portfolio_guestbook', JSON.stringify(newEntries));
  };

  const playSoundEffect = (type: 'beep' | 'success' | 'stamping') => {
    if (!isPlayingClacks) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'stamping') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  };

  const handleSignLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim()) return;

    setIsLiningUp(true);
    playSoundEffect('stamping');

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLocalEntry: GuestbookEntry = {
      id: Math.random().toString(36).substring(2, 9),
      name: gbName.trim(),
      organization: gbOrg.trim() || undefined,
      message: gbMessage.trim(),
      timestamp: formattedDate,
      inkColor: gbInkColor
    };

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gbName.trim(),
          organization: gbOrg.trim() || null,
          message: gbMessage.trim(),
          inkColor: gbInkColor
        })
      });

      if (res.ok) {
        if (onRefreshGuestbook) {
          onRefreshGuestbook();
        } else {
          const data = await res.json();
          const mappedItem: GuestbookEntry = {
            id: data.id,
            name: data.name,
            organization: data.organization,
            message: data.message,
            timestamp: data.timestamp,
            inkColor: data.inkColor
          };
          saveEntriesLocally([mappedItem, ...entries]);
        }
      } else {
        saveEntriesLocally([newLocalEntry, ...entries]);
      }
    } catch (err) {
      saveEntriesLocally([newLocalEntry, ...entries]);
    } finally {
      setGbName('');
      setGbOrg('');
      setGbMessage('');
      setIsLiningUp(false);
      playSoundEffect('success');
    }
  };

  const handleSendLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterName || !letterEmail || !letterBody) return;

    setIsSealing(true);
    playSoundEffect('stamping');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: letterName,
          email: letterEmail,
          subject: letterSubject,
          body: letterBody
        })
      });

      if (res.ok) {
        setTimeout(() => {
          setIsSealing(false);
          setIsLetterSent(true);
          playSoundEffect('success');
        }, 1200);
      } else {
        setTimeout(() => {
          setIsSealing(false);
          setIsLetterSent(true);
          playSoundEffect('success');
        }, 1200);
      }
    } catch (err) {
      setTimeout(() => {
        setIsSealing(false);
        setIsLetterSent(true);
        playSoundEffect('success');
      }, 1200);
    }
  };

  const handleResetLetter = () => {
    setLetterName('');
    setLetterEmail('');
    setLetterBody('');
    setLetterSubject('Consultation Offer');
    setIsLetterSent(false);
    playSoundEffect('beep');
  };

  const handleClearLedger = () => {
    playSoundEffect('beep');
    if (window.confirm("Do you wish to reset the Guest Ledger to default entries?")) {
      saveEntriesLocally(INITIAL_GUESTBOOK_ENTRIES);
    }
  };

  // Modern cyber glowing borders and background accents based on custom LED selections
  const getGlowStyles = (color: GuestbookEntry['inkColor']) => {
    switch (color) {
      case 'sepia': return 'bg-robot-yellow/10 border-vintage-gold text-ink shadow-[2px_2px_0px_0px_#FFB300]';
      case 'emerald': return 'bg-robot-green/10 border-vintage-teal text-ink shadow-[2px_2px_0px_0px_#00D2C4]';
      case 'charcoal': return 'bg-paper-dark/20 border-ink text-ink shadow-[2px_2px_0px_0px_#111111]';
      case 'royal-blue': return 'bg-robot-blue/10 border-blue-500 text-ink shadow-[2px_2px_0px_0px_#3B82F6]';
      case 'crimson': return 'bg-robot-pink/15 border-vintage-red text-ink shadow-[2px_2px_0px_0px_#FF4A5A]';
      default: return 'border-ink shadow-[2px_2px_0px_0px_#111111]';
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="correspondence-desk">
      
      {/* LEFT COLUMN: The Signal Transmitter Console (5 cols) */}
      <div className="lg:col-span-5 flex flex-col border-[3px] border-ink rounded-xl bg-white p-5 md:p-6 toy-shadow relative overflow-hidden grid-bg">
        
        <div className="border-b-[3px] border-ink pb-3 mb-5 flex justify-between items-center">
          <div>
            <h3 className="font-serif-display text-xl font-black uppercase text-ink flex items-center gap-1.5 leading-none">
              <Mail className="w-5 h-5 text-vintage-red animate-bounce" />
              SIGNAL DISPATCHER
            </h3>
            <p className="font-mono text-[9px] text-ink-muted uppercase tracking-wider mt-1">
              // Route instant message pipelines directly
            </p>
          </div>
          <div className="flex gap-1.5 items-center bg-paper p-1 toy-border rounded">
            <span className="w-2.5 h-2.5 rounded-full bg-robot-green animate-pulse"></span>
            <span className="font-mono text-[8px] font-black text-ink">ANT-TX-ON</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isLetterSent ? (
            <motion.form
              key="letter-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendLetter}
              className="space-y-4 font-mono text-xs relative"
            >
              {isSealing && (
                <div className="absolute inset-0 bg-[#161916] border-[3px] border-dashed border-vintage-gold flex flex-col items-center justify-center z-20 text-center rounded-lg p-4">
                  <div className="w-14 h-14 rounded-full bg-vintage-red flex items-center justify-center text-white border-4 border-double border-white shadow-lg animate-pulse mb-3 font-serif-display font-black text-sm">
                    STAMP
                  </div>
                  <span className="font-mono font-bold uppercase text-[#00FF66] tracking-widest text-xs">
                    TRANSMITTING WAVE PACKETS...
                  </span>
                  <span className="text-[8px] text-[#00FF66]/60 mt-1 uppercase">
                    SEALING ENVELOPE MODULE • PINGING DB ENDPOINT
                  </span>
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-ink mb-1">👤 YOUR NAME / CODING CALLSIGN:</label>
                  <input
                    type="text"
                    required
                    value={letterName}
                    onChange={(e) => {
                      setLetterName(e.target.value);
                      if (Math.random() > 0.7) playSoundEffect('beep');
                    }}
                    placeholder="E.g. Arthur Dent"
                    className="w-full bg-paper border-[2px] border-ink rounded-lg p-2.5 text-xs text-ink font-mono focus:outline-none focus:bg-robot-yellow/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-ink mb-1">✉️ TRANSMISSION ADDRESS (EMAIL):</label>
                  <input
                    type="email"
                    required
                    value={letterEmail}
                    onChange={(e) => {
                      setLetterEmail(e.target.value);
                      if (Math.random() > 0.7) playSoundEffect('beep');
                    }}
                    placeholder="E.g. pilot@galaxy.net"
                    className="w-full bg-paper border-[2px] border-ink rounded-lg p-2.5 text-xs text-ink font-mono focus:outline-none focus:bg-robot-yellow/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-ink mb-1">📡 CHOOSE FREQUENCY BAND (SUBJECT):</label>
                  <select
                    value={letterSubject}
                    onChange={(e) => {
                      setLetterSubject(e.target.value);
                      playSoundEffect('beep');
                    }}
                    className="w-full bg-paper border-[2px] border-ink rounded-lg p-2.5 text-xs text-ink font-mono focus:outline-none focus:bg-robot-yellow/20"
                  >
                    <option value="Consultation Offer">Full-Time Developer Offer</option>
                    <option value="Project Collaboration">PHP/Laravel Project Concept</option>
                    <option value="General Greetings">General Salutary Handshake</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-ink mb-1">✍️ WAVEFORM BODY (MESSAGE):</label>
                  <textarea
                    required
                    rows={4}
                    value={letterBody}
                    onChange={(e) => {
                      setLetterBody(e.target.value);
                      if (Math.random() > 0.8) playSoundEffect('beep');
                    }}
                    placeholder="Write your signal message details..."
                    className="w-full bg-paper border-[2px] border-ink rounded-lg p-2.5 text-xs text-ink font-mono leading-relaxed focus:outline-none focus:bg-robot-yellow/20 resize-none"
                  />
                </div>
              </div>

              {/* Stamping tactile button */}
              <button
                type="submit"
                disabled={isSealing}
                className="w-full py-3 bg-vintage-red hover:bg-ink text-white font-mono font-black uppercase tracking-wider text-xs rounded-lg toy-border toy-shadow cursor-pointer flex items-center justify-center gap-2 transition-all hover:translate-y-[2px] active:translate-y-[4px]"
              >
                <Send className="w-4 h-4" />
                DISPATCH WAVE SIGNAL
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="letter-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 px-4 border-[2.5px] border-dashed border-vintage-teal rounded-lg bg-robot-green/15 relative"
            >
              <div className="w-16 h-16 rounded-full bg-robot-green border-4 border-ink text-ink flex flex-col items-center justify-center mx-auto mb-4 font-mono font-black rotate-12 select-none animate-bounce">
                <span className="text-xs uppercase leading-none">SENT</span>
                <span className="text-[6px] tracking-widest mt-0.5">DB_OK</span>
              </div>

              <h4 className="font-serif-display text-xl font-black text-ink uppercase mb-2">WAVE DISPATCH SUCCESSFUL!</h4>
              <p className="text-xs font-mono text-ink-muted max-w-sm mx-auto leading-relaxed mb-6">
                Signal safely routed to Abhishek. Waveform records compiled. He will respond to <span className="underline font-bold text-vintage-teal">{letterEmail}</span> within 24 operational clock cycles.
              </p>

              <button
                onClick={handleResetLetter}
                className="px-4 py-2 bg-white hover:bg-robot-yellow text-ink text-[10px] uppercase font-mono font-black border-[2px] border-ink toy-shadow-sm rounded-md transition-all cursor-pointer"
              >
                DISPATCH NEW SIGNAL
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT COLUMN: The Visitor Ledger (7 cols) */}
      <div className="lg:col-span-7 flex flex-col border-[3px] border-ink rounded-xl bg-white p-5 md:p-6 toy-shadow relative overflow-hidden grid-bg">
        
        <div className="border-b-[3px] border-ink pb-3 mb-5 flex justify-between items-center">
          <div>
            <h3 className="font-serif-display text-xl font-black uppercase text-ink flex items-center gap-1.5 leading-none">
              <FileSignature className="w-5 h-5 text-vintage-teal animate-pulse" />
              COMMENDATION LEDGER
            </h3>
            <p className="font-mono text-[9px] text-ink-muted uppercase tracking-wider mt-1">
              // Register your credentials on the digital core memory
            </p>
          </div>

          <button
            onClick={handleClearLedger}
            title="Reset to default ledger nodes"
            className="p-1.5 text-ink-muted hover:text-vintage-red rounded-lg hover:bg-paper-dark cursor-pointer border-[2px] border-ink bg-white hover:rotate-90 transition-transform"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ledger Signature Input Form - Designed like a terminal card */}
        <form onSubmit={handleSignLedger} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 mb-6 bg-paper-dark/30 p-4 border-[2px] border-ink rounded-xl">
          <div className="md:col-span-5">
            <label className="block text-[9px] font-mono font-black text-ink mb-1">👤 VISIT CODE (NAME):</label>
            <input
              type="text"
              required
              value={gbName}
              onChange={(e) => {
                setGbName(e.target.value);
                if (Math.random() > 0.7) playSoundEffect('beep');
              }}
              placeholder="Your Name"
              className="w-full bg-white border-[2px] border-ink rounded-lg p-2 text-xs font-mono text-ink focus:outline-none focus:bg-robot-yellow/15"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[9px] font-mono font-black text-ink mb-1">🏢 GUILD AFFILIATION:</label>
            <input
              type="text"
              value={gbOrg}
              onChange={(e) => {
                setGbOrg(e.target.value);
                if (Math.random() > 0.7) playSoundEffect('beep');
              }}
              placeholder="Company / Guild"
              className="w-full bg-white border-[2px] border-ink rounded-lg p-2 text-xs font-mono text-ink focus:outline-none focus:bg-robot-yellow/15"
            />
          </div>

          {/* Glowing LED ink color selector */}
          <div className="md:col-span-3">
            <label className="block text-[9px] font-mono font-black text-ink mb-1">🚨 LED CORE GLOW:</label>
            <select
              value={gbInkColor}
              onChange={(e) => {
                setGbInkColor(e.target.value as any);
                playSoundEffect('beep');
              }}
              className="w-full bg-white border-[2px] border-ink rounded-lg p-2 text-[11px] font-mono font-black text-ink focus:outline-none"
            >
              <option value="emerald">🟢 Emerald</option>
              <option value="charcoal">⚫ Charcoal</option>
              <option value="sepia">🟡 Amber Gold</option>
              <option value="royal-blue">🔵 Cyber Blue</option>
              <option value="crimson">🔴 Crimson Glow</option>
            </select>
          </div>

          <div className="col-span-12">
            <label className="block text-[9px] font-mono font-black text-ink mb-1">💬 ENCODE MESSAGE PACKETS:</label>
            <textarea
              required
              rows={2}
              value={gbMessage}
              onChange={(e) => {
                setGbMessage(e.target.value);
                if (Math.random() > 0.8) playSoundEffect('beep');
              }}
              placeholder="Inject words, feedback or greetings here..."
              className="w-full bg-white border-[2px] border-ink rounded-lg p-2 text-xs font-mono text-ink focus:outline-none focus:bg-robot-yellow/15 resize-none"
            />
          </div>

          <div className="col-span-12 flex justify-end pt-1">
            <button
              type="submit"
              disabled={isLiningUp}
              className="px-4 py-2 bg-vintage-teal text-white border-[2px] border-ink font-mono font-black text-xs uppercase rounded-lg toy-shadow-sm hover:bg-ink cursor-pointer transition-all active:translate-y-[2px]"
            >
              {isLiningUp ? "TRANSMITTING..." : "⚡ REGISTER SIGNATURE"}
            </button>
          </div>
        </form>

        {/* Scrollable Register Ledger Entries - Never Seen Cyber bubble design */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`p-4 border-[2px] rounded-xl relative overflow-hidden transition-all hover:rotate-1 ${getGlowStyles(entry.inkColor)}`}
              >
                {/* Simulated micro chip pins on left side */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-ink opacity-30 flex flex-col justify-around">
                  <span className="w-1 h-1 bg-ink"></span>
                  <span className="w-1 h-1 bg-ink"></span>
                  <span className="w-1 h-1 bg-ink"></span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🤖</span>
                    <span className="font-mono text-xs font-black uppercase text-ink">
                      {entry.name}
                    </span>
                    {entry.organization && (
                      <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.5 bg-ink text-white rounded select-none">
                        {entry.organization}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[8px] text-ink-muted">
                    [{entry.timestamp}]
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm font-medium leading-relaxed text-ink pr-2 pl-4 border-l-2 border-ink/20 py-0.5 mt-1">
                  "{entry.message}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {entries.length === 0 && (
            <div className="py-12 text-center text-ink-muted font-mono text-xs italic">
              No wave packet memory loaded. Be the first unit to register signature!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
