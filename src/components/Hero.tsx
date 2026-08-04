import Link from "next/link";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { PERSONAL } from "@/data/personal";

/**
 * Hero — portfolio landing section.
 *
 * Layout (from AGENTS.md file layout → design notes):
 *   - serif thesis (Fraunces, 56-72px desktop)
 *   - mono eyebrow above thesis
 *   - 2 plain sentences below thesis (Inter)
 *   - 2 status cards (mono labels, plain notes)
 *
 * Constraints:
 *   - Dark-only, no light-mode toggle (see CLAUDE.md).
 *   - No marketing copy. (See AGENTS.md.)
 *   - No raw hex. Use Tailwind tokens: text-accent, bg-panel, border-rule, font-mono.
 */
export function Hero() {
  return (
    <section className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="mx-auto max-w-[920px]">
        <SectionEyebrow>portfolio · 2026</SectionEyebrow>

        <h1 className="mt-6 font-serif text-[44px] font-light leading-[1.05] tracking-[-0.01em] text-text md:text-[64px]">
          {PERSONAL.thesis}
        </h1>

        <p className="mt-6 max-w-[640px] font-sans text-[17px] leading-[1.6] text-mute md:text-[18px]">
          {PERSONAL.subtitle}
        </p>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <StatusCard
            label={PERSONAL.status.primary.label}
            note={PERSONAL.status.primary.note}
            accent="accent"
          />
          <StatusCard
            label={PERSONAL.status.secondary.label}
            note={PERSONAL.status.secondary.note}
            accent="warn"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] text-mute">
          <Link
            href={PERSONAL.socials.github}
            className="transition-colors hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </Link>
          <span aria-hidden="true" className="text-rule">
            ·
          </span>
          <Link
            href={PERSONAL.socials.linkedin}
            className="transition-colors hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </Link>
          <span aria-hidden="true" className="text-rule">
            ·
          </span>
          <Link
            href={PERSONAL.socials.email}
            className="transition-colors hover:text-accent"
          >
            email
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatusCard({
  label,
  note,
  accent,
}: {
  label: string;
  note: string;
  accent: "accent" | "warn";
}) {
  const dotClass = accent === "accent" ? "bg-accent" : "bg-warn";
  return (
    <div className="border border-rule bg-panel/60 px-5 py-4">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass}`}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
          {label}
        </span>
      </div>
      <p className="mt-2 text-[14px] leading-[1.5] text-text">{note}</p>
    </div>
  );
}