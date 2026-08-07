/**
 * Centralized configuration — personal info, social links, RTIC info, asset paths.
 * Hand-ported from darktheDE-portfolio/src/data/config.js (2026-08-05 MVP clone).
 */

export const PERSONAL_INFO = {
  name: "Đỗ Kiến Hưng",
  nickname: "darktheDE",
  title: "Data Engineering Student @ HCM-UTE",
  tagline:
    "I build reliable data systems from raw events to AI-ready products.",
  description:
    "Third-year Data Engineering student focused on lakehouse architecture, big data pipelines, backend systems, and agentic AI workflows.",
  specialties: [
    "Lakehouse Architecture",
    "Big Data Pipelines",
    "Agentic AI Workflows",
  ],
  metrics: [
    { label: "Current GPA", value: "8.41" },
    { label: "Featured Projects", value: "9" },
    { label: "Vice Leader", value: "RTIC" },
  ],
} as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/darktheDE",
  linkedin: "https://www.linkedin.com/in/darkthede/",
  facebook: "https://www.facebook.com/dkh1105/",
  email: "mailto:dkh1105.work@gmail.com",
  blog: "/blog",
} as const;

export const RTIC_INFO = {
  name: "HCMUTE RTIC",
  fullName: "HCMUTE Research on Technology & Innovation Club",
  role: "Vice Leader & Co-Founder",
  memberCount: "40+",
  projectCount: "15+",
  fanpage: "https://www.facebook.com/hcmute.rtic",
  github: "https://github.com/HCMUTE-RTIC",
  website: "https://hcmutertic.com/",
} as const;

function resolvePrimarySiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

  if (configuredUrl && !configuredUrl.includes("localhost")) {
    return configuredUrl;
  }

  return vercelUrl || "https://darkthede.github.io";
}

export const SITE_URLS = {
  githubPages: "https://darkthede.github.io",
  vercel: "https://darkthede-web.vercel.app",
  primary: resolvePrimarySiteUrl(),
} as const;

export const SEO_CONFIG = {
  title: "darktheDE - Data Engineer",
  description:
    "Third-year Data Engineering student at HCM-UTE. I build reliable data systems from raw events to AI-ready products.",
  keywords: [
    "Data Engineer",
    "darktheDE",
    "Đỗ Kiến Hưng",
    "HCM-UTE",
    "Lakehouse Architecture",
    "Big Data Pipelines",
    "Apache Spark",
    "Apache Airflow",
    "Delta Lake",
    "Data Engineering Portfolio",
    "RTIC Vice Leader",
    "Data Engineering Vietnam",
  ],
} as const;

export const ASSETS = {
  cvData: "/CV_DATA_OF_DO_KIEN_HUNG.pdf",
  cvSoftware: "/CV_SOFTWARE_OF_DO_KIEN_HUNG.pdf",
  profileImage: "/assets/profile/profile01.png",
  favicon: "/assets/logo-favicon.png",
} as const;