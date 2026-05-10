'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';

function ScholarshipCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scholarships, setScholarships] = useState<any[]>([]);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  };

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await apiClient.get('/scholarships');
        setScholarships(res.data.scholarships || res.data || []);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
      }
    };
    fetchScholarships();
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return undefined;
    const handleResize = () => updateScrollState();
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', handleResize);
    };
  }, [scholarships]);

  const scrollTrack = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 360, behavior: 'smooth' });
    window.setTimeout(updateScrollState, 180);
  };

  return (
    <section className="relative overflow-hidden border-t-4 border-[var(--up-gold)] bg-[var(--up-maroon)] px-2 py-0 sm:px-4 lg:px-6">
      <div className="mx-auto flex h-[calc(100dvh-var(--header-height))] w-full max-w-[1200px] flex-col py-6 sm:py-8 lg:py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="[font-family:var(--font-display)] text-4xl text-white sm:text-5xl lg:text-[4rem]">
              Scholarship Opportunities
            </h2>
            <div className="mt-3 h-[3px] w-16 bg-[var(--up-gold)]" />
          </div>
          <p className="hidden text-[0.65rem] uppercase tracking-[0.35em] text-[rgba(255,255,255,0.45)] md:block">
            Available grants
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-stretch">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-[linear-gradient(90deg,var(--up-maroon)_0%,rgba(118,9,12,0)_100%)] sm:w-12" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-[linear-gradient(270deg,var(--up-maroon)_0%,rgba(118,9,12,0)_100%)] sm:w-12" />
          )}

          {canScrollLeft && (
            <button
              type="button"
              aria-label="Previous scholarships"
              onClick={() => scrollTrack(-1)}
              className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(90,6,9,0.85)] text-lg text-[var(--up-gold)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:border-[var(--up-gold)] hover:bg-[rgba(90,6,9,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(243,170,44,0.6)]"
            >
              <span className="-translate-x-px leading-none transition-transform duration-200 hover:-translate-x-0.5">←</span>
            </button>
          )}
          {canScrollRight && scholarships.length > 0 && (
            <button
              type="button"
              aria-label="Next scholarships"
              onClick={() => scrollTrack(1)}
              className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(90,6,9,0.85)] text-lg text-[var(--up-gold)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:border-[var(--up-gold)] hover:bg-[rgba(90,6,9,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(243,170,44,0.6)]"
            >
              <span className="translate-x-px leading-none transition-transform duration-200 hover:translate-x-0.5">→</span>
            </button>
          )}

          <div
            ref={trackRef}
            className="modern-carousel flex h-full min-h-0 flex-1 snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden pb-2 xl:gap-6"
          >
            {scholarships.length > 0 ? scholarships.map((scholarship) => (
              <Link
                key={scholarship.scholarship_id}
                href={`/scholarships/${scholarship.scholarship_id}`}
                className="group relative flex h-full min-h-[380px] w-[272px] shrink-0 snap-start flex-col bg-[#faf6f0] text-left shadow-[0_8px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--up-gold)] sm:w-[288px] lg:w-[308px] cursor-pointer"
              >
                {/* Gold top accent strip */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--up-gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Image placeholder */}
                <div className="h-[58%] w-full shrink-0 bg-[var(--surface-muted)]" />

                {/* Text area */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="[font-family:var(--font-display)] text-[1.1rem] font-semibold leading-snug text-[var(--up-maroon)]">
                      {scholarship.name}
                    </h3>
                    <p className="mt-2 text-xs leading-[1.75] text-[#5a5450] line-clamp-4">{scholarship.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[rgba(118,9,12,0.12)] pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[var(--up-maroon)]">
                    <span>Learn more</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="flex h-full w-full items-center justify-center text-[rgba(255,255,255,0.7)] italic">
                No scholarship opportunities available at this time.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

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
      <ScholarshipCarousel />
    </>
  );
}