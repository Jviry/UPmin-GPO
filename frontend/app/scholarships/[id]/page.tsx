'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getScholarshipById } from '../../../services/apiServices';
import { ScholarshipImage } from '../../../components/ScholarshipImage';
import { ScholarshipInfoBlock } from '../../../components/ScholarshipInfoBlock';
import { ScholarshipActionButtons } from '../../../components/ScholarshipActionButtons';

export default function SingleScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [scholarship, setScholarship] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchScholarship = async () => {
      try {
        setIsLoading(true);
        const data = await getScholarshipById(id);
        setScholarship(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load scholarship details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarship();
  }, [id]);

  return (
    <main className="min-h-screen bg-[var(--page-bg)] py-12 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl bg-[var(--surface)] p-8 shadow-sm border border-[var(--line)]">
        
        <button 
          onClick={() => router.back()}
          className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--up-maroon)] hover:underline"
        >
          ← Back
        </button>

        {isLoading && (
          <div className="py-20 text-center text-[var(--text-secondary)] animate-pulse">
            Loading scholarship...
          </div>
        )}

        {error && (
          <div className="py-20 text-center text-red-500">
            {error}
          </div>
        )}

        {!isLoading && !error && scholarship && (
          <article className="flow-root">
            <ScholarshipImage imageUrl={scholarship.image_url} name={scholarship.name} />

            <div className="mb-4 flex items-center gap-2">
              <div className="h-[2px] w-8 bg-[var(--up-gold)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--text-muted)]">
                Scholarship
              </p>
            </div>
            
            <h1 className="mb-6 text-3xl font-semibold leading-tight text-[var(--up-maroon)] sm:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              {scholarship.name}
            </h1>
            
            <div className="text-base leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap mb-8">
              {scholarship.description}
            </div>

            <ScholarshipInfoBlock title="Covered Programs" content={scholarship.covered_programs} />
            <ScholarshipInfoBlock title="Application Instructions" content={scholarship.application_instructions} />
            <ScholarshipInfoBlock title="Contact Information" content={scholarship.contact_info} />

            <ScholarshipActionButtons 
              applicationUrl={scholarship.application_url} 
              recommendationUrl={scholarship.recommendation_url} 
            />
          </article>
        )}
      </div>
    </main>
  );
}
