// portfolio/src/components/sections/Contact.tsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { easing, fadeUpItem, staggerContainer } from '../../lib/animations';
import { SectionHeading } from '../primitives/SectionHeading';
import { cn } from '../../lib/cn';

/* ─────────────────────────────────────────────
   Static contact info. PLACEHOLDERS — replace
   with real values before launch.
   ───────────────────────────────────────────── */

const CONTACT = {
  email: 'hemantht255@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hemanth-thathireddy-656238165/',
  github: 'https://github.com/hemanththathireddy',
  resume: '<a href="/resume.pdf" target="_blank">Résumé</a>',
} as const;

/* ─────────────────────────────────────────────
   EmailChip
   Click → writes to clipboard, swaps the trailing
   icon to a check + "Copied" for 1.6s, then snaps
   back. Falls back gracefully on browsers without
   clipboard API.
   ───────────────────────────────────────────── */

function EmailChip({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!copied && !error) return;
    const id = window.setTimeout(() => {
      setCopied(false);
      setError(false);
    }, 1600);
    return () => window.clearTimeout(id);
  }, [copied, error]);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        // Fallback: synchronous selection + execCommand
        const tmp = document.createElement('input');
        tmp.value = email;
        document.body.appendChild(tmp);
        tmp.select();
        const ok = document.execCommand('copy');
        tmp.remove();
        if (!ok) throw new Error('copy failed');
      } else {
        await navigator.clipboard.writeText(email);
      }
      setCopied(true);
    } catch {
      setError(true);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      aria-label={`Copy email address ${email} to clipboard`}
      className={cn(
        'group inline-flex items-center gap-3 rounded-full border bg-surface-1 pl-5 pr-4 py-3',
        'transition-colors duration-300',
        copied
          ? 'border-teal text-teal'
          : 'border-border text-text-primary hover:border-accent hover:text-accent',
      )}
    >
      <Mail
        size={16}
        aria-hidden
        className="shrink-0 transition-transform duration-300 group-hover:rotate-[-6deg]"
      />
      <span className="font-mono text-small tracking-wide">{email}</span>
      <span aria-hidden className="h-4 w-px bg-border" />
      <span className="flex items-center gap-1.5 text-small font-medium">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: easing.spring }}
              className="flex items-center gap-1.5"
            >
              <Check size={14} aria-hidden />
              Copied
            </motion.span>
          ) : error ? (
            <motion.span
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-amber"
            >
              Couldn&rsquo;t copy
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5"
            >
              <Copy size={14} aria-hidden />
              Copy
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   SocialLink — icon + label + external arrow
   that translates on hover. Used for LinkedIn,
   GitHub, and Resume.
   ───────────────────────────────────────────── */

interface SocialLinkProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  external?: boolean;
}

function SocialLink({ href, label, Icon, external = true }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'group inline-flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-1 px-5 py-4',
        'text-small font-medium text-text-primary',
        'transition-colors duration-300 hover:border-accent',
      )}
    >
      <Icon
        size={18}
        aria-hidden
        className="shrink-0 text-text-secondary transition-colors duration-250 group-hover:text-accent"
      />
      <span>{label}</span>
      <ArrowUpRight
        size={14}
        aria-hidden
        className="ml-2 shrink-0 text-text-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
      />
    </motion.a>
  );
}

/* ─────────────────────────────────────────────
   StatusBadge — pulsing teal dot + label.
   The animate-pulse-glow keyframe lives in
   tailwind.config.ts.
   ───────────────────────────────────────────── */

function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.5, ease: easing.spring, delay: 0.2 }}
      className="inline-flex items-center gap-2.5 rounded-full border border-teal/30 bg-teal-muted px-4 py-1.5"
    >
      <span aria-hidden className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-pulse-glow rounded-full bg-teal opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal shadow-[0_0_10px_rgba(15,255,193,0.7)]" />
      </span>
      <span className="font-mono text-micro uppercase tracking-widest text-teal">
        Open to opportunities
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Contact — closing statement section + footer.
   The headline gets a blinking caret to mirror
   the hero's typing subtitle and book-end the
   page visually.
   ───────────────────────────────────────────── */

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative w-full overflow-hidden bg-bg py-section"
    >
      {/* Soft mesh-violet glow at the top to mark the section change */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgba(108,99,255,0.18), transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-content px-gutter">
        <SectionHeading
          number="05"
          eyebrow="Contact"
          title="The closing line."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-15% 0px' }}
          className="max-w-3xl"
        >
          <motion.div variants={fadeUpItem}>
            <StatusBadge />
          </motion.div>

          <motion.h3
            variants={fadeUpItem}
            className="mt-6 font-sans text-display font-semibold leading-[0.95] tracking-tightest text-text-primary md:mt-8"
          >
            Let&rsquo;s build
            <br />
            something
            <span aria-hidden className="text-accent">
              .
            </span>
            <span
              aria-hidden
              className="ml-2 inline-block h-[0.7em] w-[3px] translate-y-[2px] animate-caret-blink bg-accent align-baseline md:w-[4px]"
            />
          </motion.h3>

          <motion.p
            variants={fadeUpItem}
            className="mt-8 max-w-prose text-body-lg leading-relaxed text-text-secondary md:mt-10"
          >
            I&rsquo;m always up for a conversation about distributed systems,
            developer experience, or the boring infrastructure that makes the
            interesting stuff possible. The fastest way to reach me is email
            — copy below, or pick a side door.
          </motion.p>

          <motion.div
            variants={fadeUpItem}
            className="mt-10 md:mt-12"
          >
            <EmailChip email={CONTACT.email} />
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
          >
            <SocialLink
              href={CONTACT.linkedin}
              label="LinkedIn"
              Icon={Linkedin}
            />
            <SocialLink
              href={CONTACT.github}
              label="GitHub"
              Icon={Github}
            />
            <SocialLink
              href={CONTACT.resume}
              label="Résumé"
              Icon={Mail}
              external={false}
            />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-section border-t border-border-subtle pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-micro uppercase tracking-widest text-text-tertiary">
              Hemanth Thathireddy ·{' '}
              <span className="text-text-secondary">
                Built {new Date().getFullYear()}, in TypeScript &amp; pixels
              </span>
            </p>
            <a
              href="#home"
              className="group inline-flex items-center gap-2 font-mono text-micro uppercase tracking-widest text-text-secondary transition-colors duration-250 hover:text-accent"
            >
              <span>Back to top</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                ↑
              </span>
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
