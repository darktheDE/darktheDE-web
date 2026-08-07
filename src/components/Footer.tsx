import {
  FiArrowRight,
  FiFacebook,
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";
import { SOCIAL_LINKS, PERSONAL_INFO } from "@/data/config";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-ink/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              Open to Data Engineering Intern/Fresher roles
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-text sm:text-3xl">
              Need someone who can think in pipelines, backend contracts, and
              AI-ready data products?
            </h2>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={SOCIAL_LINKS.email}
                className="inline-flex items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-ink transition-colors hover:bg-accent-dim"
              >
                Contact Me <FiArrowRight aria-hidden="true" focusable="false" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-rule bg-panel/30 px-5 py-3 font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent"
              >
                LinkedIn <FiLinkedin aria-hidden="true" focusable="false" />
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <p className="font-mono text-sm text-mute">
              darkthe<span className="text-accent">DE</span>
            </p>
            <p className="mt-2 text-xs text-mute">
              © 2026 {PERSONAL_INFO.name}. All rights reserved.
            </p>
            <div className="mt-5 flex gap-5 md:justify-end">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="text-mute transition-colors hover:text-accent"
                aria-label="GitHub Profile"
              >
                <FiGithub aria-hidden="true" focusable="false" size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-mute transition-colors hover:text-accent"
                aria-label="LinkedIn Profile"
              >
                <FiLinkedin aria-hidden="true" focusable="false" size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-mute transition-colors hover:text-accent"
                aria-label="Facebook Profile"
              >
                <FiFacebook aria-hidden="true" focusable="false" size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.email}
                className="text-mute transition-colors hover:text-accent"
                aria-label="Send Email"
              >
                <FiMail aria-hidden="true" focusable="false" size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}