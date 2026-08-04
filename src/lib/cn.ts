/**
 * Conditional className helper. Tiny wrapper around clsx + tailwind-merge
 * so callers don't need to remember which utility to import.
 *
 * For now just string concatenation — we'll add clsx/tailwind-merge
 * once we have a real need (e.g. component variants).
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}