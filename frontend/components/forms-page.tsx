'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
    </svg>
  );
}

export function FormsPage() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await apiClient.get('/programs');
        setPrograms(res.data.programs || res.data || []);
      } catch (error) {
        console.error("Failed to fetch programs for forms page:", error);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
        <section className="border-b-4 border-[var(--up-gold)] px-4 pb-20 pt-16 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="[font-family:var(--font-display)] text-4xl font-bold text-[var(--text-primary)] md:text-5xl lg:text-[4rem]">
            Forms &amp; Fees
          </h1>

          <div className="mt-12 space-y-10">
            {programs.length > 0 ? programs.map((program) => (
              <div key={program.program_id}>
                <h2 className="[font-family:var(--font-display)] mb-3 text-xl font-bold text-[var(--text-primary)]">
                  {program.name}
                </h2>

                <div className="w-full overflow-hidden rounded-sm border border-[rgba(118,9,12,0.15)]">
                  {program.programForms && program.programForms.length > 0 ? (
                    program.programForms.map((form: any, i: number) => (
                      <div
                        key={form.form_id || i}
                        className={`grid grid-cols-[1fr_auto] items-center gap-6 px-5 py-3 ${
                          i % 2 === 0 ? 'bg-[rgba(118,9,12,0.06)]' : 'bg-[rgba(118,9,12,0.11)]'
                        } ${i < program.programForms.length - 1 ? 'border-b border-[rgba(118,9,12,0.12)]' : ''}`}
                      >
                        <span className="text-sm text-[var(--text-primary)] sm:text-[0.95rem]">
                          {form.name}
                        </span>
                        <a
                          href={form.file_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--up-maroon)] px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-150 hover:bg-[#5c0709]"
                        >
                          <DownloadIcon />
                          Download
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-4 text-sm text-[var(--text-muted)] italic bg-[rgba(118,9,12,0.03)]">
                      No specific forms or files uploaded for this program yet.
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-[var(--text-muted)] italic">Loading program forms...</div>
            )}
          </div>
        </div>
      </section>
      </main>
    </>
  );
}