// portfolio/src/lib/useBreakpoint.ts
import { useEffect, useState } from 'react';

/**
 * Tailwind breakpoint queries — kept in lockstep with tailwind.config.ts.
 * If you change one, change the other.
 */
const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Generic media-query hook with an SSR-safe initial value: on the very
 * first render in a CSR app like Vite, we read matchMedia synchronously
 * so consumers don't briefly get a wrong answer (which causes layout
 * shifts and, worse, briefly mounts the 3D scene on phones).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    // Sync once on subscribe in case the value changed between
    // initial-state evaluation and subscription (rare but possible).
    setMatches(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Tailwind-named breakpoint helper. */
export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(BREAKPOINTS[bp]);
}
