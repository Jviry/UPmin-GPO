'use client';

import { useState, useRef, useEffect } from 'react';

type ProgramsSidebarProps = {
  programs: any[];
  activeProgramId: number | null;
  isCreating: boolean;
  onSelectProgram: (id: number) => void;
  onSetIsCreating: (val: boolean) => void;
};

export function ProgramsSidebar({
  programs,
  activeProgramId,
  isCreating,
  onSelectProgram,
  onSetIsCreating,
}: ProgramsSidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
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
          onClick={() => onSetIsCreating(true)}
          title="Create new program"
          className="flex h-5 w-5 items-center justify-center rounded-sm bg-[var(--up-maroon)] text-white transition hover:bg-[#5c0709] text-sm font-bold leading-none"
        >
          +
        </button>
      </div>
      <div className="mt-4 flex flex-col" ref={menuRef}>
        {programs.map((prog) => (
          <div
            key={prog.program_id}
            className={`group relative flex items-center border-l-4 transition-colors ${
              !isCreating && activeProgramId === prog.program_id
                ? 'border-[var(--up-gold)] bg-white'
                : 'border-transparent hover:bg-gray-100'
            }`}
          >
            <button
              onClick={() => onSelectProgram(prog.program_id)}
              className={`flex-1 px-6 py-3 text-left text-sm font-semibold ${
                !isCreating && activeProgramId === prog.program_id
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {prog.name}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === prog.program_id ? null : prog.program_id);
              }}
              className={`mr-2 flex h-6 w-6 shrink-0 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--text-primary)] ${
                openMenuId === prog.program_id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
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