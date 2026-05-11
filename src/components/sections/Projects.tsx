// portfolio/src/components/sections/Projects.tsx
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  X,
} from 'lucide-react';
import { easing, useReducedMotion } from '../../lib/animations';
import { SectionHeading } from '../primitives/SectionHeading';
import { ProjectVisual } from './ProjectVisual';
import {
  ACCENT_BG_MUTED,
  ACCENT_BORDER_HOVER,
  ACCENT_GLOW_STYLE,
  ACCENT_TEXT,
  PROJECTS,
  type Accent,
  type Project,
} from '../../data/projects';
import { cn } from '../../lib/cn';

/* ─────────────────────────────────────────────
   ProjectCard — the tilting bento cell.

   3D tilt is driven by a pair of motion values
   (mouseX, mouseY) updated on mousemove, fed
   through useTransform to map [0,1] → degrees,
   and smoothed via useSpring so the card returns
   to flat with inertia rather than a hard snap.
   ───────────────────────────────────────────── */

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  className?: string;
}

function ProjectCard({ project, onOpen, className }: ProjectCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rxRaw = useTransform(mouseY, [0, 1], [5, -5]);
  const ryRaw = useTransform(mouseX, [0, 1], [-5, 5]);
  const rotateX = useSpring(rxRaw, { stiffness: 240, damping: 28, mass: 0.7 });
  const rotateY = useSpring(ryRaw, { stiffness: 240, damping: 28, mass: 0.7 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    if (reduced) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.55, ease: easing.spring }}
      style={
        reduced
          ? undefined
          : {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }
      }
      data-cursor="hover"
      aria-label={`${project.name} — open project details`}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-xl text-left',
        'border border-border-subtle bg-surface-1',
        'transition-colors duration-300',
        ACCENT_BORDER_HOVER[project.accent],
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: ACCENT_GLOW_STYLE[project.accent] }}
      />

      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-0 right-0',
          'transition-opacity duration-500',
          'opacity-[0.10] group-hover:opacity-[0.55]',
          ACCENT_TEXT[project.accent],
          project.featured ? 'h-[55%] w-[75%]' : 'h-[58%] w-[70%]',
        )}
      >
        <ProjectVisual type={project.visual} className="h-full w-full" />
      </div>

      <div
        className={cn(
          'relative z-10 flex h-full flex-col justify-between',
          project.featured ? 'p-7 md:p-9' : 'p-6 md:p-7',
        )}
      >
        <div>
          <div className="mb-4 flex items-start justify-between md:mb-5">
            <span className="font-mono text-micro uppercase tracking-widest text-text-tertiary">
              {project.number} / Project
            </span>
            <ArrowUpRight
              size={18}
              aria-hidden
              className="shrink-0 text-text-secondary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
            />
          </div>

          <h3
            className={cn(
              'font-semibold leading-[1.1] tracking-tight text-text-primary',
              project.featured ? 'text-h2' : 'text-h3',
            )}
          >
            {project.name}
          </h3>

          <p
            className={cn(
              'mt-3 leading-relaxed text-text-secondary md:mt-4',
              project.featured ? 'max-w-[42ch] text-body-lg' : 'text-small',
            )}
          >
            {project.tagline}
          </p>
        </div>

        <ul className="mt-6 flex flex-wrap gap-1.5 md:mt-8">
          {project.stack.slice(0, project.featured ? 6 : 3).map((s) => (
            <li
              key={s}
              className="rounded-full border border-border-subtle bg-bg/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-text-secondary backdrop-blur-sm"
            >
              {s}
            </li>
          ))}
          {project.stack.length > (project.featured ? 6 : 3) && (
            <li className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              +{project.stack.length - (project.featured ? 6 : 3)}
            </li>
          )}
        </ul>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   ProjectDetailModal — fullscreen overlay with
   the full project deep-dive. Body scroll lock,
   ESC-to-close, click-backdrop-to-close.
   ───────────────────────────────────────────── */

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: easing.smooth }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-bg-deep/80 backdrop-blur-glass"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}-title`}
    >
      <div className="min-h-full px-gutter py-12 md:py-20">
        <motion.article
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.3, ease: easing.spring }}
          onClick={(e) => e.stopPropagation()}
          className="surface-card relative mx-auto max-w-3xl overflow-hidden"
        >
          <div
            className={cn(
              'relative h-44 w-full overflow-hidden md:h-64',
              ACCENT_BG_MUTED[project.accent],
            )}
          >
            <div
              aria-hidden
              className={cn(
                'absolute inset-x-10 inset-y-6 md:inset-x-14 md:inset-y-10',
                ACCENT_TEXT[project.accent],
              )}
            >
              <ProjectVisual type={project.visual} className="h-full w-full" />
            </div>
            <button
              onClick={onClose}
              aria-label="Close project details"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-1/80 text-text-primary backdrop-blur-sm transition-colors duration-250 hover:border-accent hover:text-accent"
            >
              <X size={16} aria-hidden />
            </button>
          </div>

          <div className="p-6 md:p-10">
            <div className="font-mono text-micro uppercase tracking-widest text-text-secondary">
              <span className={ACCENT_TEXT[project.accent]}>
                {project.number}
              </span>{' '}
              / Project deep-dive
            </div>

            <h2
              id={`project-${project.id}-title`}
              className="mt-3 text-h2 font-semibold tracking-tight text-text-primary"
            >
              {project.name}
            </h2>

            <p className="mt-5 max-w-prose text-body-lg leading-relaxed text-text-secondary">
              {project.description}
            </p>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border-subtle bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-text-secondary"
                >
                  {s}
                </li>
              ))}
            </ul>

            {(project.live || project.github) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent-muted px-4 py-2 text-small font-medium text-accent transition-colors duration-250 hover:bg-accent hover:text-text-primary"
                  >
                    <ExternalLink size={14} aria-hidden />
                    Visit live
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-2 text-small font-medium text-text-primary transition-colors duration-250 hover:border-text-primary"
                  >
                    <Github size={14} aria-hidden />
                    Source
                  </a>
                )}
              </div>
            )}

            <div className="mt-10 space-y-9">
              <DetailSection title="Context" body={project.context} />
              <DetailSection
                title="Architecture"
                bullets={project.architecture}
                accent={project.accent}
              />
              <DetailSection
                title="Outcomes"
                bullets={project.outcomes}
                accent={project.accent}
              />
            </div>
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
}

