// portfolio/src/pages/ProjectDetail.tsx
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
} from 'lucide-react';
import {
  ACCENT_BG,
  ACCENT_BG_MUTED,
  ACCENT_GROUP_HOVER_TEXT,
  ACCENT_TEXT,
  getNextProject,
  getProjectById,
  type Accent,
} from '../data/projects';
import { ProjectVisual } from '../components/sections/ProjectVisual';
import {
  easing,
  fadeUpItem,
  staggerContainer,
} from '../lib/animations';
import { cn } from '../lib/cn';
import NotFound from './NotFound';

/**
 * /projects/:id — standalone deep-link page.
 *
 * Same content as the in-page modal, but with page chrome:
 * back-to-list link, full-page hero band, and a "next project"
 * footer to encourage browsing. If the id doesn't resolve we
 * render the same <NotFound /> the catch-all route would.
 */
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return <NotFound />;
  }

  const nextProject = getNextProject(project.id);

  return (
    <main className="min-h-dvh bg-bg pb-section pt-24 md:pt-32">
      <div className="mx-auto w-full max-w-content px-gutter">
        <Link
          to="/projects"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-micro uppercase tracking-widest text-text-secondary transition-colors duration-250 hover:text-accent"
        >
          <ArrowLeft
            size={14}
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          All projects
        </Link>

        <motion.article
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUpItem}
            className="flex items-center gap-3"
          >
            <span
              className={cn(
                'font-mono text-micro tracking-widest',
                ACCENT_TEXT[project.accent],
              )}
            >
              {project.number}
            </span>
            <span aria-hidden className="h-px w-10 bg-border" />
            <span className="font-mono text-micro uppercase tracking-widest text-text-secondary">
              Project deep-dive
            </span>
          </motion.div>

          {/* Title + tagline */}
          <motion.h1
            variants={fadeUpItem}
            className="mt-5 text-h1 font-semibold leading-[1.05] tracking-tight text-text-primary"
          >
            {project.name}
          </motion.h1>
          <motion.p
            variants={fadeUpItem}
            className="mt-5 max-w-prose text-body-lg leading-relaxed text-text-secondary"
          >
            {project.tagline}
          </motion.p>

          {/* Stack chips + links */}
          <motion.div
            variants={fadeUpItem}
            className="mt-7 flex flex-wrap items-center gap-2"
          >
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border-subtle bg-surface-1 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-text-secondary"
              >
                {s}
              </span>
            ))}
          </motion.div>

          {(project.live || project.github) && (
            <motion.div
              variants={fadeUpItem}
              className="mt-6 flex flex-wrap gap-3"
            >
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
            </motion.div>
          )}

          {/* Hero visual band */}
          <motion.div
            variants={fadeUpItem}
            className={cn(
              'relative mt-12 h-56 w-full overflow-hidden rounded-xl border border-border-subtle md:h-80',
              ACCENT_BG_MUTED[project.accent],
            )}
          >
            <div
              aria-hidden
              className={cn(
                'absolute inset-x-12 inset-y-8 md:inset-x-20 md:inset-y-12',
                ACCENT_TEXT[project.accent],
              )}
            >
              <ProjectVisual type={project.visual} className="h-full w-full" />
            </div>
          </motion.div>

          {/* Body */}
          <motion.section
            variants={fadeUpItem}
            className="mt-12 max-w-prose"
          >
            <p className="text-body-lg leading-relaxed text-text-secondary">
              {project.description}
            </p>
          </motion.section>

          {/* Detailed sections */}
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <DetailBlock
              title="Context"
              accent={project.accent}
              className="lg:col-span-12"
            >
              <p className="text-body leading-relaxed text-text-secondary">
                {project.context}
              </p>
            </DetailBlock>

            <DetailBlock
              title="Architecture"
              accent={project.accent}
              className="lg:col-span-7"
            >
              <ul className="space-y-3 text-body leading-relaxed text-text-secondary">
                {project.architecture.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        'mt-[10px] h-1 w-1 shrink-0 rounded-full',
                        ACCENT_BG[project.accent],
                      )}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock
              title="Outcomes"
              accent={project.accent}
              className="lg:col-span-5"
            >
              <ul className="space-y-3 text-body leading-relaxed text-text-secondary">
                {project.outcomes.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        'mt-[10px] h-1 w-1 shrink-0 rounded-full',
                        ACCENT_BG[project.accent],
                      )}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </DetailBlock>
          </div>
        </motion.article>

        {/* Next project */}
        <div className="mt-section border-t border-border-subtle pt-10">
          <Link
            to={`/projects/${nextProject.id}`}
            className="group block"
            data-cursor="hover"
          >
            <span className="font-mono text-micro uppercase tracking-widest text-text-secondary">
              Next project
            </span>
            <div className="mt-2 flex items-baseline justify-between gap-4">
              <h3
                className={cn(
                  'text-h2 font-semibold tracking-tight text-text-primary transition-colors duration-300',
                  ACCENT_GROUP_HOVER_TEXT[nextProject.accent],
                )}
              >
                {nextProject.name}
              </h3>
              <ArrowRight
                size={28}
                aria-hidden
                className="shrink-0 text-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-text-primary"
              />
            </div>
            <p className="mt-2 max-w-prose text-body text-text-secondary">
              {nextProject.tagline}
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}

interface DetailBlockProps {
  title: string;
  accent: Accent;
  children: React.ReactNode;
  className?: string;
}

function DetailBlock({ title, children, className }: DetailBlockProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, ease: easing.spring }}
      className={cn('w-full', className)}
    >
      <div className="mb-4 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-border" />
        <h2 className="font-mono text-micro uppercase tracking-widest text-text-secondary">
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}
