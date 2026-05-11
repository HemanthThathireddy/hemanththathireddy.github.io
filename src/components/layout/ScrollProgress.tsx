// portfolio/src/components/layout/ScrollProgress.tsx
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Hairline scroll-progress bar pinned to the top of the viewport.
 * Backed by Framer Motion's useScroll → useSpring chain so the bar
 * lags slightly behind the raw scroll value, giving the motion a
 * physical, weighted feel rather than a 1:1 jitter.
 *
 * Animates only `transform: scaleX` — fully composited, no layout work.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-accent via-accent to-teal"
    />
  );
}
