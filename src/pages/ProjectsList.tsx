// portfolio/src/pages/ProjectsList.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/primitives/SectionHeading';
import { ProjectVisual } from '../components/sections/ProjectVisual';
import {
  ACCENT_BORDER_HOVER,
  ACCENT_TEXT,
  PROJECTS,
  type Project,
} from '../data/projects';
import { easing } from '../lib/animations';
import { cn } from '../lib/cn';

/**
 * /projects — flat grid of every project.
 *
 * Lightweight cards (no 3D tilt) since the page exists for browsing
 * not showcase. Clicking a card navigates to /projects/:id.
 */
export default function ProjectsList() {
  return (
    <main className="min-h-dvh bg-bg pb-section pt-32 md:pt-40">
      <div className="mx-auto w-full max-w-content px-gutter">
        <Link
          to="/"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-micro uppercase tracking-widest text-text-secondary transition-colors duration-250 hover:text-accent"
        >
          <ArrowLeft
            size={14}
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to home
        </Link>

        <SectionHeading
          number="—"
          eyebrow="Projects · All"
          title="Everything I&rsquo;ve shipped that&rsquo;s worth showing."
          description="The full list. Side projects, work projects (lightly anonymised), and abandoned-but-instructive experiments."
        />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <ProjectListItem key={project.id} project={project} index={i} />
          ))}
        </ul>
      </div>
    </main>
  );
}

interface ProjectListItemProps {
  project: Project;
  index: number;
}

function ProjectListItem({ project, index }: ProjectListItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: easing.spring,
        delay: 0.05 + index * 0.04,
      }}
    >
      <Link
        to={`/projects/${project.id}`}
        data-cursor="hover"
        className={cn(
          'group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-xl',
          'border border-border-subtle bg-surface-1 p-6',
          'transition-colors duration-300',
          ACCENT_BORDER_HOVER[project.accent],
        )}
      >
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 right-0 h-[55%] w-[65%]',
            'opacity-[0.10] transition-opacity duration-500 group-hover:opacity-[0.45]',
            ACCENT_TEXT[project.accent],
          )}
        >
          <ProjectVisual type={project.visual} className="h-full w-full" />
        </div>

        <div className="relative">
          <div className="mb-3 flex items-start justify-between">
            <span className="font-mono text-micro uppercase tracking-widest text-text-tertiary">
              {project.number} / Project
            </span>
            <ArrowUpRight
              size={16}
              aria-hidden
              className="shrink-0 text-text-secondary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
            />
          </div>
          <h2 className="text-h3 font-semibold leading-tight text-text-primary">
            {project.name}
          </h2>
          <p className="mt-3 text-small leading-relaxed text-text-secondary">
            {project.tagline}
          </p>
        </div>

        <ul className="relative mt-6 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <li
              key={s}
              className="rounded-full border border-border-subtle bg-bg/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-text-secondary"
            >
              {s}
            </li>
          ))}
          {project.stack.length > 4 && (
            <li className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              +{project.stack.length - 4}
            </li>
          )}
        </ul>
      </Link>
    </motion.li>
  );
}
