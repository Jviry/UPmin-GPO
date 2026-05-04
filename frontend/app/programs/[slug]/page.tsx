import { Footer } from '@/components/footer';
import { GraduateProgramDetail } from '@/components/graduate-program-detail';
import { SiteHeader } from '@/components/site-header';

type ProgramPageProps = {
  params: { slug?: string } | Promise<{ slug?: string }>;
};

function toTitleCase(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const programTitle = toTitleCase(resolvedParams.slug ?? 'Graduate Program');

  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <SiteHeader />
      <GraduateProgramDetail programTitle={programTitle} />
      <Footer />
    </main>
  );
}
