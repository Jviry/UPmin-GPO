'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const departments = [
  {
    name: 'Department Alpha',
    programs: [
      { label: 'Program Alpha', slug: 'program-alpha' },
      { label: 'Program Beta', slug: 'program-beta' },
      { label: 'Program Gamma', slug: 'program-gamma' },
    ],
  },
  {
    name: 'Department Beta',
    programs: [
      { label: 'Program Delta', slug: 'program-delta' },
      { label: 'Program Epsilon', slug: 'program-epsilon' },
      { label: 'Program Zeta', slug: 'program-zeta' },
    ],
  },
  {
    name: 'Department Gamma',
    programs: [
      { label: 'Program Eta', slug: 'program-eta' },
      { label: 'Program Theta', slug: 'program-theta' },
      { label: 'Program Iota', slug: 'program-iota' },
    ],
  },
];


export function SiteHeader() {
  const [programsOpen, setProgramsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProgramsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,255,255,0.92)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <a href="/" className="flex items-center gap-3 text-[var(--text-primary)]">
          <Image
            src="/Unibersidad_ng_Pilipinas_Mindanao.png"
            alt="University of the Philippines Mindanao"
            width={44}
            height={44}
            className="rounded-full"
            style={{ width: 44, height: 'auto' }}
          />
          <div className="leading-tight">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--text-muted)]">University of the Philippines - Mindanao</p>
            <p className="text-sm font-semibold">Graduate Programs Office</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.22em] text-[var(--text-muted)] md:flex">
          <a href="/" className="transition-colors duration-200 hover:text-[var(--up-maroon)]">Home</a>
          <a href="/about-gpo" className="transition-colors duration-200 hover:text-[var(--up-maroon)]">About</a>

          {/* Programs dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setProgramsOpen((o) => !o)}
              className="flex items-center gap-1 uppercase transition-colors duration-200 hover:text-[var(--up-maroon)]"
            >
              Programs
            </button>

            {programsOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-[540px] -translate-x-1/2 overflow-hidden rounded-sm border border-[var(--line)] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
                <div className="grid grid-cols-3 divide-x divide-[var(--line)]">
                  {departments.map((dept) => (
                    <div key={dept.name} className="flex flex-col p-4">
                      <p className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--up-maroon)] opacity-70">
                        {dept.name}
                      </p>
                      <div className="flex flex-col gap-1">
                        {dept.programs.map((prog) => (
                          <a
                            key={prog.slug}
                            href={`/programs/${prog.slug}`}
                            onClick={() => setProgramsOpen(false)}
                            className="rounded px-2 py-1.5 text-[0.72rem] font-normal normal-case tracking-normal text-[var(--text-primary)] transition-colors duration-150 hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)]"
                          >
                            {prog.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a href="/forms" className="transition-colors duration-200 hover:text-[var(--up-maroon)]">Forms</a>
        </nav>

        <a
          href="#forms"
          className="inline-flex items-center justify-center rounded-full border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#5c0709] hover:border-[#5c0709]"
        >
          Apply Now
        </a>
      </div>
    </header>
  );
}