// portfolio/src/data/projects.ts
import type { VisualType } from '../components/sections/ProjectVisual';

/* ─────────────────────────────────────────────
   Single source of truth for project data.
   Consumed by:
     - components/sections/Projects.tsx (bento grid + modal)
     - pages/ProjectsList.tsx           (full list)
     - pages/ProjectDetail.tsx          (standalone deep-link page)
   ───────────────────────────────────────────── */

export type Accent = 'accent' | 'teal' | 'amber';

/* Tailwind class lookups for each accent. We map them through a static
   record (rather than templating `text-${accent}`) so the JIT can detect
   every class at build time. */
export const ACCENT_TEXT: Record<Accent, string> = {
  accent: 'text-accent',
  teal: 'text-teal',
  amber: 'text-amber',
};

export const ACCENT_BG: Record<Accent, string> = {
  accent: 'bg-accent',
  teal: 'bg-teal',
  amber: 'bg-amber',
};

export const ACCENT_BG_MUTED: Record<Accent, string> = {
  accent: 'bg-accent-muted',
  teal: 'bg-teal-muted',
  amber: 'bg-amber-muted',
};

export const ACCENT_BORDER_HOVER: Record<Accent, string> = {
  accent: 'group-hover:border-accent/40',
  teal: 'group-hover:border-teal/40',
  amber: 'group-hover:border-amber/40',
};

/* Static class lookup for `group-hover:text-{accent}` — kept here so
   Tailwind's JIT sees every variant at build time. Never concatenate
   accent class names at runtime; the resulting string won't be in the
   compiled CSS. */
export const ACCENT_GROUP_HOVER_TEXT: Record<Accent, string> = {
  accent: 'group-hover:text-accent',
  teal: 'group-hover:text-teal',
  amber: 'group-hover:text-amber',
};

export const ACCENT_GLOW_STYLE: Record<Accent, string> = {
  accent:
    'radial-gradient(80% 60% at 100% 100%, rgba(108,99,255,0.18), transparent 70%)',
  teal:
    'radial-gradient(80% 60% at 100% 100%, rgba(15,255,193,0.14), transparent 70%)',
  amber:
    'radial-gradient(80% 60% at 100% 100%, rgba(255,170,44,0.14), transparent 70%)',
};

export interface Project {
  id: string;
  number: string;
  name: string;
  /** One-line tagline shown on the card. */
  tagline: string;
  /** Longer description shown in the modal/detail page. */
  description: string;
  /** Tech stack chips. Cards truncate; modal/page show all. */
  stack: ReadonlyArray<string>;
  accent: Accent;
  visual: VisualType;
  /** Whether the card is rendered as the 2×2 hero slot in the bento grid. */
  featured?: boolean;
  live?: string;
  github?: string;
  /** Modal/page-only narrative content. */
  context: string;
  architecture: ReadonlyArray<string>;
  outcomes: ReadonlyArray<string>;
}

