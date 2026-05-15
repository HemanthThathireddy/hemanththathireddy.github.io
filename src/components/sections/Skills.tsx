// portfolio/src/components/sections/Skills.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { easing, useScrollReveal } from '../../lib/animations';
import { SectionHeading } from '../primitives/SectionHeading';
import { cn } from '../../lib/cn';

/* ─────────────────────────────────────────────
   Geometry constants. The SVG is square; CENTER
   is the radar origin; MAX_R is the radius of the
   outermost ring. PADDING leaves room around the
   chart for category labels.
   ───────────────────────────────────────────── */

const SIZE = 520;
const CENTER = SIZE / 2;
const PADDING = 70;
const MAX_R = CENTER - PADDING;

const RING_LEVELS = [
  { r: MAX_R * 0.32, label: 'Expert' },
  { r: MAX_R * 0.62, label: 'Proficient' },
  { r: MAX_R * 0.92, label: 'Familiar' },
] as const;

/* Map proficiency 1..3 → ring index. 3 = Expert (innermost). */
const PROFICIENCY_RING: Record<1 | 2 | 3, number> = {
  3: 0,
  2: 1,
  1: 2,
};

const QUADRANT_PADDING_DEG = 6;

/* ─────────────────────────────────────────────
   Domain types + data
   ───────────────────────────────────────────── */

type CategoryColor = 'accent' | 'teal' | 'amber' | 'secondary';

const COLOR_FILL: Record<CategoryColor, string> = {
  accent: 'fill-accent',
  teal: 'fill-teal',
  amber: 'fill-amber',
  secondary: 'fill-text-secondary',
};

const COLOR_TEXT: Record<CategoryColor, string> = {
  accent: 'text-accent',
  teal: 'text-teal',
  amber: 'text-amber',
  secondary: 'text-text-secondary',
};

const COLOR_BG: Record<CategoryColor, string> = {
  accent: 'bg-accent',
  teal: 'bg-teal',
  amber: 'bg-amber',
  secondary: 'bg-text-secondary',
};

interface SkillEntry {
  name: string;
  proficiency: 1 | 2 | 3;
}

interface Category {
  id: string;
  label: string;
  color: CategoryColor;
  /** Bisector angle in degrees — 0 at top, increasing clockwise. */
  bisector: number;
  /** [start, end] arc range in degrees, same convention. */
  arc: [number, number];
  skills: ReadonlyArray<SkillEntry>;
}

