// portfolio/src/lib/animations.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useInView,
  useReducedMotion as fmUseReducedMotion,
  type Variants,
  type Transition,
} from 'framer-motion';

/* ─────────────────────────────────────────────
   Easing curves — named tokens, not raw arrays.
   Framer Motion accepts string presets or arrays;
   we expose tuples so transitions stay typed.
   ───────────────────────────────────────────── */
export const easing = {
  spring: [0.16, 1, 0.3, 1] as const, // expressive ease-out, used for reveals
  smooth: [0.65, 0, 0.35, 1] as const, // symmetric ease-in-out, used for scrubs
  snappy: [0.34, 1.56, 0.64, 1] as const, // overshoot, used for chips/buttons
  enter: [0.22, 1, 0.36, 1] as const, // tight ease-out for layout transitions
} as const;

export const durations = {
  fast: 0.25,
  base: 0.45,
  med: 0.6,
  slow: 0.9,
  cinematic: 1.2,
} as const;

/* ─────────────────────────────────────────────
   Re-export reduced-motion hook so the rest of
   the app imports motion utilities from a single
   place. (Wraps Framer Motion's hook directly.)
   ───────────────────────────────────────────── */
export const useReducedMotion = fmUseReducedMotion;

/* ─────────────────────────────────────────────
   Shared Variants
   Defined OUTSIDE component bodies so they don't
   re-create on each render, and so children can
   inherit `staggerChildren` cleanly.
   ───────────────────────────────────────────── */

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.med, ease: easing.spring },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.med, ease: easing.smooth },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.base, ease: easing.snappy },
  },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(14px)', y: 8 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: durations.slow, ease: easing.spring },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.med, ease: easing.spring },
  },
};

/* Per-character reveal — tuned for hero name.
   Stagger applied via parent's transition.staggerChildren. */
export const charReveal: Variants = {
  hidden: { opacity: 0, y: '0.6em', filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easing.spring },
  },
};

export const charContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.15,
    },
  },
};

/* Page-level transition */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.med, ease: easing.spring },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: durations.fast, ease: easing.smooth },
  },
};

/* Reusable transition presets so we can apply consistent
   timing to elements that don't use full variants. */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const smoothTransition: Transition = {
  duration: durations.base,
  ease: easing.spring,
};

/* ─────────────────────────────────────────────
   useScrollReveal
   Returns a ref + the inView state. Uses Framer
   Motion's IntersectionObserver wrapper so it
   plays nicely with `animate={inView ? 'visible' : 'hidden'}`.
   ───────────────────────────────────────────── */
export interface ScrollRevealOptions {
  /** Fraction of the element that must be in view (0–1). */
  amount?: number | 'some' | 'all';
  /** Trigger only the first time it enters the viewport. */
  once?: boolean;
  /** Negative value tightens the trigger margin. */
  margin?: string;
}

export function useScrollReveal<T extends Element = HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const { amount = 0.25, once = true, margin = '0px 0px -10% 0px' } = options;
  const ref = useRef<T>(null);
  const inView = useInView(ref, {
    amount,
    once,
    margin: margin as `${number}px ${number}px ${number}px ${number}px`,
  });
  return { ref, inView } as const;
}

/* ─────────────────────────────────────────────
   useTypingEffect
   Cycles through `phrases`, typing then deleting
   each one. Pauses at the end of every phrase.
   Respects reduced-motion: just shows the first
   phrase static.
   ───────────────────────────────────────────── */
export interface TypingOptions {
  typeSpeed?: number; // ms per character while typing
  deleteSpeed?: number; // ms per character while deleting
  holdAtEnd?: number; // ms to hold after fully typed
  holdAtStart?: number; // ms to hold before next phrase
  loop?: boolean;
}

export function useTypingEffect(
  phrases: ReadonlyArray<string>,
  options: TypingOptions = {},
): { text: string; phraseIndex: number; isDeleting: boolean } {
  const {
    typeSpeed = 70,
    deleteSpeed = 38,
    holdAtEnd = 1400,
    holdAtStart = 280,
    loop = true,
  } = options;

  const reduced = useReducedMotion();
  const safePhrases = useMemo(() => (phrases.length > 0 ? phrases : ['']), [phrases]);

  const [text, setText] = useState(reduced ? safePhrases[0] : '');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setText(safePhrases[0]);
      return;
    }

    const current = safePhrases[phraseIndex % safePhrases.length];

    let delay: number;
    if (!isDeleting && text === current) {
      // fully typed → pause, then start deleting
      delay = holdAtEnd;
    } else if (isDeleting && text === '') {
      // fully deleted → advance phrase, brief pause
      delay = holdAtStart;
    } else {
      delay = isDeleting ? deleteSpeed : typeSpeed;
    }

    const id = window.setTimeout(() => {
      if (!isDeleting && text === current) {
        if (loop || phraseIndex < safePhrases.length - 1) {
          setIsDeleting(true);
        }
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % safePhrases.length);
      } else {
        setText((t) =>
          isDeleting ? current.substring(0, t.length - 1) : current.substring(0, t.length + 1),
        );
      }
    }, delay);

    return () => window.clearTimeout(id);
  }, [
    text,
    isDeleting,
    phraseIndex,
    safePhrases,
    typeSpeed,
    deleteSpeed,
    holdAtEnd,
    holdAtStart,
    loop,
    reduced,
  ]);

  return { text, phraseIndex, isDeleting };
}

/* ─────────────────────────────────────────────
   useMouseParallax
   Tracks mouse position normalized to [-1, 1]
   relative to either the window or a target ref.
   Uses rAF + a ref so consumers can read smoothed
   values without re-rendering on every move.
   ───────────────────────────────────────────── */
export interface MouseParallaxOptions {
  /** Lerp factor toward the target (0–1). Lower = smoother. */
  lerp?: number;
  /** Element to measure against; defaults to window. */
  target?: React.RefObject<HTMLElement | null>;
  /** Disable on touch devices. */
  disableOnTouch?: boolean;
}

export interface MouseParallaxState {
  /** Normalized X in [-1, 1]. */
  x: number;
  /** Normalized Y in [-1, 1]. */
  y: number;
}

export function useMouseParallax(options: MouseParallaxOptions = {}) {
  const { lerp = 0.08, target, disableOnTouch = true } = options;
  const reduced = useReducedMotion();

  // Mutable ref for hot path — no re-renders on every move.
  const valueRef = useRef<MouseParallaxState>({ x: 0, y: 0 });
  // React state mirror, throttled to rAF, for components that want to read.
  const [value, setValue] = useState<MouseParallaxState>({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    if (disableOnTouch && window.matchMedia('(hover: none)').matches) return;

    const targetState = { x: 0, y: 0 };
    let rafId = 0;
    let mounted = true;

    const onMove = (e: MouseEvent) => {
      const rect = target?.current?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        targetState.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetState.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      } else {
        targetState.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetState.y = (e.clientY / window.innerHeight) * 2 - 1;
      }
    };

    const tick = () => {
      if (!mounted) return;
      const v = valueRef.current;
      v.x += (targetState.x - v.x) * lerp;
      v.y += (targetState.y - v.y) * lerp;
      setValue({ x: v.x, y: v.y });
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [lerp, target, disableOnTouch, reduced]);

  return { ...value, ref: valueRef } as const;
}

/* ─────────────────────────────────────────────
   useIsMounted
   Tiny helper for components that need to skip
   the very first paint (e.g. portals, cursor).
   ───────────────────────────────────────────── */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
