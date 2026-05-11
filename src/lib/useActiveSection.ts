// portfolio/src/lib/useActiveSection.ts
import { useEffect } from 'react';
import { usePortfolioStore, type SectionId } from '../store/usePortfolioStore';

/**
 * Observes a list of section ids and writes the most-visible one to the store.
 *
 * Uses a generous rootMargin so a section is "active" once its middle band
 * crosses the viewport center — feels more natural than a top-edge trigger
 * for long sections and avoids rapid flicker on short ones.
 *
 * Sections are looked up via `getElementById` after mount; if a section
 * hasn't yet been rendered (e.g. lazy/Suspense), retries via MutationObserver
 * for the duration of the hook's lifetime — resolving as soon as it appears.
 */
export function useActiveSection(ids: ReadonlyArray<SectionId>): void {
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    const observed = new Set<Element>();

    const handleEntries: IntersectionObserverCallback = (entries) => {
      // Pick the entry with the highest intersection ratio that is intersecting.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        setActiveSection(visible.target.id as SectionId);
      }
    };

    observer = new IntersectionObserver(handleEntries, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    const tryObserve = () => {
      let observedNow = 0;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && !observed.has(el)) {
          observer!.observe(el);
          observed.add(el);
          observedNow++;
        }
      }
      return observedNow;
    };

    tryObserve();

    // If sections render after the navbar mounts (typical for SPAs that
    // hydrate piecewise), watch the DOM for them appearing.
    if (observed.size < ids.length) {
      mutationObserver = new MutationObserver(() => {
        tryObserve();
        if (observed.size >= ids.length) {
          mutationObserver?.disconnect();
          mutationObserver = null;
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [ids, setActiveSection]);
}
