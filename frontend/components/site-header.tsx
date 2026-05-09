'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

type ProgramData = {
  program_id: number;
  name: string;
  type: string;
};

type ProgramGroup = {
  name: string;
  programs: { label: string; slug: string }[];
};

export function SiteHeader() {
  const [programsOpen, setProgramsOpen] = useState(false);
  const [programGroups, setProgramGroups] = useState<ProgramGroup[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click outside listener for dropdown
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProgramsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    
    // Fetch programs and group them by their type (e.g., "Graduate Program", "Diploma Program")
    const fetchPrograms = async () => {
      try {
        const res = await apiClient.get('/programs');
        const data: ProgramData[] = res.data.programs || res.data;

        // Dynamically group the fetched programs by their Type
        const grouped = data.reduce((acc, curr) => {
          const groupName = curr.type || 'Other Programs';
          let group = acc.find(g => g.name === groupName);
          
          if (!group) {
            group = { name: groupName, programs: [] };
            acc.push(group);
          }
          
          group.programs.push({
            label: curr.name,
            slug: String(curr.program_id) // We use program_id as the slug
          });
          
          return acc;
        }, [] as ProgramGroup[]);

        setProgramGroups(grouped);
      } catch (error) {
        console.error("Failed to load programs for header:", error);
      }
    };

    fetchPrograms();

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
                {/* Dynamically scales columns based on how many program types exist (max 3 per row) */}
                <div className={`grid grid-cols-${Math.min(programGroups.length || 1, 3)} divide-x divide-[var(--line)]`}>
                  {programGroups.length > 0 ? programGroups.map((group) => (
                    <div key={group.name} className="flex flex-col p-4">
                      <p className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--up-maroon)] opacity-70">
                        {group.name}
                      </p>
                      <div className="flex flex-col gap-1">
                        {group.programs.map((prog) => (
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
                  )) : (
                    <div className="p-4 text-xs text-[var(--text-muted)]">Loading programs...</div>
                  )}
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