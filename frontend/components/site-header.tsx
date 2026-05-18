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
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programGroups, setProgramGroups] = useState<ProgramGroup[]>([]);
  const [applyUrl, setApplyUrl] = useState<string>('/forms');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProgramsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    const fetchHeaderData = async () => {
      try {
        const [programsRes, officeRes] = await Promise.all([
          apiClient.get('/programs'),
          apiClient.get('/office')
        ]);

        const programData: ProgramData[] = programsRes.data.programs || programsRes.data;
        const grouped = programData.reduce((acc, curr) => {
          const groupName = curr.type || 'Other Programs';
          let group = acc.find(g => g.name === groupName);
          if (!group) {
            group = { name: groupName, programs: [] };
            acc.push(group);
          }
          group.programs.push({ label: curr.name, slug: String(curr.program_id) });
          return acc;
        }, [] as ProgramGroup[]);

        setProgramGroups(grouped);

        const officeData = officeRes.data.office || officeRes.data[0] || officeRes.data;
        if (officeData?.application_google_url) {
          setApplyUrl(officeData.application_google_url);
        }
      } catch (error) {
        console.error("Failed to load header data:", error);
      }
    };

    fetchHeaderData();
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileProgramsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,255,255,0.92)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          {/* Logo */}
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

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.22em] text-[var(--text-muted)] md:flex">
            <a href="/" className="transition-colors duration-200 hover:text-[var(--up-maroon)]">Home</a>
            <a href="/about-gpo" className="transition-colors duration-200 hover:text-[var(--up-maroon)]">About</a>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProgramsOpen((o) => !o)}
                className="flex items-center gap-1 uppercase transition-colors duration-200 hover:text-[var(--up-maroon)]"
              >
                Programs
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${programsOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {programsOpen && (
                <div className="absolute left-1/2 top-full mt-3 w-[540px] -translate-x-1/2 overflow-hidden rounded-sm border border-[var(--line)] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
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

          {/* Desktop Apply Now + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center rounded-full border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#5c0709] hover:border-[#5c0709]"
            >
              Apply Now
            </a>

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-primary)] transition-colors hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)] md:hidden"
            >
              {mobileMenuOpen ? (
                /* X icon */
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile side drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Menu</span>
          <button
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <a
            href="/"
            onClick={closeMobileMenu}
            className="rounded-md px-3 py-3 transition-colors hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)]"
          >
            Home
          </a>
          <a
            href="/about-gpo"
            onClick={closeMobileMenu}
            className="rounded-md px-3 py-3 transition-colors hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)]"
          >
            About
          </a>

          {/* Programs accordion */}
          <div>
            <button
              onClick={() => setMobileProgramsOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-md px-3 py-3 transition-colors hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)]"
            >
              <span className="uppercase">Programs</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileProgramsOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileProgramsOpen && (
              <div className="mt-1 flex flex-col gap-3 pl-4 pr-2">
                {programGroups.length > 0 ? programGroups.map((group) => (
                  <div key={group.name}>
                    <p className="mb-1 px-3 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--up-maroon)] opacity-70">
                      {group.name}
                    </p>
                    {group.programs.map((prog) => (
                      <a
                        key={prog.slug}
                        href={`/programs/${prog.slug}`}
                        onClick={closeMobileMenu}
                        className="block rounded px-3 py-2 text-[0.75rem] font-normal normal-case tracking-normal text-[var(--text-primary)] transition-colors hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)]"
                      >
                        {prog.label}
                      </a>
                    ))}
                  </div>
                )) : (
                  <p className="px-3 py-2 text-xs text-[var(--text-muted)]">Loading programs...</p>
                )}
              </div>
            )}
          </div>

          <a
            href="/forms"
            onClick={closeMobileMenu}
            className="rounded-md px-3 py-3 transition-colors hover:bg-[rgba(118,9,12,0.06)] hover:text-[var(--up-maroon)]"
          >
            Forms
          </a>
        </nav>

        {/* Apply Now at the bottom of the drawer */}
        <div className="border-t border-[var(--line)] px-5 py-4">
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
            className="flex w-full items-center justify-center rounded-full border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#5c0709] hover:border-[#5c0709]"
          >
            Apply Now
          </a>
        </div>
      </aside>
    </>
  );
}