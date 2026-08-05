import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine clsx (conditional classes) + tailwind-merge (deduplicate conflicting
 * Tailwind utilities). Standard 2026 helper.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}