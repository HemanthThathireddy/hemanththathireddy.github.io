// portfolio/src/App.tsx
import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { CustomCursor } from './components/layout/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Home';
import { pageTransition } from './lib/animations';
import { usePortfolioStore } from './store/usePortfolioStore';

/* Detail pages are code-split — they only load when the user navigates
   to /projects or /projects/:id, not on the initial home-page paint. */
const ProjectsList = lazy(() => import('./pages/ProjectsList'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* ─────────────────────────────────────────────
   Cross-route side effects.
   - ScrollToTop resets scroll on route change.
   - NavbarStateSync flips heroComplete=true on
     non-home routes so the navbar isn't stuck
     hidden on a deep-linked page.
   ───────────────────────────────────────────── */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NavbarStateSync() {
  const { pathname } = useLocation();
  const setHeroComplete = usePortfolioStore((s) => s.setHeroComplete);
  useEffect(() => {
    if (pathname !== '/') {
      setHeroComplete(true);
    }
  }, [pathname, setHeroComplete]);
  return null;
}

/* ─────────────────────────────────────────────
   PageWrapper — every route renders inside this
   so AnimatePresence has a consistent target to
   crossfade between.
   ───────────────────────────────────────────── */

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function RouteFallback() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg">
      <div
        className="font-mono text-micro uppercase tracking-widest text-text-secondary"
        role="status"
        aria-live="polite"
      >
        Loading…
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AnimatedRoutes
   The `key={pathname}` is what makes AnimatePresence
   detect a new "child" on every route change. mode="wait"
   ensures the exit animation completes before the new
   page mounts — avoids overlapping the two pages and
   keeps scroll restoration deterministic.
   ───────────────────────────────────────────── */

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/projects"
            element={
              <PageWrapper>
                <ProjectsList />
              </PageWrapper>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PageWrapper>
                <ProjectDetail />
              </PageWrapper>
            }
          />
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

/* ─────────────────────────────────────────────
   App root
   Sticky chrome (navbar, scroll bar, cursor) sits
   ABOVE the route tree so it stays mounted across
   transitions — no flash, no remount on route change.
   ───────────────────────────────────────────── */

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavbarStateSync />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
