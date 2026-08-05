"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiUsers, FiX } from "react-icons/fi";
import { RTIC_INFO } from "@/data/config";
import { useFocusTrap } from "@/lib/useFocusTrap";

const impactItems = [
  "Academic seminars and workshops",
  "AI and software training",
  "Real-world student projects",
  "Academic contest preparation",
];

export function RTICSection() {
  const [showLightbox, setShowLightbox] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(dialogRef, showLightbox, () => setShowLightbox(false));

  return (
    <section
      className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-12 sm:px-6 lg:px-8"
      id="rtic"
    >
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden border border-rule bg-ink/70 px-6 py-8 backdrop-blur-md md:px-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-300">
              <FiUsers /> Community Leadership
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight text-text sm:text-4xl">
              Building a technical community through {RTIC_INFO.name}.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-mute sm:text-base">
              As {RTIC_INFO.role}, I help lead technical initiatives, mentor
              members in backend and business analysis, and turn student ideas
              into software projects with clearer execution paths.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {impactItems.map((item) => (
                <div
                  key={item}
                  className="border border-rule bg-panel/35 p-4 text-sm font-medium text-text"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="border-r border-rule pr-6">
                <div className="text-3xl font-black text-text">
                  {RTIC_INFO.memberCount}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-mute">
                  Members
                </div>
              </div>
              <div className="pr-4">
                <div className="text-3xl font-black text-text">
                  {RTIC_INFO.projectCount}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-mute">
                  Projects
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={RTIC_INFO.fanpage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-blue-400"
              >
                <FiExternalLink /> Fanpage
              </a>
              <a
                href={RTIC_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-rule bg-panel/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent"
              >
                <FiGithub /> GitHub
              </a>
            </div>
          </div>

          <button
            type="button"
            className="group relative mx-auto w-full max-w-md overflow-hidden border border-rule text-left shadow-2xl shadow-black/30"
            onClick={() => setShowLightbox(true)}
            aria-label="Open RTIC photo"
          >
            <Image
              src="/assets/rtic/rtic-pers-pic.jpg"
              alt="Me at FIT Club's Day — RTIC community photo"
              width={768}
              height={768}
              sizes="(min-width: 1024px) 420px, 100vw"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-semibold text-text">Me at FIT Club&apos;s Day</p>
              <p className="mt-1 text-xs text-mute">
                Leadership, community, and student technology culture.
              </p>
            </div>
          </button>
        </div>
      </Motion.div>

      <AnimatePresence>
        {showLightbox && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            style={{ zIndex: "var(--z-lightbox)" }}
            onClick={() => setShowLightbox(false)}
          >
            <Motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="RTIC photo"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              <Image
                src="/assets/rtic/rtic-pers-pic.jpg"
                alt="Me at FIT Club's Day — RTIC community photo"
                width={1024}
                height={1024}
                sizes="(min-width: 1024px) 896px, 100vw"
                className="max-h-[80vh] w-full object-contain"
              />
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute -top-12 right-0 p-2 text-mute transition-colors hover:text-text"
                aria-label="Close"
              >
                <FiX className="h-6 w-6" />
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}