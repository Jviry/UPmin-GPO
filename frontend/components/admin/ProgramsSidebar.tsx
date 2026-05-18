'use client';

import { useState, useRef, useEffect } from 'react';

export function ProgramsSidebar({
  programs,
  activeProgramId,
  isCreating,
  selectProgram,
  setIsCreating,
  onDelete,
}: {
  programs: any[];
  activeProgramId: number | null;
  isCreating: boolean;
  selectProgram: (id: number) => void;
  setIsCreating: (val: boolean) => void;
  onDelete: (id: number) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r border-[var(--line)] bg-[var(--surface-muted)] py-8">
      <div className="flex items-center justify-between px-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)]">
          Programs
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          title="Create new program"
          className="flex h-5 w-5 items-center justify-center rounded-sm bg-[var(--up-maroon)] text-white transition hover:bg-[#5c0709] text-sm font-bold leading-none"
        >
          +
        </button>
      </div>
      <div className="mt-4 px-6">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full border border-[var(--line)] bg-white py-1.5 pl-8 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--up-maroon)] focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col" ref={menuRef}>
        {programs.filter((prog) => prog.name.toLowerCase().includes(search.toLowerCase())).map((prog) => (
          <div
            key={prog.program_id}
            className={`group relative flex items-center border-l-4 transition-colors ${!isCreating && activeProgramId === prog.program_id
              ? 'border-[var(--up-gold)] bg-white'
              : 'border-transparent hover:bg-gray-100'
              }`}
          >
            <button
              onClick={() => selectProgram(prog.program_id)}
              className={`flex-1 px-6 py-3 text-left text-sm font-semibold ${!isCreating && activeProgramId === prog.program_id
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-muted)]'
                }`}
            >
              {prog.name}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prog.program_id ? null : prog.program_id); }}
              className={`mr-2 flex h-6 w-6 shrink-0 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--text-primary)] ${openMenuId === prog.program_id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              title="Options"
            >
              <svg viewBox="0 0 4 16" width="4" height="16" fill="currentColor">
                <circle cx="2" cy="2" r="1.5" />
                <circle cx="2" cy="8" r="1.5" />
                <circle cx="2" cy="14" r="1.5" />
              </svg>
            </button>

            {openMenuId === prog.program_id && (
              <div className="absolute right-2 top-full z-50 mt-0.5 w-32 border border-[var(--line)] bg-white shadow-md">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(null);
                    onDelete(prog.program_id);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
