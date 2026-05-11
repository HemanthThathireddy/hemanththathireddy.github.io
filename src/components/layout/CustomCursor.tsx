// portfolio/src/components/layout/CustomCursor.tsx
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../lib/animations';
import { usePortfolioStore } from '../../store/usePortfolioStore';

/**
 * Selectors that should make the cursor "expand" on hover.
 * `data-cursor="hover"` is the opt-in hook for non-semantic surfaces
 * (project cards, draggable handles, etc.) so we don't have to chase
 * every interactive element across the codebase.
 */
const HOVERABLE_SELECTORS =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]';

/**
 * Two-piece custom cursor:
 *   - dot: tight spring, leads (basically tracks the pointer)
 *   - ring: looser spring, trails with a hint of inertia
 * Both blend with the page via mix-blend-mode: difference (set in CSS),
 * so the cursor stays legible on dark surfaces, light cards, and images.
 *
 * Disabled entirely when:
 *   - prefers-reduced-motion is set
 *   - the device lacks a fine pointer (touch / coarse hover)
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const cursorVariant = usePortfolioStore((s) => s.cursorVariant);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Raw pointer position — written synchronously on mousemove.
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // Two springs of different tightness: the dot leads, the ring trails.
  const dotX = useSpring(x, { stiffness: 900, damping: 55, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 900, damping: 55, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;

    // Skip touch / coarse-pointer devices entirely — there's no cursor to track.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(HOVERABLE_SELECTORS)) {
        setHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest(HOVERABLE_SELECTORS)) return;
      // Only clear when we're actually leaving a hoverable for non-hoverable.
      // Otherwise button-to-button transitions flicker.
      const related = e.relatedTarget as Element | null;
      if (related?.closest?.(HOVERABLE_SELECTORS)) return;
      setHovering(false);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeaveDoc = () => setVisible(false);
    const onEnterDoc = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeaveDoc);
    document.addEventListener('mouseenter', onEnterDoc);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeaveDoc);
      document.removeEventListener('mouseenter', onEnterDoc);
    };
  }, [reduced, x, y, visible]);

  if (!enabled) return null;

  const isHover = hovering || cursorVariant === 'hover';

  return (
    <>
      <motion.div
        aria-hidden
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: pressed ? 0.6 : isHover ? 0 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        aria-hidden
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: pressed ? 0.85 : isHover ? 1.6 : 1,
          opacity: visible ? 1 : 0,
          borderColor: isHover
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.55)',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      />
    </>
  );
}