const CATEGORIES: ReadonlyArray<Category> = [
  {
    id: 'frontend',
    label: 'Frontend',
    color: 'accent',
    bisector: 324, // top-left
    arc: [288, 360],
    skills: [
      { name: 'TypeScript', proficiency: 3 },
      { name: 'React', proficiency: 3 },
      { name: 'Tailwind', proficiency: 3 },
      { name: 'Framer Motion', proficiency: 2 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    color: 'amber',
    bisector: 36, // top-right
    arc: [0, 72],
    skills: [
      { name: 'Python', proficiency: 3 },
      { name: 'Java', proficiency: 2 },
      { name: 'Node.js', proficiency: 2 },
      { name: 'PostgreSQL', proficiency: 3 },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    color: 'teal',
    bisector: 108, // bottom-right
    arc: [72, 144],
    skills: [
      { name: 'AWS', proficiency: 3 },
      { name: 'Docker', proficiency: 3 },
      { name: 'Kubernetes', proficiency: 2 },
      { name: 'Terraform', proficiency: 2 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    color: 'secondary',
    bisector: 225, // bottom-left
    arc: [144, 216],
    skills: [
      { name: 'Linux', proficiency: 3 },
      { name: 'Bash', proficiency: 3 },
      { name: 'Git', proficiency: 3 },
      { name: 'CI/CD', proficiency: 2 },
    ],
  },
  {
    id: 'ai',
    label: 'AI & LLM',
    color: 'teal',
    bisector: 252,
    arc: [216, 288],
    skills: [
      { name: 'OpenAI API Integration', proficiency: 3 },
      { name: 'LLM-Powered Product Features', proficiency: 3 },
      { name: 'Claude Code', proficiency: 2 },
      { name: 'Cursor', proficiency: 2 },
      { name: 'AI-Assisted Data Extraction', proficiency: 2 },
    ],
  },
];

/* Polar → cartesian. 0° = 12 o'clock, increasing clockwise. */
function pos(angleDeg: number, r: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + Math.cos(rad) * r,
    y: CENTER + Math.sin(rad) * r,
  };
}

interface DotPlacement {
  category: Category;
  skill: SkillEntry;
  x: number;
  y: number;
  angle: number;
}

/* Pre-compute every dot's coordinates so the JSX stays declarative.
   Skills are spread evenly across their quadrant's padded angular range,
   at the radius for their proficiency level. */
const DOTS: ReadonlyArray<DotPlacement> = CATEGORIES.flatMap((cat) => {
  const [start, end] = cat.arc;
  const innerStart = start + QUADRANT_PADDING_DEG;
  const innerEnd = end - QUADRANT_PADDING_DEG;
  const span = innerEnd - innerStart;
  return cat.skills.map((skill, i) => {
    const angle =
      cat.skills.length === 1
        ? (innerStart + innerEnd) / 2
        : innerStart + ((i + 0.5) / cat.skills.length) * span;
    const ringIndex = PROFICIENCY_RING[skill.proficiency];
    const r = RING_LEVELS[ringIndex].r;
    const { x, y } = pos(angle, r);
    return { category: cat, skill, x, y, angle };
  });
});

/* ─────────────────────────────────────────────
   Radar SVG. Renders rings, axis dashes, category
   labels, and a dot per skill. Hover linking is
   driven by props from the parent so the legend
   and the radar stay in sync.
   ───────────────────────────────────────────── */

interface SkillRadarProps {
  hoveredCategoryId: string | null;
  hoveredSkillName: string | null;
  onHoverSkill: (name: string | null) => void;
}

function SkillRadar({
  hoveredCategoryId,
  hoveredSkillName,
  onHoverSkill,
}: SkillRadarProps) {
  const { ref, inView } = useScrollReveal<SVGSVGElement>({
    once: true,
    amount: 0.3,
  });

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-auto w-full max-w-[520px]"
      role="img"
      aria-label="Skills radar — categories and proficiency levels"
    >
      {/* Concentric rings */}
      {RING_LEVELS.map((level, i) => (
        <motion.circle
          key={`ring-${i}`}
          cx={CENTER}
          cy={CENTER}
          r={level.r}
          fill="none"
          strokeWidth={1}
          className="stroke-border-subtle"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{
            duration: 1,
            ease: easing.smooth,
            delay: 0.1 + i * 0.1,
          }}
        />
      ))}

      {/* Quadrant separators */}
      {[0, 90, 180, 270].map((angle, i) => {
        const outer = pos(angle, MAX_R * 0.95);
        return (
          <motion.line
            key={`sep-${angle}`}
            x1={CENTER}
            y1={CENTER}
            x2={outer.x}
            y2={outer.y}
            strokeWidth={0.6}
            strokeDasharray="2 5"
            className="stroke-border-subtle"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
            transition={{
              duration: 0.7,
              ease: easing.smooth,
              delay: 0.4 + i * 0.04,
            }}
          />
        );
      })}

      {/* Ring level labels — top center, between rings */}
      {RING_LEVELS.map((level, i) => {
        const labelP = pos(0, level.r);
        return (
          <motion.text
            key={`ring-label-${i}`}
            x={labelP.x}
            y={labelP.y - 4}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            fontSize={9}
            className="fill-text-tertiary font-mono uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
          >
            {level.label}
          </motion.text>
        );
      })}

      {/* Center origin */}
      <motion.circle
        cx={CENTER}
        cy={CENTER}
        r={2}
        className="fill-text-tertiary"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.5 }}
      />

      {/* Category labels at the bisector of each quadrant */}
      {CATEGORIES.map((cat) => {
        const labelP = pos(cat.bisector, MAX_R + 32);
        const isInactive =
          hoveredCategoryId && hoveredCategoryId !== cat.id;
        return (
          <motion.text
            key={`cat-${cat.id}`}
            x={labelP.x}
            y={labelP.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            className={cn(
              'fill-current font-mono uppercase tracking-widest transition-opacity duration-300',
              COLOR_TEXT[cat.color],
              isInactive && 'opacity-30',
            )}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: isInactive ? 0.3 : 1 } : {}}
            transition={{
              duration: 0.5,
              ease: easing.spring,
              delay: 0.7,
            }}
          >
            {cat.label}
          </motion.text>
        );
      })}

      {/* Skill dots */}
      {DOTS.map((dot, i) => {
        const isHovered = hoveredSkillName === dot.skill.name;
        const isInActiveCategory =
          !hoveredCategoryId || hoveredCategoryId === dot.category.id;
        const dimmed = !isInActiveCategory && !isHovered;

        return (
          <g
            key={`dot-${dot.category.id}-${dot.skill.name}`}
            transform={`translate(${dot.x}, ${dot.y})`}
            onMouseEnter={() => onHoverSkill(dot.skill.name)}
            onMouseLeave={() => onHoverSkill(null)}
            style={{ cursor: 'pointer' }}
            data-cursor="hover"
          >
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={
                inView
                  ? {
                      scale: 1,
                      opacity: dimmed ? 0.18 : 1,
                    }
                  : {}
              }
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 22,
                delay: 0.8 + i * 0.05,
              }}
            >
              {/* Soft halo when hovered */}
              {isHovered && (
                <motion.circle
                  r={14}
                  className={cn(
                    'fill-current',
                    COLOR_TEXT[dot.category.color],
                  )}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.18 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}
              {/* Dot */}
              <motion.circle
                r={isHovered ? 6 : 4}
                className={cn(COLOR_FILL[dot.category.color])}
                animate={{ r: isHovered ? 6 : 4 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 22,
                }}
              />
              {/* Tooltip — appears on hover */}
              {isHovered && (
                <motion.g
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <rect
                    x={-((dot.skill.name.length * 5.5) / 2 + 8)}
                    y={-26}
                    width={dot.skill.name.length * 5.5 + 16}
                    height={18}
                    rx={3}
                    className="fill-surface-2 stroke-border"
                    strokeWidth={1}
                  />
                  <text
                    x={0}
                    y={-14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={10}
                    className="fill-text-primary font-mono"
                  >
                    {dot.skill.name}
                  </text>
                </motion.g>
              )}
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Legend — categorized list with three-pip
   proficiency indicators per skill. Hover a row
   to highlight the matching dot in the radar;
   hover the category header to dim siblings.
   ───────────────────────────────────────────── */

interface ProficiencyDotsProps {
  level: 1 | 2 | 3;
  color: CategoryColor;
  active: boolean;
}

function ProficiencyDots({ level, color, active }: ProficiencyDotsProps) {
  return (
    <div className="flex gap-1" aria-label={`Proficiency ${level} of 3`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            'h-1.5 w-1.5 rounded-full transition-colors duration-200',
            i <= level && active ? COLOR_BG[color] : 'bg-surface-3',
          )}
        />
      ))}
    </div>
  );
}

interface SkillsLegendProps {
  hoveredCategoryId: string | null;
  hoveredSkillName: string | null;
  onHoverCategory: (id: string | null) => void;
  onHoverSkill: (name: string | null) => void;
}

function SkillsLegend({
  hoveredCategoryId,
  hoveredSkillName,
  onHoverCategory,
  onHoverSkill,
}: SkillsLegendProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-7">
      {CATEGORIES.map((cat) => {
        const isInactive =
          hoveredCategoryId && hoveredCategoryId !== cat.id;
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.5, ease: easing.spring }}
            onMouseEnter={() => onHoverCategory(cat.id)}
            onMouseLeave={() => onHoverCategory(null)}
            className={cn(
              'transition-opacity duration-300',
              isInactive && 'opacity-30',
            )}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span
                aria-hidden
                className={cn('h-2 w-2 rounded-full', COLOR_BG[cat.color])}
              />
              <h3
                className={cn(
                  'font-mono text-micro uppercase tracking-widest',
                  COLOR_TEXT[cat.color],
                )}
              >
                {cat.label}
              </h3>
            </div>
            <ul className="space-y-2">
              {cat.skills.map((skill) => {
                const isHovered = hoveredSkillName === skill.name;
                return (
                  <li
                    key={skill.name}
                    onMouseEnter={() => onHoverSkill(skill.name)}
                    onMouseLeave={() => onHoverSkill(null)}
                    className={cn(
                      'flex items-center justify-between gap-3',
                      'text-small transition-colors duration-200',
                      isHovered ? 'text-text-primary' : 'text-text-secondary',
                    )}
                  >
                    <span className="truncate">{skill.name}</span>
                    <ProficiencyDots
                      level={skill.proficiency}
                      color={cat.color}
                      active={isHovered || !hoveredSkillName}
                    />
                  </li>
                );
              })}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Skills — section composition. Single source of
   hover state shared between radar and legend so
   the two surfaces stay synchronised.
   ───────────────────────────────────────────── */

export function Skills() {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);

  return (
    <section
      id="skills"
      aria-label="Skills and proficiency"
      className="relative w-full bg-bg py-section"
    >
      <div className="mx-auto w-full max-w-content px-gutter">
        <SectionHeading
          number="04"
          eyebrow="Skills"
          title="What I reach for, by altitude."
          description="Proficiency shown by distance from center — inner is expert, outer is exploratory. Hover the radar or the legend to highlight."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 lg:col-start-1">
            <SkillRadar
              hoveredCategoryId={hoveredCategoryId}
              hoveredSkillName={hoveredSkillName}
              onHoverSkill={setHoveredSkillName}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-8">
            <SkillsLegend
              hoveredCategoryId={hoveredCategoryId}
              hoveredSkillName={hoveredSkillName}
              onHoverCategory={setHoveredCategoryId}
              onHoverSkill={setHoveredSkillName}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
