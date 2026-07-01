import { useState } from 'react';
import { SKILL_CATEGORIES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, PenTool, ClipboardList, Info } from 'lucide-react';

export default function Toolbox() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState<any>(SKILL_CATEGORIES[0].skills[0]);

  const activeCategory = SKILL_CATEGORIES[activeCategoryIndex];

  return (
    <div className="w-full flex flex-col border border-ink/30 rounded bg-paper-dark/30 p-4 md:p-6 shadow-sm" id="toolbox">
      {/* Editorial Category Title */}
      <div className="border-b border-ink/20 pb-3 mb-4">
        <h3 className="font-serif-display text-2xl font-bold tracking-tight text-vintage-teal flex items-center gap-2">
          <Compass className="w-5 h-5 text-vintage-gold" />
          The Cabinet of Technologies
        </h3>
        <p className="font-serif-body text-sm text-ink-muted italic">
          An interactive inventory of language, server-side frameworks, and presentation engines.
        </p>
      </div>

      {/* Mechanical Category Toggles */}
      <div className="grid grid-cols-2 gap-2 mb-6 border-b border-ink/10 pb-4">
        {SKILL_CATEGORIES.map((category, index) => (
          <button
            key={category.title}
            onClick={() => {
              setActiveCategoryIndex(index);
              setSelectedSkill(category.skills[0]);
            }}
            className={`flex flex-col items-center justify-center p-3 border rounded text-center transition-all cursor-pointer ${
              activeCategoryIndex === index
                ? 'bg-vintage-teal text-paper border-vintage-teal shadow-inner'
                : 'bg-paper hover:bg-paper-dark border-ink/20 text-ink'
            }`}
          >
            <span className="font-serif-display text-sm font-semibold tracking-wide uppercase">
              {category.title}
            </span>
            <span className={`text-[10px] font-mono mt-0.5 ${activeCategoryIndex === index ? 'text-paper/80' : 'text-ink-muted'}`}>
              {category.skills.length} Instruments
            </span>
          </button>
        ))}
      </div>

      {/* Grid: Mechanical sliding brass gauges on the left, Detailed ledger card on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Gauges (8 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="text-xs font-mono uppercase text-ink-muted flex items-center justify-between px-1">
            <span>Instrument Calibration</span>
            <span>proficiency level (shillings / 100)</span>
          </div>

          <div className="space-y-4">
            {activeCategory.skills.map((skill) => {
              const isSelected = selectedSkill?.name === skill.name;
              return (
                <div
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-paper border-vintage-gold shadow-md translate-x-1'
                      : 'bg-paper/50 hover:bg-paper border-ink/10 hover:border-ink/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-serif-display text-base font-bold text-ink">
                      {skill.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-vintage-gold">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Traditional Meter: Styled like an antique sliding brass rule */}
                  <div className="h-3.5 w-full bg-paper-dark border border-ink/20 rounded-sm relative overflow-hidden flex items-center">
                    {/* Tick Marks resembling physical ruler markings */}
                    <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-30 text-[8px] font-mono select-none">
                      <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                    </div>

                    {/* Filling the bar with a rich gold/brass metallic layout */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-linear-to-r from-vintage-gold/80 to-vintage-gold relative border-r border-ink/50"
                    >
                      {/* Brass slider knot indicator */}
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-vintage-red shadow-sm border-l border-ink/40"></div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Ledger Card (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <AnimatePresence mode="wait">
            {selectedSkill && (
              <motion.div
                key={selectedSkill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border-2 border-dashed border-vintage-gold/50 rounded bg-paper p-4 h-full relative shadow-sm"
              >
                {/* Vintage Wax Seal Decal */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-vintage-red/15 border border-vintage-red/40 flex items-center justify-center text-vintage-red font-serif-display font-bold text-[10px] select-none rotate-12">
                  SEAL
                </div>

                <div className="flex items-center gap-2 text-vintage-gold mb-3 border-b border-ink/10 pb-2">
                  <Feather className="w-4 h-4" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">Craftsman's Ledger Entry</span>
                </div>

                <h4 className="font-serif-display text-xl font-bold text-ink leading-tight mb-2">
                  {selectedSkill.name}
                </h4>

                <p className="font-serif-body text-sm text-ink-muted leading-relaxed mb-4 italic">
                  "{selectedSkill.detail}"
                </p>

                {/* Narrative context explaining traditional craft usage */}
                <div className="border-t border-ink/10 pt-3 text-xs space-y-2">
                  <div className="flex items-start gap-1.5 text-vintage-teal">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="font-mono leading-normal">
                      {selectedSkill.name === "Laravel Framework" && "Used to compile complex logical matrices into streamlined API servers. Promotes clean repositories, structured service providers, and atomic MySQL/Postgres transactions."}
                      {selectedSkill.name === "PHP (Modern 8.x)" && "Applied with object-oriented rigor. Enforces absolute type safety, utilizes attributes, handles asynchronous background processes, and minimizes memory leak pathways."}
                      {selectedSkill.name === "Database Engineering" && "Focuses on optimal index tables, relational foreign key structures, and transactional write safeguards to avoid state rot or split-ledger errors."}
                      {selectedSkill.name === "REST & GraphQL APIs" && "Architected with secure rate-limits and consistent payload formats, creating solid links to front-end consumer engines."}
                      {selectedSkill.name === "React & Next.js" && "Crafted with modular functional components. Minimizes virtual DOM repaint overheads, creates isolated reactive scopes, and encapsulates external APIs."}
                      {selectedSkill.name === "Vue.js & Nuxt" && "Utilized for real-time reactivity in admin cabinets. Composition API offers highly maintainable schemas, unified store states, and perfect DOM sync."}
                      {selectedSkill.name === "Tailwind CSS" && "Configured with strict theme constraints to maintain traditional typesetting consistency without bloated external styling sheets."}
                      {selectedSkill.name === "TypeScript" && "Introduced to form immutable contract types, preventing runtime null reference errors or unstable frontend behaviors."}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Simple Helper feather icon
function Feather(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}
