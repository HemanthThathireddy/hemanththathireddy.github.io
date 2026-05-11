// portfolio/src/lib/cn.ts

/**
 * Minimal class-name joiner. Filters out falsy values so we can write
 * conditional classes inline without pulling clsx into the bundle.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}
