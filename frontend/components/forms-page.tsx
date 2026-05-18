'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

// helper to get file url
const getFileUrl = (url: string) =>
  url && url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_API_URL}${url}`
    : url;

// helper to build forms list from program_application
const getProgramForms = (application: any) => {
  if (!application) return [];
  const forms = [];
  if (application.application_url && application.application_url !== 'TBA') {
    forms.push({ name: 'Application Form', file_url: getFileUrl(application.application_url) });
  }
  if (application.recommendation_url && application.recommendation_url !== 'TBA') {
    forms.push({ name: 'Recommendation Letter', file_url: getFileUrl(application.recommendation_url) });
  }
  if (application.fees_url && application.fees_url !== 'TBA') {
    forms.push({ name: 'Fees', file_url: getFileUrl(application.fees_url) });
  }
  return forms;
};

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
    </svg>
  );
}

export function FormsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [applicationUrl, setApplicationUrl] = useState<string>('#');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await apiClient.get('/programs');
        setPrograms(res.data.programs || res.data || []);
      } catch (error) {
        console.error("Failed to fetch programs for forms page:", error);
      }
    };
    const fetchOffice = async () => {
      try {
        const res = await apiClient.get('/office');
        if (res.data?.office?.application_google_url) {
          setApplicationUrl(res.data.office.application_google_url);
        }
      } catch (error) {
        console.error("Failed to fetch office data for forms page:", error);
      }
    };
    fetchPrograms();
    fetchOffice();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
        <section className="border-b-4 border-[var(--up-gold)] px-4 pb-20 pt-16 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-[1200px]">
            {/* Application CTA Banner */}
            <div className="mt-16 flex flex-col justify-between overflow-hidden rounded-sm border border-[var(--line)] border-l-4 border-l-[var(--up-gold)] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:flex-row md:items-center sm:p-10">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="[font-family:var(--font-display)] text-2xl font-bold text-[var(--up-maroon)] sm:text-3xl">
                  Interested? Apply Now!
                </h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--text-secondary)] sm:text-base">
                  Move up to higher heights with UP Mindanao's Graduate Programs. The digital application Google form can be accessed and completed via the button below.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-sm bg-[var(--up-green)] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#025c2e] hover:shadow-md"
                >
                  Open Form →
                </a>
              </div>
            </div>
            <h1 className="[font-family:var(--font-display)] text-4xl font-bold text-[var(--text-primary)] md:text-5xl lg:text-[4rem]">
              Forms &amp; Fees
            </h1>

            <div className="mt-12 space-y-10">
              {programs.length > 0 ? programs.map((program) => {
                const forms = getProgramForms(program.program_application);
                return (
                  <div key={program.program_id}>
                    <h2 className="[font-family:var(--font-display)] mb-3 text-xl font-bold text-[var(--text-primary)]">
                      {program.name}
                    </h2>
                    <div className="w-full overflow-hidden rounded-sm border border-[rgba(118,9,12,0.15)]">
                      {forms.length > 0 ? (
                        forms.map((form, i) => (
                          <div
                            key={i}
                            className={`grid grid-cols-[1fr_auto] items-center gap-6 px-5 py-3 ${i % 2 === 0 ? 'bg-[rgba(118,9,12,0.06)]' : 'bg-[rgba(118,9,12,0.11)]'
                              } ${i < forms.length - 1 ? 'border-b border-[rgba(118,9,12,0.12)]' : ''}`}
                          >
                            <span className="text-sm text-[var(--text-primary)] sm:text-[0.95rem]">
                              {form.name}
                            </span>

                            <a href={form.file_url}
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
                          No forms or files uploaded for this program yet.
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-[var(--text-muted)] italic">Loading program forms...</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
