import { cn } from "@/lib/cn";

/**
 * Mono eyebrow label shared across portfolio sections.
 * Used at the top of each section as a small uppercase label.
 */
export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.18em] text-mute",
        className
      )}
    >
      {children}
    </p>
  );
}