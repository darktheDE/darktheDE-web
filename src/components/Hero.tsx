"use client";

import Link from "next/link";
import { motion as Motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiDownload } from "react-icons/fi";
import { PERSONAL_INFO, ASSETS } from "@/data/config";

const focusAreas = ["Spark", "Airflow", "Lakehouse", "Backend", "AI Agents"];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-7xl lg:min-h-[calc(92vh-7rem)] flex flex-col justify-center py-12"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-sm text-mute sm:text-base">
            Hi, I&apos;m {PERSONAL_INFO.name}
          </p>
          <h1
            aria-label={`${PERSONAL_INFO.nickname} builds data systems`}
            className="mt-3 max-w-4xl text-4xl font-black leading-[1.03] tracking-normal text-text sm:text-6xl lg:text-7xl"
          >
            {PERSONAL_INFO.nickname}
            <span
              aria-hidden="true"
              className="block bg-gradient-to-r from-accent via-sky-300 to-accent bg-clip-text text-transparent"
            >
              builds data systems.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-mute sm:text-lg">
            {PERSONAL_INFO.tagline} Currently sharpening lakehouse
            architecture, big data pipelines, backend services, and agentic AI
            workflows.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {focusAreas.map((area) => (
              <span
                key={area}
                className="border border-rule bg-panel/40 px-3 py-1.5 text-xs font-medium text-mute"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 bg-accent px-6 py-3 font-semibold text-ink shadow-lg shadow-accent/20 transition-all hover:bg-accent-dim hover:shadow-accent/30"
            >
              View Data Projects <FiArrowRight className="shrink-0" />
            </a>
            <a
              href={ASSETS.cvData}
              download
              className="inline-flex items-center justify-center gap-2 border border-accent/30 bg-surface/70 px-6 py-3 font-semibold text-accent backdrop-blur-md transition-all hover:border-accent hover:bg-accent/10"
            >
              <FiDownload className="shrink-0" /> Download Data CV
            </a>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 border border-rule bg-panel/40 px-6 py-3 font-semibold text-text backdrop-blur-md transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
            >
              <FiBookOpen className="shrink-0 text-accent" /> Read Blog
            </Link>
          </div>
        </div>
      </Motion.div>
    </section>
  );
}