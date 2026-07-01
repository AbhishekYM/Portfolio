import { TIMELINE_HISTORY, TimelineEvent } from '../types';
import { Award, Briefcase, Bookmark, Milestone } from 'lucide-react';
import { motion } from 'motion/react';

export default function ChronicleTimeline() {
  return (
    <div className="w-full flex flex-col border border-ink/30 rounded bg-paper-dark/20 p-4 md:p-6 shadow-sm" id="chronicle-timeline">
      {/* Title */}
      <div className="border-b border-ink/20 pb-3 mb-6">
        <h3 className="font-serif-display text-2xl font-bold tracking-tight text-ink uppercase flex items-center gap-2">
          <Milestone className="w-5 h-5 text-vintage-red" />
          The Chronicle of Experience
        </h3>
        <p className="font-serif-body text-xs text-ink-muted italic">
          An itemized chronology of professional stations and educational breakthroughs.
        </p>
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative border-l-2 border-ink/20 ml-3 md:ml-6 pl-6 md:pl-8 space-y-8 py-2">
        {TIMELINE_HISTORY.map((event, index) => {
          const isExp = event.type === 'experience';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative flex flex-col"
            >
              {/* Timeline Bullet Stamp */}
              <div className="absolute -left-[35px] md:-left-[43px] top-0 w-8 h-8 rounded-full border border-ink/30 bg-paper flex items-center justify-center text-ink shadow-sm">
                {isExp ? (
                  <Briefcase className="w-3.5 h-3.5 text-vintage-teal" />
                ) : (
                  <Award className="w-3.5 h-3.5 text-vintage-red" />
                )}
              </div>

              {/* Event Card */}
              <div className="bg-paper border border-ink/10 rounded-sm p-4 md:p-5 hover:border-vintage-gold hover:shadow-md transition-all">
                {/* Year Badge & Organization */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mb-2 border-b border-ink/5 pb-1.5">
                  <span className="font-mono text-xs font-bold text-vintage-gold uppercase tracking-wider">
                    {event.year}
                  </span>
                  <span className="font-serif-display text-sm font-semibold italic text-vintage-teal">
                    {event.organization}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-serif-display text-lg font-bold text-ink leading-tight mb-2 flex items-center gap-1.5">
                  {event.title}
                  {!isExp && (
                    <span className="text-[10px] uppercase font-mono bg-vintage-red/10 border border-vintage-red/20 px-1.5 py-0.5 rounded-sm text-vintage-red font-normal">
                      Thesis Honors
                    </span>
                  )}
                </h4>

                {/* Narrative description */}
                <p className="font-serif-body text-sm text-ink-muted leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative Signature Ending */}
      <div className="border-t border-ink/10 pt-4 mt-6 text-center">
        <span className="font-serif-display italic text-sm text-ink-muted">
          "Verified for absolute veracity and professional accuracy."
        </span>
      </div>
    </div>
  );
}
