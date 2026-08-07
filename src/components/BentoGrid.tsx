"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiCode,
  FiDatabase,
  FiExternalLink,
  FiGithub,
  FiLayers,
  FiTarget,
  FiUser,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { skillCategories } from "@/data/skills";
import {
  projects,
  PROJECT_FILTERS,
  PROJECT_PROOF,
  type Project,
  type CategoryTag,
} from "@/data/projects";
import { PERSONAL_INFO, SOCIAL_LINKS } from "@/data/config";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "@/lib/useFocusTrap";

const profileImages = [
  "/assets/profile/profile01.png",
  "/assets/profile/profile02.jpg",
  "/assets/profile/profile03.jpg",
  "/assets/profile/profile04.jpg",
  "/assets/profile/profile05.jpg",
  "/assets/profile/profile06.jpg",
  "/assets/profile/profile07.jpg",
  "/assets/profile/profile08.jpg",
];

const operatingProfile = [
  { title: "Data Systems" },
  { title: "Backend Thinking" },
  { title: "AI Workflow" },
];

function BentoItem({
  className,
  children,
  delay = 0,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  id?: string;
}) {
  return (
    <Motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative scroll-mt-28 overflow-hidden border border-rule bg-card p-6 backdrop-blur-md transition-all duration-500 hover:border-accent/30",
        className
      )}
    >
      {children}
    </Motion.div>
  );
}

function SectionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-2 text-accent">
      {icon}
      <span className="font-mono text-xs uppercase tracking-[0.22em]">
        {children}
      </span>
    </div>
  );
}

