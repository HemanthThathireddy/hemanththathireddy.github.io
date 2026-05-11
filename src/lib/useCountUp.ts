// portfolio/src/lib/useCountUp.ts
import { useEffect, useState } from 'react';
import { useReducedMotion } from './animations';

export interface CountUpOptions {
  /** Total animation duration in ms. */
  duration?: number;
  /** Starting value (default 0). */
  start?: number;
  /** Gate the animation — typically wired to scroll-into-view. */
  enabled?: boolean;
  /** Number of decimal places to round the live value to. */
  decimals?: number;
  /**
   * Easing function in (0..1) → (0..1). Pass a stable reference
   * (module-scope or `useCallback`) to avoid re-triggering the effect.
   */
  easing?: (t: number) => number;
}

/** ease-out-expo: starts fast, lands gently. The default for stat counters. */
const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * Animates a number from `start` to `target` over `duration` ms when
 * `enabled` flips true. Single-shot per enable cycle — re-mount or
 * toggle `enabled` false→true to play again.
 *
 * Under reduced-motion the value snaps directly to the target.
 */
export function useCountUp(
  target: number,
  {
    duration = 1400,
    start = 0,
    enabled = true,
    decimals = 0,
    easing = easeOutExpo,
  }: CountUpOptions = {},
): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState<number>(reduced ? target : start);

  useEffect(() => {
    if (!enabled) return;
    if (reduced) {
      setValue(target);
      return;
    }

    const startTime = performance.now();
    const factor = Math.pow(10, decimals);
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = easing(t);
      const current = start + (target - start) * eased;
      setValue(Math.round(current * factor) / factor);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, reduced, target, start, duration, decimals, easing]);

  return value;
}
