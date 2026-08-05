import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

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

export const metadata: Metadata = {
  title: "Đỗ Kiến Hưng (darktheDE) — Data Engineer",
  description:
    "Third-year Data Engineering student at HCM-UTE. I build reliable data systems from raw events to AI-ready products.",
  icons: {
    icon: "/assets/profile-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
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