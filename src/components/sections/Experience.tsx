// portfolio/src/components/sections/Experience.tsx
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { easing, useReducedMotion } from '../../lib/animations';
import { SectionHeading } from '../primitives/SectionHeading';
import { cn } from '../../lib/cn';

/* GSAP plugin registration is idempotent — safe to call at module scope. */
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Data + palette
   ───────────────────────────────────────────── */

type RoleType = 'infra' | 'fullstack' | 'research';

interface TypePalette {
  text: string;
  bg: string;
  border: string;
  ring: string;
}

const TYPE_PALETTE: Record<RoleType, TypePalette> = {
  infra: {
    text: 'text-teal',
    bg: 'bg-teal',
    border: 'border-teal/30',
    ring: 'shadow-glow-teal',
  },
  fullstack: {
    text: 'text-accent',
    bg: 'bg-accent',
    border: 'border-accent/30',
    ring: 'shadow-glow-accent',
  },
  research: {
    text: 'text-amber',
    bg: 'bg-amber',
    border: 'border-amber/30',
    ring: '',
  },
};

const TYPE_LABEL: Record<RoleType, string> = {
  infra: 'Infrastructure',
  fullstack: 'Full-stack',
  research: 'Research',
};

interface RoleEntry {
  id: string;
  company: string;
  title: string;
  dates: string;
  location: string;
  type: RoleType;
  /** Short text shown inside the logo placeholder square. */
  logoText: string;
  bullets: ReadonlyArray<string>;
  /** Mark the most recent role to render the pulsing "Now" badge. */
  current?: boolean;
}

const ROLES: ReadonlyArray<RoleEntry> = [
  {
    id: 'genx-ai',
    company: 'Genx AI',
    title: 'Full-Stack Software Engineer',
    dates: '2024 — Present',
    location: 'Chicago, IL',
    type: 'fullstack',
    logoText: 'GX',
    current: true,
    bullets: [
      'Building production AI-adjacent web tooling on a TypeScript and Python stack — frontend in React, backend services on FastAPI behind an AWS API Gateway.',
      'Designed asynchronous job runners and data-ingestion pipelines that absorb bursty workloads without coupling user-facing latency to backend processing.',
      'Owning the design-system primitives shared across multiple internal products, with a focus on accessible, themeable components that ship faster than they break.',
    ],
  },
  {
    id: 'tek-labs',
    company: 'Tek Labs',
    title: 'Software Engineer',
    dates: '2023 — 2024',
    location: 'Chicago, IL',
    type: 'fullstack',
    logoText: 'TL',
    bullets: [
      'Developed full-stack web applications in React, Node.js, and PostgreSQL for internal data tooling and customer dashboards.',
      'Designed and shipped versioned REST APIs with OpenAPI contracts and contract tests, so frontend and backend could move independently without breaking each other.',
      'Containerized services with Docker and deployed to AWS (ECS + RDS), cutting environment setup time for new contributors from a half-day to under an hour.',
    ],
  },
  {
    id: 'iit-chicago',
    company: 'Illinois Institute of Technology',
    title: 'Graduate Researcher · Teaching Assistant',
    dates: '2022 — 2024',
    location: 'Chicago, IL',
    type: 'research',
    logoText: 'IIT',
    bullets: [
      "Earned a Master's in Computer Science with coursework spanning distributed systems, operating systems, and applied machine learning.",
      'Contributed to a faculty-led research project on systems performance — prototyping benchmarking tooling and writing up results for internal review.',
      "TA'd an undergraduate systems course: held office hours, graded assignments, and mentored students through their first OS-level projects.",
    ],
  },
  {
    id: 'tcs',
    company: 'Tata Consultancy Services',
    title: 'Systems & Infrastructure Engineer',
    dates: '2020 — 2022',
    location: 'India',
    type: 'infra',
    logoText: 'TCS',
    bullets: [
      'Operated and maintained 24/7 production data-center infrastructure for enterprise clients, owning incident triage, escalation, and post-mortems.',
      'Automated routine network and server provisioning workflows in Python and Bash, reducing manual interventions for the team.',
      "Co-authored runbooks and on-call procedures that became the team's standard reference for new joiners.",
    ],
  },
];

/* ─────────────────────────────────────────────
   RoleCard — header always visible, bullets in
   an AnimatePresence height-collapse.
   ───────────────────────────────────────────── */

interface RoleCardProps {
  role: RoleEntry;
  isOpen: boolean;
  onToggle: () => void;
}

