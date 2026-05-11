// portfolio/src/store/usePortfolioStore.ts
import { create } from 'zustand';

/* ─────────────────────────────────────────────
   Section IDs are the source of truth for both
   the navbar links and the IntersectionObserver
   scroll tracking. Any new section must be
   registered here AND given a matching DOM id.
   ───────────────────────────────────────────── */
export type SectionId =
  | 'home'
  | 'about'
  | 'experience'
  | 'work'
  | 'skills'
  | 'contact';

export type CursorVariant = 'default' | 'hover';

interface PortfolioState {
  /**
   * Flipped to true once the hero's intro animation finishes.
   * Drives the navbar's reveal — kept in global state because
   * the hero owns the trigger, the navbar owns the response,
   * and they're not in a parent/child relationship.
   */
  heroComplete: boolean;
  setHeroComplete: (value: boolean) => void;

  /** Currently in-view section id, written by useActiveSection. */
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;

  /**
   * Optional override for the custom cursor. Components can
   * call setCursorVariant('hover') for surfaces that don't
   * use the default <a>/<button> hoverable detection.
   */
  cursorVariant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  heroComplete: false,
  setHeroComplete: (value) => set({ heroComplete: value }),

  activeSection: 'home',
  setActiveSection: (id) => set({ activeSection: id }),

  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
}));
