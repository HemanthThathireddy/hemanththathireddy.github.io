// portfolio/src/components/sections/About.tsx
import { motion, type Variants } from 'framer-motion';
import {
  easing,
  fadeUpItem,
  staggerContainer,
  useScrollReveal,
} from '../../lib/animations';
import { useCountUp } from '../../lib/useCountUp';
import { SectionHeading } from '../primitives/SectionHeading';
import { cn } from '../../lib/cn';

/* ─────────────────────────────────────────────
   Static content. Module-scoped so references
   stay stable across renders (matters for the
   stagger container's children list).
   ───────────────────────────────────────────── */

interface Stat {
  target: number;
  label: string;
  sublabel: string;
  suffix?: string;
}

const STATS: ReadonlyArray<Stat> = [
  { target: 3, label: 'Years', sublabel: 'building software', suffix: '+' },
  { target: 10, label: 'Projects', sublabel: 'shipped to production', suffix: '+' },
  { target: 5, label: 'Stacks', sublabel: 'across cloud and web' },
];

type TagCategory = 'frontend' | 'backend' | 'data' | 'cloud' | 'systems';

interface Tag {
  label: string;
  category: TagCategory;
}

const TAGS: ReadonlyArray<Tag> = [
  { label: 'TypeScript', category: 'frontend' },
  { label: 'React', category: 'frontend' },
  { label: 'Next.js', category: 'frontend' },
  { label: 'Tailwind', category: 'frontend' },
  { label: 'Node.js', category: 'backend' },
  { label: 'Python', category: 'backend' },
  { label: 'Java', category: 'backend' },
  { label: 'Spring Boot', category: 'backend' },
  { label: 'PostgreSQL', category: 'data' },
  { label: 'Redis', category: 'data' },
  { label: 'AWS', category: 'cloud' },
  { label: 'Docker', category: 'cloud' },
  { label: 'Kubernetes', category: 'cloud' },
  { label: 'Terraform', category: 'cloud' },
  { label: 'Linux', category: 'systems' },
  { label: 'Git', category: 'systems' },
];

const CATEGORY_DOT: Record<TagCategory, string> = {
  frontend: 'bg-accent',
  backend: 'bg-amber',
  data: 'bg-text-tertiary',
  cloud: 'bg-teal',
  systems: 'bg-text-secondary',
};

/* Spring-physics variant for tag entry. Defined here (not in animations.ts)
   because it's specific to this section's feel — heavy bounce. */
const tagItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 320, damping: 20, mass: 0.7 },
  },
};

const tagContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

/* ─────────────────────────────────────────────
   Avatar — initials placeholder. Wrapped in a
   group so the box-shadow glow + ring color
   transition together on hover.
   ───────────────────────────────────────────── */
function Avatar() {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="group relative h-16 w-16 shrink-0 md:h-20 md:w-20"
    >
      {/* Soft outer glow on hover */}
      <div
        aria-hidden
        className="absolute -inset-3 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(108,99,255,0.55), transparent 70%)',
        }}
      />
      {/* Inner disc */}
      <div
        className={cn(
          'relative grid h-full w-full place-items-center overflow-hidden rounded-full',
          'border border-border bg-gradient-to-br from-surface-2 to-surface-1',
          'transition-colors duration-500 group-hover:border-accent',
        )}
      >
        <span className="font-serif text-2xl italic text-text-primary md:text-3xl">
          HT
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   StatCounter — fades up via parent stagger and
   ticks 0 → target via useCountUp once the row
   enters view. The two animations layer cleanly:
   fade settles ~0.6s, count finishes ~1.4s.
   ───────────────────────────────────────────── */
interface StatCounterProps {
  stat: Stat;
  enabled: boolean;
}

function StatCounter({ stat, enabled }: StatCounterProps) {
  const value = useCountUp(stat.target, { enabled, duration: 1400 });
  const display = String(value).padStart(2, '0');

  return (
    <motion.div
      variants={fadeUpItem}
      className="border-l border-border-subtle pl-5 md:pl-6"
    >
      <div className="flex items-baseline gap-1.5">
        <span className="font-sans text-h1 font-semibold tabular-nums tracking-tight text-text-primary">
          {display}
        </span>
        {stat.suffix && (
          <span className="font-sans text-h3 font-semibold text-accent">
            {stat.suffix}
          </span>
        )}
      </div>
      <div className="mt-2 font-mono text-micro uppercase tracking-widest text-text-secondary">
        {stat.label}{' '}
        <span className="text-text-tertiary">/ {stat.sublabel}</span>
      </div>
    </motion.div>
  );
}