function RoleCard({ role, isOpen, onToggle }: RoleCardProps) {
  const palette = TYPE_PALETTE[role.type];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.55, ease: easing.spring }}
      className={cn(
        'surface-card overflow-hidden transition-colors duration-300',
        isOpen
          ? 'border-border-strong'
          : 'hover:border-border-strong',
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`role-${role.id}-content`}
        className="group flex w-full items-start gap-4 p-5 text-left md:gap-5 md:p-6"
      >
        {/* Logo placeholder */}
        <div
          aria-hidden
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-md border bg-bg',
            'font-mono text-[11px] font-semibold tracking-wider',
            'transition-colors duration-300',
            palette.text,
            palette.border,
          )}
        >
          {role.logoText}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-h3 font-semibold leading-tight text-text-primary">
              {role.company}
            </h3>
            {role.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-teal">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-teal"
                />
                Now
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-body text-text-primary">{role.title}</span>
            <span aria-hidden className="text-text-tertiary">
              ·
            </span>
            <span className="font-mono text-small text-text-secondary">
              {role.dates}
            </span>
            <span aria-hidden className="text-text-tertiary">
              ·
            </span>
            <span className="font-mono text-small text-text-tertiary">
              {role.location}
            </span>
          </div>

          <div
            className={cn(
              'mt-2.5 inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-widest',
              palette.text,
            )}
          >
            <span
              aria-hidden
              className={cn('h-1 w-1 rounded-full', palette.bg)}
            />
            {TYPE_LABEL[role.type]}
          </div>
        </div>

        <ChevronDown
          size={18}
          aria-hidden
          className={cn(
            'mt-1 shrink-0 transition-transform duration-300',
            isOpen
              ? 'rotate-180 text-accent'
              : 'text-text-secondary group-hover:text-text-primary',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`role-${role.id}-content`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easing.spring }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-subtle px-5 pb-5 pt-5 md:px-6 md:pb-6">
              <ul className="space-y-3 text-body leading-relaxed text-text-secondary">
                {role.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        'mt-[10px] h-1 w-1 shrink-0 rounded-full',
                        palette.bg,
                      )}
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   Experience — section composition + GSAP line draw.
   ───────────────────────────────────────────── */

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const reduced = useReducedMotion();

  // Most recent role open by default; '' means all collapsed.
  const [activeId, setActiveId] = useState<string>(ROLES[0]?.id ?? '');

  /* GSAP-driven line-draw.
     Why GSAP here (vs. Framer Motion's pathLength)?
       - Per the project's prescribed stack, ScrollTrigger handles all
         scroll-driven scrubs.
       - It's the ONLY animation system touching this <line> — no
         conflict with the Framer Motion-controlled cards/dots.
     We measure container height to set strokeDasharray in pixels, and
     re-evaluate on refresh so resizes don't desync the draw. */
  useEffect(() => {
    const line = lineRef.current;
    const container = containerRef.current;
    if (!line || !container) return;

    if (reduced) {
      line.style.strokeDasharray = 'none';
      line.style.strokeDashoffset = '0';
      return;
    }

    const ctx = gsap.context(() => {
      const setDashState = () => {
        const height = container.getBoundingClientRect().height;
        gsap.set(line, { strokeDasharray: height });
      };
      setDashState();

      gsap.fromTo(
        line,
        {
          strokeDashoffset: () =>
            container.getBoundingClientRect().height,
        },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            end: 'bottom 80%',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: setDashState,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative w-full bg-bg py-section"
    >
      <div className="mx-auto w-full max-w-content px-gutter">
        <SectionHeading
          number="02"
          eyebrow="Experience"
          title="Where the work has happened."
          description="Four roles across infrastructure, research, and full-stack engineering — from the data-center floor to AI-adjacent product surfaces."
        />

        <div ref={containerRef} className="relative">
          {/* Timeline rail — two stacked <line>s in one SVG.
              Lower line is the static "track"; upper line is the
              GSAP-animated foreground. */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-[11px] h-full w-[2px] md:left-[19px]"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              strokeWidth="2"
              className="stroke-border-subtle"
            />
            <line
              ref={lineRef}
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              strokeWidth="2"
              className="stroke-accent"
            />
          </svg>

          <ol className="relative space-y-8 md:space-y-10">
            {ROLES.map((role) => {
              const palette = TYPE_PALETTE[role.type];
              const isOpen = activeId === role.id;
              return (
                <li key={role.id} className="flex gap-4 md:gap-8">
                  {/* Dot rail */}
                  <div className="relative flex w-6 shrink-0 justify-center pt-6 md:w-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-25% 0px' }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 22,
                        delay: 0.15,
                      }}
                      className="relative"
                    >
                      {/* Glow halo for the current role */}
                      {role.current && (
                        <div
                          aria-hidden
                          className={cn(
                            'absolute -inset-2 rounded-full opacity-50 blur-md',
                            palette.bg,
                          )}
                        />
                      )}
                      <div
                        aria-hidden
                        className={cn(
                          'relative h-2.5 w-2.5 rounded-full ring-4 ring-bg',
                          palette.bg,
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <RoleCard
                      role={role}
                      isOpen={isOpen}
                      onToggle={() => setActiveId(isOpen ? '' : role.id)}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Closing micro-cap line */}
        <div className="mt-12 flex items-center gap-3 md:mt-16">
          <span aria-hidden className="h-px w-8 bg-border" />
          <span className="font-mono text-micro uppercase tracking-widest text-text-tertiary">
            Earlier roles available on request
          </span>
        </div>
      </div>
    </section>
  );
}
