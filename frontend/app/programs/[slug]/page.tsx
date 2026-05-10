import { GraduateProgramDetail } from "@/components/graduate-program-detail";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-[var(--page-bg)]">
      <SiteHeader />
      <GraduateProgramDetail programId={resolvedParams.slug} />
      <Footer />
    </main>
  );
}
