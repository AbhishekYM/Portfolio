import { useState } from 'react';
import { PROJECTS_ARCHIVE, Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Code, Layers, FileText, Database } from 'lucide-react';

export default function ProjectLedger() {
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS_ARCHIVE[0].id);
  const [showBlueprint, setShowBlueprint] = useState<boolean>(true);

  const activeProject = PROJECTS_ARCHIVE.find(p => p.id === activeProjectId) || PROJECTS_ARCHIVE[0];

  return (
    <div className="w-full flex flex-col border border-ink/30 rounded bg-paper shadow-sm overflow-hidden" id="project-ledger">
      {/* Ledger Header */}
      <div className="bg-paper-dark border-b border-ink/30 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-serif-display text-2xl font-bold tracking-tight text-ink uppercase flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-vintage-red" />
            The Ledger of Works
          </h3>
          <p className="font-serif-body text-xs text-ink-muted italic">
            A verified chronicle of full-stack engineering, compiled from active service records.
          </p>
        </div>

        {/* Traditional Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {PROJECTS_ARCHIVE.map((proj) => (
            <button
              key={proj.id}
              onClick={() => {
                setActiveProjectId(proj.id);
              }}
              className={`px-3 py-1.5 border font-mono text-[10px] uppercase font-bold tracking-wide transition-all cursor-pointer rounded-sm ${
                activeProjectId === proj.id
                  ? 'bg-ink text-paper border-ink shadow-sm'
                  : 'bg-paper/80 hover:bg-paper-dark border-ink/20 text-ink-muted hover:text-ink'
              }`}
            >
              {proj.id.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ledger Book Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 border-b border-ink/20">
        {/* Left Page: Summary & Feature Ledger (7 cols) */}
        <div className="xl:col-span-7 p-5 md:p-8 border-r border-ink/10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-ink/10 pb-3">
              <div>
                <span className="font-mono text-[10px] text-vintage-gold uppercase tracking-wider font-semibold">
                  {activeProject.category} • {activeProject.period}
                </span>
                <h4 className="font-serif-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1 leading-tight">
                  {activeProject.title}
                </h4>
              </div>
            </div>

            <p className="font-serif-body text-base text-ink leading-relaxed dropcap">
              {activeProject.longDescription}
            </p>

            {/* Key Features List - styled like vintage checkboxes */}
            <div className="space-y-3">
              <span className="font-serif-display text-sm font-bold text-vintage-red uppercase tracking-wider block">
                Technical Specifications & Enforcements:
              </span>
              <ul className="space-y-2.5">
                {activeProject.keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="font-mono text-vintage-teal text-xs mt-0.5 select-none shrink-0">
                      [✓]
                    </span>
                    <span className="font-serif-body leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 border-t border-ink/10 pt-6 mt-8">
            {activeProject.stats.map((stat, i) => (
              <div key={i} className="text-center p-2.5 bg-paper-dark/40 border border-ink/5 rounded-sm">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted block">
                  {stat.label}
                </span>
                <span className="font-serif-display text-base md:text-lg font-bold text-vintage-teal block mt-0.5">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Page: Tech Stack Typewriter & Database Blueprints (5 cols) */}
        <div className="xl:col-span-5 p-5 md:p-8 bg-paper-dark/20 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-ink/10 pb-3">
              <span className="font-serif-display text-sm font-bold text-vintage-teal uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-vintage-gold" />
                Relational Architecture
              </span>
              <button
                onClick={() => setShowBlueprint(!showBlueprint)}
                className="font-mono text-[10px] text-vintage-red hover:underline uppercase font-bold cursor-pointer"
              >
                {showBlueprint ? "[ Hide Blueprint ]" : "[ Show Blueprint ]"}
              </button>
            </div>

            {/* Blueprint Section */}
            <AnimatePresence mode="wait">
              {showBlueprint && activeProject.schemaLayout ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <p className="text-xs text-ink-muted mb-2 font-serif-body italic">
                    Below is the visual database mapping showing standard foreign relations inside Abhishek's Laravel migrations:
                  </p>
                  <div className="bg-ink/5 border border-ink/10 rounded-sm p-4 overflow-x-auto font-mono text-[10px] leading-relaxed text-vintage-teal shadow-inner">
                    <pre className="whitespace-pre min-w-[340px]">
                      {activeProject.schemaLayout}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <div className="border border-dashed border-ink/20 rounded p-6 text-center text-ink-muted font-serif-body italic text-sm">
                  Click 'Show Blueprint' above to reveal relational database tables, structural linkages, and data definitions.
                </div>
              )}
            </AnimatePresence>

            {/* Technology Slugs - styled as traditional metal typewriter components */}
            <div className="space-y-3">
              <span className="font-serif-display text-xs font-bold text-ink uppercase tracking-wider block">
                Assembled Technologies:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 font-mono text-[10px] bg-paper border border-ink/20 rounded-sm text-ink uppercase tracking-wider shadow-sm flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-vintage-gold"></span>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-ink/10 pt-4 mt-6 text-xs text-ink-muted font-serif-body italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vintage-red shrink-0"></span>
            <span>Fully offline compatible. Guaranteed strict Laravel schema-validation integrity.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