interface DetailSectionProps {
  title: string;
  body?: string;
  bullets?: ReadonlyArray<string>;
  accent?: Accent;
}

function DetailSection({
  title,
  body,
  bullets,
  accent = 'accent',
}: DetailSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span aria-hidden className="h-px w-6 bg-border" />
        <h3 className="font-mono text-micro uppercase tracking-widest text-text-secondary">
          {title}
        </h3>
      </div>
      {body && (
        <p className="text-body leading-relaxed text-text-secondary">{body}</p>
      )}
      {bullets && (
        <ul className="space-y-3 text-body leading-relaxed text-text-secondary">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span
                aria-hidden
                className={cn(
                  'mt-[10px] h-1 w-1 shrink-0 rounded-full',
                  accent === 'accent' && 'bg-accent',
                  accent === 'teal' && 'bg-teal',
                  accent === 'amber' && 'bg-amber',
                )}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   Projects — section composition with bento grid.
   Grid responsive shape:
     mobile:   1 col, 4 rows (stack)
     md:       2 cols, mixed
     xl:       4 cols × 2 rows, asymmetric
   ───────────────────────────────────────────── */

export function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <section
      id="work"
      aria-label="Projects"
      className="relative w-full bg-bg py-section"
    >
      <div className="mx-auto w-full max-w-content px-gutter">
        <SectionHeading
          number="03"
          eyebrow="Selected Work"
          title="Things I&rsquo;ve built that I&rsquo;d still ship today."
          description="A small set of recent projects across infrastructure tooling, full-stack web, and data pipelines. Click any card for the deep-dive."
        />

        <div className="perspective-1000">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[280px] xl:grid-cols-4 xl:grid-rows-2 xl:auto-rows-[300px]">
            <ProjectCard
              project={PROJECTS[0]}
              onOpen={setOpenProject}
              className="md:col-span-2 md:row-span-1 xl:col-span-2 xl:row-span-2"
            />
            <ProjectCard
              project={PROJECTS[1]}
              onOpen={setOpenProject}
              className="md:col-span-1 xl:col-span-2 xl:row-start-1"
            />
            <ProjectCard
              project={PROJECTS[2]}
              onOpen={setOpenProject}
              className="md:col-span-1 xl:col-start-3 xl:row-start-2"
            />
            <ProjectCard
              project={PROJECTS[3]}
              onOpen={setOpenProject}
              className="md:col-span-2 xl:col-span-1 xl:col-start-4 xl:row-start-2"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 md:mt-12">
          <p className="font-mono text-micro uppercase tracking-widest text-text-secondary">
            <span className="text-accent">{PROJECTS.length}</span> shown · More
            side projects on{' '}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-text-primary underline-offset-4 hover:text-accent hover:underline"
            >
              GitHub
            </a>
          </p>
          <a
            href="/projects"
            className="group inline-flex items-center gap-2 text-small font-medium text-text-primary transition-colors duration-250 hover:text-accent"
          >
            View all projects
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectDetailModal
            key={openProject.id}
            project={openProject}
            onClose={() => setOpenProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
