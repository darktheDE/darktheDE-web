import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { RTICSection } from "@/components/RTICSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { Footer } from "@/components/Footer";

/**
 * Portfolio home — MVP clone of darktheDE-portfolio (Vite/React).
 * Order matches App.jsx: Navbar (sticky) → Hero → BentoGrid
 * (About + Signal + Stack + Projects) → RTIC → Certifications → Footer.
 * RTIC + Certifications are not lazy-loaded in MVP — simplifies first deploy.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text relative">
      <Navbar />

      <main id="main-content" className="relative z-10 space-y-10 pb-20">
        <Hero />
        <BentoGrid />
        <RTICSection />
        <CertificationsSection />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}