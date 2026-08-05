"use client";

import { useEffect, type RefObject } from "react";

/**
 * Focus trap for modal-style overlays.
 * - Saves the previously-focused element on mount, restores on unmount.
 * - Cycles Tab / Shift+Tab between the first and last focusable element
 *   inside `containerRef`.
 * - Closes on Escape when `onEscape` is provided.
 *
 * Works with RSC client components. No external deps.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((el) => !el.hasAttribute("aria-hidden"));

    const first = getFocusable()[0];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey && activeEl === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && activeEl === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef, onEscape]);
}
