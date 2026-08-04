/**
 * Personal info. Single source of truth for portfolio identity.
 * No marketing copy — see AGENTS.md "plain student English" rule.
 */

export const PERSONAL = {
  name: "Kiến Hưng",
  handle: "darktheDE",
  // Hero thesis: ONE short sentence. No superlatives. (See AGENTS.md.)
  thesis: "Hi, I'm Kiến Hưng. I build data systems.",
  // Hero subtitle: 2 plain sentences. Concrete, not aspirational.
  subtitle:
    "I'm a Data Engineering student at HCM-UTE. I like clean schemas, working pipelines, and small docs that explain the big picture.",
  // Live site URL.
  siteUrl: "https://darkthede.github.io",
  // Social links — used in Hero + Footer.
  socials: {
    github: "https://github.com/darktheDE",
    linkedin: "https://www.linkedin.com/in/kien-hung-de/",
    email: "mailto:kienhung.de@gmail.com",
  },
  // Status badges shown next to the thesis (kept terse — see AGENTS.md voice).
  status: {
    primary: { label: "Active", note: "Open to SWE / Data Engineer internships" },
    secondary: { label: "Building", note: "This site + series on the build process" },
  },
} as const;

export type Personal = typeof PERSONAL;