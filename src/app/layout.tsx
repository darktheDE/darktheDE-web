import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { SEO_CONFIG, SITE_URLS, SOCIAL_LINKS, PERSONAL_INFO } from "@/data/config";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0e14",
  colorScheme: "dark",
};

const primarySiteUrl = SITE_URLS.primary;

export const metadata: Metadata = {
  metadataBase: new URL(primarySiteUrl),
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  keywords: [...SEO_CONFIG.keywords],
  authors: [{ name: `${PERSONAL_INFO.name} (${PERSONAL_INFO.nickname})`, url: primarySiteUrl }],
  creator: PERSONAL_INFO.nickname,
  publisher: PERSONAL_INFO.nickname,
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/assets/logo-favicon.png",
    shortcut: "/assets/logo-favicon.png",
    apple: "/assets/logo-favicon.png",
  },
  openGraph: {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    url: primarySiteUrl,
    siteName: "darktheDE Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/profile/profile01.png",
        width: 1200,
        height: 630,
        alt: `${SEO_CONFIG.title} - Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    images: ["/assets/profile/profile01.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URLS.githubPages}/#person`,
      name: PERSONAL_INFO.name,
      alternateName: [PERSONAL_INFO.nickname, "Do Kien Hung"],
      jobTitle: "Data Engineer",
      description: PERSONAL_INFO.description,
      url: SITE_URLS.githubPages,
      image: `${SITE_URLS.githubPages}/assets/profile/profile01.png`,
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "HCMUTE - Ho Chi Minh City University of Technology and Education",
      },
      sameAs: [
        SITE_URLS.githubPages,
        SITE_URLS.vercel,
        SOCIAL_LINKS.github,
        SOCIAL_LINKS.linkedin,
        SOCIAL_LINKS.facebook,
      ],
      knowsAbout: [
        "Data Engineering",
        "Lakehouse Architecture",
        "Big Data Pipelines",
        "Apache Spark",
        "Apache Airflow",
        "Delta Lake",
        "Agentic AI Workflows",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URLS.githubPages}/#website`,
      url: SITE_URLS.githubPages,
      name: "darktheDE - Data Engineer Portfolio",
      author: {
        "@id": `${SITE_URLS.githubPages}/#person`,
      },
      sameAs: [SITE_URLS.githubPages, SITE_URLS.vercel],
    },
  ];

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="page-trace" aria-hidden="true" />
        <Providers>
          <main id="main-content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}