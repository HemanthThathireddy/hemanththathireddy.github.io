// portfolio/src/components/primitives/SectionHeading.tsx
import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/cn';

export interface SectionHeadingProps {
  /** Two-digit numeric prefix, e.g. "01". Rendered in mono accent. */
  number: string;
  /** Small uppercase label after the rule. Defaults to "Section". */
  eyebrow?: string;
  /** Main section title. */
  title: string;
  /** Optional supporting paragraph. */
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Numbered section header used by every page section. Animates in via
 * scroll-into-view (whileInView), with the number / rule / eyebrow /
 * title / description each fading up in sequence.
 *
 * The element is a <header> with a single <h2> so the document outline
 * stays clean — page sections become discoverable in screen-reader
 * heading navigation.
 */
export function SectionHeading({
  number,
  eyebrow = 'Section',
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <motion.header
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
      className={cn(
        'mb-12 md:mb-16',
        isCenter && 'text-center',
        className,
      )}
    >
      <motion.div
        variants={fadeUpItem}
        className={cn(
          'flex items-center gap-3',
          isCenter && 'justify-center',
        )}
      >
        <span className="font-mono text-micro tracking-widest text-accent">
          {number}
        </span>
        <span aria-hidden className="h-px w-10 bg-border md:w-14" />
        <span className="font-mono text-micro uppercase tracking-widest text-text-secondary">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h2
        variants={fadeUpItem}
        className="mt-5 text-h2 font-semibold tracking-tight text-text-primary"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={fadeUpItem}
          className={cn(
            'mt-5 max-w-prose text-body-lg leading-relaxed text-text-secondary',
            isCenter && 'mx-auto',
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.header>
  );
}
