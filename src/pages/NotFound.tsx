// portfolio/src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { easing } from '../lib/animations';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-gutter">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easing.spring }}
        className="text-center"
      >
        <span className="font-mono text-micro uppercase tracking-widest text-accent">
          404 / Not found
        </span>
        <h1 className="mt-5 text-display font-semibold leading-[0.95] tracking-tightest text-text-primary">
          Wrong&nbsp;turn
          <span className="text-accent">.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-prose text-body-lg leading-relaxed text-text-secondary">
          You followed a link to a place that doesn&rsquo;t exist. Probably my
          fault — let me get you back on the road.
        </p>
        <Link
          to="/"
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-5 py-3 text-small font-medium text-text-primary transition-colors duration-250 hover:border-accent hover:text-accent"
        >
          <ArrowLeft
            size={14}
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to home
        </Link>
      </motion.div>
    </main>
  );
}
