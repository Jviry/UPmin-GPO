import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import AboutGPO from "@/components/about-gpo";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <SiteHeader />
      <AboutGPO />
      <Footer />
    </main>
  );
}
