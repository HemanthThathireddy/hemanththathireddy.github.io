// portfolio/src/components/layout/Navbar.tsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { easing, useReducedMotion } from '../../lib/animations';
import { useActiveSection } from '../../lib/useActiveSection';
import {
  usePortfolioStore,
  type SectionId,
} from '../../store/usePortfolioStore';

interface NavLink {
  id: SectionId;
  label: string;
  number: string;
}

const NAV_LINKS: ReadonlyArray<NavLink> = [
  { id: 'about', label: 'About', number: '01' },
  { id: 'experience', label: 'Experience', number: '02' },
  { id: 'work', label: 'Work', number: '03' },
  { id: 'skills', label: 'Skills', number: '04' },
  { id: 'contact', label: 'Contact', number: '05' },
];

const SECTION_IDS: ReadonlyArray<SectionId> = NAV_LINKS.map((l) => l.id);

/**
 * Fixed top navbar. Three things to know:
 *
 *  1. It is invisible (opacity 0, pointer-events none) until the hero
 *     calls usePortfolioStore.setHeroComplete(true). The hero owns the
 *     trigger; the navbar just listens.
 *
 *  2. The active-link underline is animated via a shared `layoutId`
 *     (`nav-active`). When `activeSection` changes, Framer Motion smoothly
 *     animates the underline to its new position — no AnimatePresence
 *     required because there's always exactly one active link.
 *
 *  3. Below `md`, the link list collapses into a fullscreen overlay.
 *     Body scroll is locked while open; ESC closes it.
 */
export function Navbar() {
  const heroComplete = usePortfolioStore((s) => s.heroComplete);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const reduced = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useActiveSection(SECTION_IDS);

  // Swap nav from transparent to glass after the user scrolls past the fold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // ESC closes the overlay.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{
          opacity: heroComplete ? 1 : 0,
          y: heroComplete ? 0 : -16,
        }}
        transition={{ duration: 0.6, ease: easing.spring, delay: 0.05 }}
        style={{ pointerEvents: heroComplete ? 'auto' : 'none' }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            'mx-auto flex w-full max-w-content items-center justify-between',
            'px-gutter py-4',
            'transition-colors duration-400 ease-spring',
            scrolled
              ? 'glass border-b border-border-subtle'
              : 'border-b border-transparent',
          )}
        >
          {/* Logo / monogram */}
          <button
            onClick={() => scrollToSection('home')}
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-1 font-mono text-[13px] font-medium text-text-primary transition-colors duration-250 ease-spring group-hover:border-accent group-hover:text-accent">
              HT
            </span>
            <span className="hidden text-small font-medium text-text-primary md:block">
              Hemanth
              <span className="text-text-secondary">.dev</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:block" aria-label="Primary">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group relative px-3 py-2 text-small transition-colors duration-250',
                        isActive
                          ? 'text-text-primary'
                          : 'text-text-secondary hover:text-text-primary',
                      )}
                    >
                      <span className="mr-1.5 font-mono text-[11px] tracking-wide text-accent">
                        {link.number}
                      </span>
                      {link.label}
                      {isActive && (
                        <motion.span
                          aria-hidden
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-px h-px bg-accent"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right side: status chip (md+) and mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection('contact')}
              className={cn(
                'hidden h-9 items-center gap-2 rounded-full border border-border bg-surface-1 px-3.5',
                'text-small font-medium text-text-primary',
                'transition-all duration-250 ease-spring',
                'hover:border-accent hover:bg-accent-muted hover:text-accent',
                'md:inline-flex',
              )}
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-pulse-glow rounded-full bg-teal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal shadow-[0_0_8px_rgba(15,255,193,0.7)]" />
              </span>
              Available
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                'grid h-9 w-9 place-items-center rounded-md',
                'border border-border bg-surface-1 text-text-primary',
                'transition-colors duration-250 hover:border-accent hover:text-accent',
                'md:hidden',
              )}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="fixed inset-0 z-40 bg-bg-deep/95 backdrop-blur-glass md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav
              className="flex h-full flex-col justify-center gap-1 px-gutter pt-20"
              aria-label="Mobile primary"
            >
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{
                      delay: 0.06 + i * 0.05,
                      duration: 0.4,
                      ease: easing.spring,
                    }}
                    onClick={() => scrollToSection(link.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-baseline justify-between border-b border-border-subtle py-5',
                      'text-h3 font-medium text-left',
                      isActive ? 'text-text-primary' : 'text-text-secondary',
                    )}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-small text-accent">
                        {link.number}
                      </span>
                      {link.label}
                    </span>
                    {isActive && (
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-accent"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