export const PROJECTS: ReadonlyArray<Project> = [
  {
    id: 'cloud-cost',
    number: '01',
    name: 'Cloud Cost Observatory',
    tagline:
      'Self-hosted dashboard that tracks AWS spend across teams and surfaces tag drift before the bill arrives.',
    description:
      'A multi-tenant cost analytics platform for engineering orgs that have outgrown the AWS Console but aren’t ready for an enterprise FinOps tool. Pulls Cost & Usage Reports nightly, normalises them against a tag-policy spec, and renders trend / anomaly views per team.',
    stack: [
      'TypeScript',
      'React',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'AWS',
      'Docker',
    ],
    accent: 'accent',
    visual: 'chart',
    featured: true,
    live: '#',
    github: '#',
    context:
      'Built after seeing engineering teams routinely surprised by month-end AWS bills, with no easy way to see which workloads were drifting from their cost baselines.',
    architecture: [
      'Nightly job pulls AWS Cost & Usage Reports into S3, then a FastAPI worker normalises them into a tag-keyed Postgres schema.',
      'Per-team budgets are expressed as YAML; a policy engine flags accounts whose spend deviates from the moving baseline by configurable thresholds.',
      'React frontend uses TanStack Query + a custom chart library; the entire stack runs from a single docker-compose for self-hosting.',
    ],
    outcomes: [
      'Caught a runaway NAT-gateway charge within 24 hours of deployment that had previously gone unnoticed for three weeks.',
      'Reduced the monthly cost-review meeting from 90 minutes of spreadsheet wrangling to a 20-minute walk-through.',
    ],
  },
  {
    id: 'k8s-profiler',
    number: '02',
    name: 'Kubernetes Cold-Start Profiler',
    tagline:
      'CLI + dashboard for measuring pod cold-start latency across nodes, regions, and image sizes.',
    description:
      'A diagnostic tool for teams running latency-sensitive workloads on Kubernetes. Schedules synthetic pods on demand, instruments each lifecycle phase, and emits results in a Prometheus-friendly format.',
    stack: ['Go', 'Kubernetes', 'Prometheus', 'Grafana'],
    accent: 'teal',
    visual: 'grid',
    github: '#',
    context:
      'Built while debugging unexplained tail-latency spikes on a service with autoscaling enabled and no clear visibility into where the cold-start time was being spent.',
    architecture: [
      'Single Go binary doubles as a CLI and an in-cluster controller; uses the watch API to instrument pod lifecycle events.',
      'Per-phase histograms emitted to Prometheus and aggregated into a Grafana dashboard with image-size and region breakdowns.',
      'Configurable warm-up and tear-down patterns so the profiler doesn’t pollute production resource budgets.',
    ],
    outcomes: [
      'Identified a 4-second image-pull regression introduced by a base-image bump on a critical service.',
      'Used as a continuous benchmark in CI to gate base-image changes that would worsen cold-start times.',
    ],
  },
  {
    id: 'stream-stitch',
    number: '03',
    name: 'Stream Stitch',
    tagline:
      'A lightweight framework for composing real-time event streams into typed, replayable pipelines.',
    description:
      'A Python library for building stream-processing pipelines without committing to a heavy framework. Provides typed operators, replay-from-offset, and a debug UI for inspecting in-flight messages.',
    stack: ['Python', 'Kafka', 'Redis', 'Docker'],
    accent: 'amber',
    visual: 'flow',
    github: '#',
    context:
      'A side project born from the frustration of trying to evolve event-driven systems without good local-dev ergonomics or first-class type safety.',
    architecture: [
      'Operators are typed with Pydantic; the framework enforces schema compatibility between upstream and downstream operators at boot.',
      'Redis-backed offset journal lets pipelines be replayed from any point, with deterministic ordering guarantees.',
      'A small Flask debug UI exposes message-in-flight inspection, useful when hunting silent backpressure bugs.',
    ],
    outcomes: [
      'Used in two side projects so far; cut local pipeline iteration time from minutes (Docker rebuild) to seconds (hot-reload).',
    ],
  },
  {
    id: 'receipt-forensics',
    number: '04',
    name: 'Receipt Forensics',
    tagline:
      'OCR + ML pipeline that takes a phone-camera receipt photo and outputs a structured, auditable line-item record.',
    description:
      'Personal-finance tooling for itemising paper receipts. Combines a vision model for layout detection with a domain-specific post-processor that knows what receipts look like.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'AWS S3'],
    accent: 'accent',
    visual: 'layers',
    github: '#',
    context:
      'Started after realising that none of the consumer receipt-scanning apps preserved enough fidelity to actually audit a year’s worth of spending.',
    architecture: [
      'FastAPI service accepts a photo, ships it to a vision model for layout detection, then runs a regex-and-rules post-processor tuned per merchant.',
      'Line-items stored in a normalised Postgres schema with foreign keys to merchant, tax-rate, and category tables.',
      'Audit log preserves the original image hash and the model output alongside the final structured record, so corrections are reversible.',
    ],
    outcomes: [
      'Categorisation accuracy of ~94% on a personal test set of 200 receipts spanning 22 merchants.',
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Returns the next project in the list, wrapping around. */
export function getNextProject(id: string): Project {
  const idx = PROJECTS.findIndex((p) => p.id === id);
  return PROJECTS[(idx + 1) % PROJECTS.length];
}
