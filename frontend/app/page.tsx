import { Footer } from "@/components/footer";
import { HomeAnnouncements } from "@/components/home-announcements";
import { HomeAbout } from "@/components/home-about";
import { HomeHero } from "@/components/home-hero";
import { HomePrograms } from "@/components/home-programs";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <SiteHeader />
      <HomeHero />
      <HomeAbout />
      <HomePrograms />
      <HomeAnnouncements />
      <Footer />
    </main>
  );
}