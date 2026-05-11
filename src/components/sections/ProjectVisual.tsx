// portfolio/src/components/sections/ProjectVisual.tsx

/* ─────────────────────────────────────────────
   Four abstract inline-SVG visuals used as the
   stylized "thumbnail" inside each project card.
   They take their color from `currentColor` so
   the parent can tint them via Tailwind text-*.
   No dependencies; everything is pure SVG.
   ───────────────────────────────────────────── */

export type VisualType = 'chart' | 'grid' | 'flow' | 'layers';

interface VisualProps {
  type: VisualType;
  /** Optional className on the outer <svg>. */
  className?: string;
}

export function ProjectVisual({ type, className }: VisualProps) {
  switch (type) {
    case 'chart':
      return <ChartVisual className={className} />;
    case 'grid':
      return <GridVisual className={className} />;
    case 'flow':
      return <FlowVisual className={className} />;
    case 'layers':
      return <LayersVisual className={className} />;
  }
}

/* ─────────────────────────────────────────────
   Chart — eight rounded bars + a polyline trend.
   Used by the Cloud Cost Observatory card.
   ───────────────────────────────────────────── */
function ChartVisual({ className }: { className?: string }) {
  const bars = [38, 62, 30, 78, 54, 70, 46, 92];
  return (
    <svg
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden
    >
      <g>
        {bars.map((h, i) => (
          <rect
            key={i}
            x={i * 24 + 8}
            y={100 - h}
            width={14}
            height={h}
            rx={1.5}
            fill="currentColor"
            opacity={0.18 + (i / bars.length) * 0.55}
          />
        ))}
        <polyline
          points={bars.map((h, i) => `${i * 24 + 15},${100 - h - 1}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Grid — sparse dot grid with a few highlighted.
   Evokes pods / nodes / clusters.
   ───────────────────────────────────────────── */
function GridVisual({ className }: { className?: string }) {
  const cols = 12;
  const rows = 6;
  const highlights = new Set([
    '2-1',
    '5-2',
    '7-0',
    '8-3',
    '10-1',
    '3-4',
    '11-3',
    '6-5',
  ]);
  return (
    <svg
      viewBox="0 0 240 120"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const key = `${c}-${r}`;
          const isHi = highlights.has(key);
          return (
            <circle
              key={key}
              cx={c * 20 + 10}
              cy={r * 20 + 10}
              r={isHi ? 3 : 1.6}
              fill="currentColor"
              opacity={isHi ? 0.95 : 0.22}
            />
          );
        }),
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Flow — three offset sine waves, layered.
   Evokes streaming events / pipelines.
   ───────────────────────────────────────────── */
function FlowVisual({ className }: { className?: string }) {
  const W = 240;
  const H = 100;
  const buildPath = (phase: number, amp: number, midY: number) => {
    const points: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * W;
      const y = midY + Math.sin(t * Math.PI * 2 + phase) * amp;
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  };
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.4}>
        <path d={buildPath(0, 14, H * 0.32)} opacity={0.85} />
        <path d={buildPath(1.2, 18, H * 0.5)} opacity={0.55} />
        <path d={buildPath(2.4, 12, H * 0.7)} opacity={0.3} />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Layers — three offset rounded rectangles.
   Evokes stacked artifacts / parsing layers.
   ───────────────────────────────────────────── */
function LayersVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 120"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      <g fill="currentColor">
        <rect x={20} y={10} width={150} height={80} rx={6} opacity={0.22} />
        <rect x={40} y={28} width={150} height={80} rx={6} opacity={0.4} />
        <rect x={60} y={46} width={140} height={62} rx={6} opacity={0.78} />
        {/* Subtle stroke on top rect for definition */}
        <rect
          x={60}
          y={46}
          width={140}
          height={62}
          rx={6}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.3}
        />
        {/* A few scan lines on the top rect */}
        <g stroke="currentColor" strokeOpacity={0.35} strokeWidth={1}>
          <line x1={72} y1={62} x2={120} y2={62} />
          <line x1={72} y1={72} x2={140} y2={72} />
          <line x1={72} y1={82} x2={108} y2={82} />
          <line x1={72} y1={92} x2={132} y2={92} />
        </g>
      </g>
    </svg>
  );
}
