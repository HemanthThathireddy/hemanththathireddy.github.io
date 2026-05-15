// portfolio/src/components/sections/Hero.tsx
import { Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  charContainer,
  charReveal,
  easing,
  useReducedMotion,
  useTypingEffect,
} from '../../lib/animations';
import { useBreakpoint } from '../../lib/useBreakpoint';
import { usePortfolioStore } from '../../store/usePortfolioStore';

const HeroScene = lazy(() => import('./HeroScene'));

/* ─────────────────────────────────────────────
   Static content lives at module scope so the
   array references stay stable across renders.
   ───────────────────────────────────────────── */
const TYPING_PHRASES = [
  'Full-Stack Engineer.',
  'Cloud Infrastructure.',
  'Systems Architect.',
] as const;

const FIRST_NAME = 'Hemanth';
const LAST_NAME = 'Thathireddy';

/** How long after mount we flip heroComplete → true (drives navbar reveal). */
const HERO_COMPLETE_DELAY_MS = 1500;

/* ─────────────────────────────────────────────
   Background
   - Mobile (<md): static gradient, no Three.js
   - Tablet+ (md+): R3F scene, code-split via lazy()
   The lg-vs-md branch only changes parallax strength
   so mid-size touch laptops feel calmer.
   ───────────────────────────────────────────── */
function HeroBackground() {
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');

  if (!isMd) {
    return (
      <div aria-hidden className="absolute inset-0 bg-mesh-violet">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 30%, rgba(108, 99, 255, 0.22), transparent 70%)',
          }}
        />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          aria-hidden
          className="absolute inset-0 bg-mesh-violet animate-pulse"
        />
      }
    >
      <div className="absolute inset-0">
        <HeroScene
          parallaxStrength={isLg ? 0.45 : 0.25}
          density={isLg ? 1200 : 800}
        />
      </div>
    </Suspense>
  );
}

/* ─────────────────────────────────────────────
   Per-character renderer. We split into Array.from
   (rather than .split('')) so multi-byte glyphs
   stay intact. Each character is its own motion.span
   inheriting from the parent's charContainer.
   ───────────────────────────────────────────── */
function SplitChars({ text, prefix }: { text: string; prefix: string }) {
  return (
    <>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={`${prefix}-${i}`}
          variants={charReveal}
          className="inline-block will-change-transform"
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Subtitle: typed text + blinking caret.
   The typing hook ticks regardless of fade-in
   delay — by the time the line is visible
   (~0.9s), the first phrase is mid-type, which
   sells the "already in progress" feel.
   ───────────────────────────────────────────── */
function HeroSubtitle() {
  const { text } = useTypingEffect(TYPING_PHRASES, {
    typeSpeed: 65,
    deleteSpeed: 32,
    holdAtEnd: 1600,
    holdAtStart: 320,
  });

  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easing.spring, delay: 0.9 }}
      className="mt-6 flex items-baseline gap-2 font-mono text-body-lg text-text-secondary"
      aria-live="polite"
    >
      <span className="text-accent">→</span>
      <span className="text-text-primary">{text}</span>
      <span
        aria-hidden
        className="inline-block h-[1em] w-[2px] translate-y-[3px] animate-caret-blink bg-accent"
      />
    </motion.p>
  );
}

/* ─────────────────────────────────────────────
   CTA: animated rule + label + bobbing chevron.
   The rule wipes from violet to white on hover via
   a child element translation — composited only.
   ───────────────────────────────────────────── */
function HeroCTA() {
  const reduced = useReducedMotion();

  const handleClick = () => {
    document
      .getElementById('about')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easing.spring, delay: 1.4 }}
      className="mt-12 md:mt-16"
    >
      <button
        onClick={handleClick}
        className="group inline-flex items-center gap-3 text-small font-medium text-text-secondary transition-colors duration-250 hover:text-text-primary"
      >
        <span className="relative h-px w-12 overflow-hidden bg-border md:w-16">
          <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-600 ease-spring group-hover:translate-x-0" />
        </span>
        View my work
        <ChevronDown
          size={16}
          aria-hidden
          className="motion-safe:animate-float-y transition-transform duration-250 group-hover:translate-y-1"
        />
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Hero shell — composes everything. The section
   is min-h-dvh so it's exactly one viewport tall
   on iOS Safari without bouncing on chrome show/hide.
   ───────────────────────────────────────────── */
export function Hero() {
  const reduced = useReducedMotion();
  const setHeroComplete = usePortfolioStore((s) => s.setHeroComplete);

  // Flip the global flag once the intro feels settled. Use a single timeout
  // (not Framer's onAnimationComplete) so the timing is independent of any
  // future name-length changes and predictable under reduced-motion.
  useEffect(() => {
    if (reduced) {
      setHeroComplete(true);
      return;
    }
    const id = window.setTimeout(
      () => setHeroComplete(true),
      HERO_COMPLETE_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [reduced, setHeroComplete]);

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-dvh w-full items-center overflow-hidden bg-bg"
    >
      {/* Background layer — particles or gradient depending on breakpoint */}
      <HeroBackground />

      {/* Center vignette: darkens the edges so the type stays anchored */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.55) 85%)',
        }}
      />

      {/* Bottom fade into page background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, #0a0a0a 100%)',
        }}
      />

      {/* Cinematic grain — barely there */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-content px-gutter pb-24 pt-32 md:pb-32 md:pt-40">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easing.spring, delay: 0.1 }}
          className="mb-6 flex items-center gap-3 md:mb-8"
        >
          <span aria-hidden className="h-px w-8 bg-accent md:w-12" />
          <span className="font-mono text-micro uppercase tracking-widest text-text-secondary">
            Full-Stack Engineer · Chicago, IL
          </span>
        </motion.div>

        {/* Name — per-char blur-in. Two lines on all sizes for editorial impact. */}
        <motion.h1
          variants={charContainer}
          initial="hidden"
          animate="visible"
          aria-label={`${FIRST_NAME} ${LAST_NAME}`}
          className="font-sans text-display leading-[0.95] tracking-tightest text-text-primary"
        >
          <span aria-hidden className="block">
            <SplitChars text={FIRST_NAME} prefix="first" />
          </span>
          <span aria-hidden className="block text-balance">
            <SplitChars text={LAST_NAME} prefix="last" />
            <motion.span
              variants={charReveal}
              className="inline-block text-accent"
            >
              .
            </motion.span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <HeroSubtitle />

        {/* Tagline / supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easing.spring, delay: 1.1 }}
          className="mt-8 max-w-[52ch] text-body-lg text-text-secondary md:mt-10"
        >
          I design and ship resilient distributed systems and AI-orchestration 
          pipelines from the data-center floor to the browser. Currently focused 
          on LLM infrastructure and the developer-facing platforms 
          that make AI integration possible.
        </motion.p>

        {/* CTA */}
        <HeroCTA />
      </div>
    </section>
  );
}