export function BentoGrid() {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number | null>(
    null
  );

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % profileImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    setSelectedProjectIdx(null);
  }, [activeFilter]);

  const filteredProjects = useMemo<Project[]>(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.categoryTag === activeFilter);
  }, [activeFilter]);

  const featuredProject = filteredProjects[0] ?? projects[0];
  const supportingProjects = filteredProjects.slice(1);

  const selectedProject =
    selectedProjectIdx !== null ? filteredProjects[selectedProjectIdx] : null;
  const projectDialogRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(projectDialogRef, selectedProject !== null, () =>
    setSelectedProjectIdx(null)
  );
  const closeProjectLightbox = () => setSelectedProjectIdx(null);
  const goPrevProject = () =>
    setSelectedProjectIdx((prev) =>
      prev !== null && prev > 0 ? prev - 1 : filteredProjects.length - 1
    );
  const goNextProject = () =>
    setSelectedProjectIdx((prev) =>
      prev !== null && prev < filteredProjects.length - 1 ? prev + 1 : 0
    );

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      id="bento"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <BentoItem id="about" className="md:col-span-4 lg:col-span-4">
          <div className="grid gap-7 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="mx-auto w-full max-w-[180px]">
              <div
                className="relative aspect-square overflow-hidden border border-accent/30 bg-ink shadow-2xl shadow-black/30"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
              >
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={currentImageIdx}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={profileImages[currentImageIdx]}
                      alt={`Portrait photo ${currentImageIdx + 1} of ${profileImages.length}`}
                      fill
                      sizes="180px"
                      priority={currentImageIdx === 0}
                      className="object-cover"
                    />
                  </Motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              </div>
            </div>

            <div>
              <SectionLabel icon={<FiUser className="h-5 w-5" />}>
                Operating Profile
              </SectionLabel>
              <h2 className="max-w-2xl text-2xl font-black leading-tight text-text sm:text-3xl">
                A data engineering learner turning academic projects into
                production-shaped systems.
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {operatingProfile.map((item) => (
                  <div
                    key={item.title}
                    className="border border-rule bg-panel/35 p-4 flex items-center justify-center min-h-[64px]"
                  >
                    <h3 className="text-sm font-bold text-text text-center">
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BentoItem>

        <BentoItem className="md:col-span-2 lg:col-span-2">
          <SectionLabel icon={<FiTarget className="h-5 w-5" />}>Signal</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {PERSONAL_INFO.metrics.map((metric) => (
              <div
                key={metric.label}
                className="border border-rule bg-ink p-4"
              >
                <div className="font-mono text-3xl font-bold text-text">
                  {metric.value}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-mute">
                  {metric.label}
                </div>
              </div>
            ))}
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="group col-span-2 flex items-center justify-between border border-accent/20 bg-accent/10 p-4 text-accent transition-colors hover:bg-accent/15"
            >
              <span className="font-semibold">Open GitHub Portfolio</span>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </BentoItem>

        <BentoItem id="stack" className="md:col-span-4 lg:col-span-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <SectionLabel icon={<FiCode className="h-5 w-5" />}>
                Technical Stack
              </SectionLabel>
              <h2 className="max-w-2xl text-2xl font-black text-text sm:text-3xl">
                Tools grouped by the work they support.
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category) => (
              <div
                key={category.title}
                className="border border-rule bg-ink/50 p-5"
              >
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  {category.title}
                </h3>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {category.skills.slice(0, 6).map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 text-sm text-mute"
                      >
                        <Icon aria-hidden="true" className={cn("h-5 w-5 shrink-0", skill.color)} />
                        <span className="min-w-0 text-xs leading-tight sm:text-sm">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </BentoItem>

        <div
          id="projects"
          className="scroll-mt-28 md:col-span-4 lg:col-span-6"
        >
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-5 flex flex-col justify-between gap-5 border-y border-rule py-6 sm:flex-row sm:items-end"
          >
            <div>
              <SectionLabel icon={<FiLayers className="h-5 w-5" />}>
                Selected Projects
              </SectionLabel>
              <h2 className="text-3xl font-black text-text">
                Case studies over screenshots.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {PROJECT_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "border px-3 py-2 text-xs font-semibold transition-colors",
                    activeFilter === filter
                      ? "border-accent bg-accent text-ink"
                      : "border-rule bg-panel/30 text-mute hover:border-accent/40 hover:text-text"
                  )}
                >
                  {filter.replace(" Engineering", "")}
                </button>
              ))}
            </div>
          </Motion.div>
        </div>

        {featuredProject && (
          <BentoItem className="md:col-span-4 lg:col-span-6 p-0" delay={0.1}>
            <div className="grid h-full md:grid-cols-[1.1fr_0.9fr]">
              <button
                type="button"
                onClick={() => setSelectedProjectIdx(0)}
                aria-label={`Open ${featuredProject.title} details`}
                className="relative min-h-[280px] overflow-hidden w-full text-left cursor-zoom-in group"
              >
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                <div className="absolute left-5 top-5 border border-accent/30 bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  Featured{" "}
                  {PROJECT_PROOF[featuredProject.categoryTag as CategoryTag] ??
                    "Project"}
                </div>
              </button>

              <div className="flex flex-col p-6">
                <div className="mb-4 flex items-center gap-2 text-accent">
                  <FiDatabase aria-hidden="true" focusable="false" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                    {featuredProject.categoryTag}
                  </span>
                </div>
                <h3 className="text-2xl font-black leading-tight text-text">
                  {featuredProject.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-mute">
                  {featuredProject.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredProject.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="border border-rule bg-panel/40 px-2.5 py-1 text-[11px] text-mute"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-4 pt-6">
                  <a
                    href={featuredProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                  >
                    <FiExternalLink aria-hidden="true" focusable="false" /> Case Study
                  </a>
                  <a
                    href={featuredProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-mute transition-colors hover:text-text"
                  >
                    <FiGithub aria-hidden="true" focusable="false" /> Source
                  </a>
                </div>
              </div>
            </div>
          </BentoItem>
        )}

        {supportingProjects.map((project, idx) => (
          <BentoItem
            key={project.id}
            className="md:col-span-2 lg:col-span-2 flex flex-col p-0"
            delay={0.15 + idx * 0.07}
          >
            <button
              type="button"
              onClick={() => setSelectedProjectIdx(idx + 1)}
              aria-label={`Open ${project.title} details`}
              className="relative block h-44 w-full overflow-hidden text-left cursor-zoom-in group"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
              <span className="absolute right-4 top-4 border border-accent/25 bg-ink/80 px-3 py-1 font-mono text-[10px] text-accent">
                {project.categoryTag}
              </span>
            </button>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold leading-tight text-text">
                {project.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-mute">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="border border-rule bg-panel/40 px-2 py-1 text-[10px] text-mute"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex gap-4 pt-5">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline"
                >
                  <FiExternalLink aria-hidden="true" focusable="false" /> Case
                </a>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-mute transition-colors hover:text-text"
                >
                  <FiGithub aria-hidden="true" focusable="false" /> Source
                </a>
              </div>
            </div>
          </BentoItem>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm overflow-y-auto"
            style={{ zIndex: "var(--z-lightbox)" }}
            onClick={closeProjectLightbox}
          >
            <Motion.div
              ref={projectDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-3xl bg-ink border border-rule p-6 flex flex-col gap-5 shadow-2xl overflow-y-auto max-h-[90vh]"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-rule/50 bg-surface">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
                <span className="absolute right-4 top-4 border border-accent/25 bg-ink/80 px-3 py-1 font-mono text-[10px] text-accent">
                  {selectedProject.categoryTag}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-text leading-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-sm sm:text-base leading-7 text-mute">
                  {selectedProject.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-rule bg-panel/40 px-2.5 py-1 text-[11px] text-mute"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-4 border-t border-rule pt-4">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-ink shadow-lg shadow-accent/20 transition-all hover:bg-accent-dim hover:shadow-accent/30"
                >
                  <FiExternalLink aria-hidden="true" focusable="false" /> Case Study
                </a>
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-rule bg-panel/30 px-5 py-2.5 text-xs font-mono font-semibold text-mute backdrop-blur-md transition-all hover:border-rule hover:text-text"
                >
                  <FiGithub aria-hidden="true" focusable="false" /> Source Code
                </a>
              </div>

              <button
                onClick={closeProjectLightbox}
                className="absolute top-4 right-4 bg-panel/50 p-2 text-mute transition-colors hover:text-text"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>

              <button
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  goPrevProject();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 border border-rule p-2 text-mute backdrop-blur-sm transition-colors hover:text-text hover:border-accent/45 hidden md:block"
                aria-label="Previous"
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  goNextProject();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 border border-rule p-2 text-mute backdrop-blur-sm transition-colors hover:text-text hover:border-accent/45 hidden md:block"
                aria-label="Next"
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}