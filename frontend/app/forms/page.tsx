import { SiteHeader } from '@/components/site-header';
import { Footer } from '@/components/footer';
import { FormsPage } from '@/components/forms-page';
import { ScholarshipCarousel } from '@/components/ScholarshipCarousel';

export default function Forms() {
  return (
    <>
      <SiteHeader />
      <FormsPage />
      <ScholarshipCarousel />
      <Footer />
    </>
  );
}
