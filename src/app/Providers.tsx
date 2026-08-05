"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global framer-motion config. `reducedMotion="user"` reads the OS
 * `prefers-reduced-motion` media query and disables transforms / springs
 * for users who opted out. Single source for all client components.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  );
}