function StatsRow() {
  const { ref, inView } = useScrollReveal<HTMLDivElement>({
    once: true,
    amount: 0.4,
  });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
    >
      {STATS.map((stat) => (
        <StatCounter key={stat.label} stat={stat} enabled={inView} />
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TagCloud — flex-wrap of pills with category
   dots. Each pill springs in via stagger; on
   hover, lifts and gains an accent border.
   ───────────────────────────────────────────── */
function TagCloud() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.5, ease: easing.spring }}
        className="mb-5 flex items-center gap-3"
      >
        <span aria-hidden className="h-px w-8 bg-border" />
        <span className="font-mono text-micro uppercase tracking-widest text-text-secondary">
          Stack &amp; Tools
        </span>
      </motion.div>
      <motion.ul
        variants={tagContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {TAGS.map((tag) => (
          <motion.li
            key={tag.label}
            variants={tagItem}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3.5 py-1.5',
              'text-small font-medium text-text-primary',
              'transition-colors duration-250',
              'hover:border-accent hover:bg-accent-muted',
              'cursor-default',
            )}
          >
            <span
              aria-hidden
              className={cn('h-1.5 w-1.5 rounded-full', CATEGORY_DOT[tag.category])}
            />
            {tag.label}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PullQuote — large editorial italic with a
   small mono caption underneath. The blockquote
   itself is the anchor for visual weight.
   ───────────────────────────────────────────── */
function PullQuote() {
  return (
    <motion.figure
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
      className="relative"
    >
      <motion.span
        aria-hidden
        variants={fadeUpItem}
        className="absolute -left-1 -top-8 font-serif text-7xl leading-none text-accent/30 md:-top-12 md:text-8xl"
      >
        &ldquo;
      </motion.span>
      <motion.blockquote
        variants={fadeUpItem}
        className="relative font-serif text-pull italic leading-snug text-text-primary text-balance"
      >
        Good infrastructure is the kind you forget exists — until it
        doesn&rsquo;t, and then it&rsquo;s the only thing that matters.
      </motion.blockquote>
      <motion.figcaption
        variants={fadeUpItem}
        className="mt-6 flex items-center gap-3"
      >
        <span aria-hidden className="h-px w-6 bg-text-tertiary" />
        <span className="font-mono text-micro uppercase tracking-widest text-text-secondary">
          A working principle
        </span>
      </motion.figcaption>
    </motion.figure>
  );
}

/* ─────────────────────────────────────────────
   BioBlock — avatar header + 3 paragraphs.
   First-person voice, mentions every real role
   (TCS, IIT Chicago, Tek Labs, Genx AI).
   ───────────────────────────────────────────── */
function BioBlock() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
    >
      <motion.div
        variants={fadeUpItem}
        className="mb-8 flex items-center gap-4"
      >
        <Avatar />
        <div>
          <div className="text-body font-medium text-text-primary md:text-body-lg">
            Hemanth Thathireddy
          </div>
          <div className="font-mono text-micro uppercase tracking-widest text-text-secondary">
            Engineer · Chicago, IL
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUpItem}
        className="space-y-5 text-body leading-relaxed text-text-secondary [&>p>strong]:font-medium [&>p>strong]:text-text-primary"
      >
        <p>
          I&rsquo;m a full-stack engineer based in Chicago. My work moves
          between two altitudes — I started in enterprise data centers at{' '}
          <strong>TCS</strong>, racking and routing the boring metal that
          everything else depends on, and I&rsquo;ve spent the last few years
          climbing the stack into build pipelines, internal platforms, and
          the applications people actually see.
        </p>
        <p>
          I hold a Master&rsquo;s in Computer Science from{' '}
          <strong>Illinois Institute of Technology</strong>, and have shipped
          production code at <strong>TCS</strong>, <strong>IIT Chicago</strong>,{' '}
          <strong>Tek Labs</strong>, and <strong>Genx&nbsp;AI</strong> — touching
          everything from BGP routing tables to React render trees.
        </p>
        <p>
          What I care about most is the seam where reliability meets
          developer experience: the difference between a system that works
          and a system people enjoy working on.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   About — section composition. py-section gives
   the same vertical rhythm as every other section.
   ───────────────────────────────────────────── */
export function About() {
  return (
    <section
      id="about"
      aria-label="About Hemanth"
      className="relative w-full bg-bg py-section"
    >
      <div className="mx-auto w-full max-w-content px-gutter">
        <SectionHeading
          number="01"
          eyebrow="About"
          title="A profile, in three altitudes."
          description="From the data-center floor to the browser — what I do, where I&rsquo;ve done it, and the tools I reach for first."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <PullQuote />
          </div>
          <div className="lg:col-span-7">
            <BioBlock />
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden
          className="my-16 h-px w-full bg-border-subtle md:my-20"
        />

        <StatsRow />

        {/* Divider */}
        <div
          aria-hidden
          className="my-16 h-px w-full bg-border-subtle md:my-20"
        />

        <TagCloud />
      </div>
    </section>
  );
}
