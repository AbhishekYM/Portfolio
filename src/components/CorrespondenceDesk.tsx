import React, { useState, useEffect } from 'react';
import { INITIAL_GUESTBOOK_ENTRIES, GuestbookEntry, PORTFOLIO_OWNER } from '../types';
import { Send, FileSignature, Landmark, Mail, Inbox, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CorrespondenceDesk() {
  // Guestbook Ledger state (hydrated from LocalStorage or default entries)
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [gbName, setGbName] = useState('');
  const [gbOrg, setGbOrg] = useState('');
  const [gbMessage, setGbMessage] = useState('');
  const [gbInkColor, setGbInkColor] = useState<GuestbookEntry['inkColor']>('sepia');
  const [isLiningUp, setIsLiningUp] = useState(false);

  // Inquiry Letter (Contact) state
  const [letterName, setLetterName] = useState('');
  const [letterEmail, setLetterEmail] = useState('');
  const [letterSubject, setLetterSubject] = useState('Consultation Offer');
  const [letterBody, setLetterBody] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [isLetterSent, setIsLetterSent] = useState(false);

  // Hydrate Guestbook from LocalStorage on mount
  useEffect(() => {
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
  }, []);

  // Save guestbook entries
  const saveEntries = (newEntries: GuestbookEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('abhishek_portfolio_guestbook', JSON.stringify(newEntries));
  };

  // Handle Guestbook Submission
  const handleSignLedger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim()) return;

    setIsLiningUp(true);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newEntry: GuestbookEntry = {
      id: Math.random().toString(36).substring(2, 9),
      name: gbName.trim(),
      organization: gbOrg.trim() || undefined,
      message: gbMessage.trim(),
      timestamp: formattedDate,
      inkColor: gbInkColor
    };

    setTimeout(() => {
      const updated = [newEntry, ...entries];
      saveEntries(updated);
      setGbName('');
      setGbOrg('');
      setGbMessage('');
      setIsLiningUp(false);
    }, 800);
  };

  // Handle Inquiry Letter Submission
  const handleSendLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterName || !letterEmail || !letterBody) return;

    setIsSealing(true);

    // Simulate sealing wax and physical stamping
    setTimeout(() => {
      setIsSealing(false);
      setIsLetterSent(true);
      
      // Keep record of local inquiries just for fun / verification in console
      console.log("Inquiry registered from:", { letterName, letterEmail, letterSubject, letterBody });
    }, 2000);
  };

  // Reset Inquiry Letter form
  const handleResetLetter = () => {
    setLetterName('');
    setLetterEmail('');
    setLetterBody('');
    setLetterSubject('Consultation Offer');
    setIsLetterSent(false);
  };

  // Reset guestbook to initial template entries (clean state convenience)
  const handleClearLedger = () => {
    if (window.confirm("Do you wish to reset the Guest Ledger to default entries?")) {
      saveEntries(INITIAL_GUESTBOOK_ENTRIES);
    }
  };

  // Map ink colors to tailwind/CSS classes
  const getInkColorClass = (color: GuestbookEntry['inkColor']) => {
    switch (color) {
      case 'charcoal': return 'text-ink border-ink/10';
      case 'sepia': return 'text-vintage-gold border-vintage-gold/10';
      case 'emerald': return 'text-vintage-teal border-vintage-teal/10';
      case 'royal-blue': return 'text-blue-900 border-blue-900/10';
      case 'crimson': return 'text-vintage-red border-vintage-red/10';
      default: return 'text-ink';
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="correspondence-desk">
      {/* LEFT COLUMN: The Contact Letter (5 cols) */}
      <div className="lg:col-span-5 flex flex-col border border-ink/30 rounded bg-paper p-5 md:p-6 shadow-sm">
        <div className="border-b border-ink/20 pb-3 mb-4">
          <h3 className="font-serif-display text-xl font-bold uppercase text-ink flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-vintage-red" />
            Letter of Inquiry
          </h3>
          <p className="font-serif-body text-xs text-ink-muted italic">
            Dispatch a formal correspondence directly to Abhishek Makwana's post desk.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isLetterSent ? (
            <motion.form
              key="letter-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendLetter}
              className="space-y-4 font-serif-body relative"
            >
              {/* Envelope folding overlays when sealing */}
              {isSealing && (
                <div className="absolute inset-0 bg-paper-dark/95 border-2 border-dashed border-vintage-gold flex flex-col items-center justify-center z-20 text-center rounded p-4">
                  {/* Wax Stamp Animation */}
                  <div className="w-16 h-16 rounded-full bg-vintage-red flex items-center justify-center text-paper border-4 border-double border-paper/40 shadow-lg animate-pulse mb-3 font-serif-display font-bold text-sm tracking-widest">
                    WAX
                  </div>
                  <span className="font-serif-display font-bold uppercase text-vintage-red tracking-wide text-sm">
                    Melting Sealing Wax...
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted mt-1">
                    AFFIXING STAMP • REGISTERING POST
                  </span>
                </div>
              )}

              {/* Sender Credentials */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Your Honorable Name:</label>
                  <input
                    type="text"
                    required
                    value={letterName}
                    onChange={(e) => setLetterName(e.target.value)}
                    placeholder="E.g. Lord Byron"
                    className="w-full bg-paper-dark/30 border border-ink/15 rounded-sm p-2 text-sm text-ink font-serif-body focus:outline-none focus:border-vintage-gold focus:bg-paper/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Electronic Post Address (Email):</label>
                  <input
                    type="email"
                    required
                    value={letterEmail}
                    onChange={(e) => setLetterEmail(e.target.value)}
                    placeholder="your.address@domain.com"
                    className="w-full bg-paper-dark/30 border border-ink/15 rounded-sm p-2 text-sm text-ink font-serif-body focus:outline-none focus:border-vintage-gold focus:bg-paper/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Subject of Correspondence:</label>
                  <select
                    value={letterSubject}
                    onChange={(e) => setLetterSubject(e.target.value)}
                    className="w-full bg-paper-dark/30 border border-ink/15 rounded-sm p-2 text-sm text-ink font-serif-body focus:outline-none focus:border-vintage-gold focus:bg-paper/50"
                  >
                    <option value="Consultation Offer">Full-Time Hire / Consultation Offer</option>
                    <option value="Project Collaboration">Bespoke Laravel / PHP Project Idea</option>
                    <option value="General Greetings">General Salutary Greetings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink-muted mb-1">Letter Body:</label>
                  <textarea
                    required
                    rows={5}
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    placeholder="Write your letter here, outlining your digital requirements or invitation details..."
                    className="w-full bg-paper-dark/30 border border-ink/15 rounded-sm p-2 text-sm text-ink font-serif-body leading-relaxed focus:outline-none focus:border-vintage-gold focus:bg-paper/50 resize-none"
                  />
                </div>
              </div>

              {/* Wax Seal Sign Button */}
              <button
                type="submit"
                disabled={isSealing}
                className="w-full py-2.5 bg-vintage-red hover:bg-vintage-red/90 text-paper font-serif-display font-bold uppercase tracking-wider text-sm rounded shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-vintage-red/30"
              >
                <Send className="w-4 h-4" />
                Seal & Dispatch Post
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="letter-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 px-4 border border-dashed border-vintage-gold rounded bg-paper-dark/10 relative"
            >
              {/* Success wax stamp visual */}
              <div className="w-20 h-20 rounded-full bg-vintage-red/10 border-4 border-double border-vintage-red/50 text-vintage-red flex flex-col items-center justify-center mx-auto mb-4 font-serif-display rotate-12 select-none">
                <span className="font-bold text-xs uppercase tracking-tighter">DISPATCHED</span>
                <span className="text-[7px] font-mono mt-0.5">REGISTERED POST</span>
              </div>

              <h4 className="font-serif-display text-xl font-bold text-ink mb-2">Letter Registered successfully!</h4>
              <p className="text-sm font-serif-body text-ink-muted max-w-sm mx-auto leading-relaxed mb-6">
                Thank you, <strong className="text-ink">{letterName}</strong>. Your letter has been sealed and cataloged. Abhishek will review it and reply to <span className="underline italic text-vintage-teal">{letterEmail}</span> shortly.
              </p>

              <button
                onClick={handleResetLetter}
                className="px-4 py-1.5 border border-ink/20 hover:border-ink rounded font-mono text-[10px] text-ink-muted hover:text-ink uppercase font-bold tracking-wider cursor-pointer"
              >
                Send Another Letter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT COLUMN: The Visitor Ledger (7 cols) */}
      <div className="lg:col-span-7 flex flex-col border border-ink/30 rounded bg-paper p-5 md:p-6 shadow-sm">
        <div className="border-b border-ink/20 pb-3 mb-4 flex justify-between items-center">
          <div>
            <h3 className="font-serif-display text-xl font-bold uppercase text-ink flex items-center gap-1.5">
              <FileSignature className="w-4 h-4 text-vintage-teal" />
              The Visitor's Register
            </h3>
            <p className="font-serif-body text-xs text-ink-muted italic">
              Leave your mark and words of commendation in our local registry.
            </p>
          </div>

          <button
            onClick={handleClearLedger}
            title="Reset to original default signatures"
            className="p-1 text-ink-muted hover:text-vintage-red rounded-full hover:bg-paper-dark cursor-pointer border border-transparent hover:border-ink/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ledger Signature Input Form */}
        <form onSubmit={handleSignLedger} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-paper-dark/30 p-3.5 border border-ink/10 rounded-sm">
          <div className="md:col-span-5">
            <label className="block text-[10px] font-mono uppercase text-ink-muted mb-0.5">Visitor Name:</label>
            <input
              type="text"
              required
              value={gbName}
              onChange={(e) => setGbName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs text-ink focus:outline-none focus:border-vintage-gold"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[10px] font-mono uppercase text-ink-muted mb-0.5">Affiliation:</label>
            <input
              type="text"
              value={gbOrg}
              onChange={(e) => setGbOrg(e.target.value)}
              placeholder="Guild / Organization"
              className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs text-ink focus:outline-none focus:border-vintage-gold"
            />
          </div>

          {/* Ink color picker */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-mono uppercase text-ink-muted mb-0.5">Ink Color:</label>
            <select
              value={gbInkColor}
              onChange={(e) => setGbInkColor(e.target.value as any)}
              className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs text-ink focus:outline-none focus:border-vintage-gold"
            >
              <option value="sepia">Sepia Gold</option>
              <option value="charcoal">Charcoal Ink</option>
              <option value="emerald">Emerald Ink</option>
              <option value="royal-blue">Royal Blue</option>
              <option value="crimson">Crimson Ink</option>
            </select>
          </div>

          <div className="col-span-12">
            <label className="block text-[10px] font-mono uppercase text-ink-muted mb-0.5">Words of Commendation:</label>
            <textarea
              required
              rows={2}
              value={gbMessage}
              onChange={(e) => setGbMessage(e.target.value)}
              placeholder="Praise, notes, or reviews of Abhishek's portfolio..."
              className="w-full bg-paper border border-ink/15 rounded-sm p-1.5 text-xs text-ink focus:outline-none focus:border-vintage-gold resize-none"
            />
          </div>

          <div className="col-span-12 flex justify-end pt-1">
            <button
              type="submit"
              disabled={isLiningUp}
              className="px-4 py-1.5 bg-vintage-teal text-paper font-serif-display font-semibold text-xs uppercase tracking-wide rounded hover:bg-vintage-teal/90 shadow-sm cursor-pointer"
            >
              {isLiningUp ? "Writing..." : "Sign Ledger"}
            </button>
          </div>
        </form>

        {/* Scrollable Register Ledger Entries */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3.5 border-b border-dashed ${getInkColorClass(entry.inkColor)}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-display text-base font-bold italic leading-none">
                      {entry.name}
                    </span>
                    {entry.organization && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-black/5 rounded-sm select-none">
                        {entry.organization}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[9px] opacity-60">
                    {entry.timestamp}
                  </span>
                </div>

                <p className="font-serif-body text-sm leading-relaxed italic pr-2">
                  "{entry.message}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {entries.length === 0 && (
            <div className="py-12 text-center text-ink-muted italic font-serif-body text-sm">
              The Ledger is currently blank. Be the first honorable visitor to sign!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
