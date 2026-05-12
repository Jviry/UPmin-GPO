'use client';

import { useState, useEffect, useRef } from 'react';
import { StudyPlanBuilder } from '@/components/admin/StudyPlanBuilder';
import FacultyPool from '@/components/admin/FacultyPool';
import { ApplicationSection } from '@/components/admin/ApplicationSection';
import { apiClient } from '@/lib/apiClient';
import LoadingScreen from '@/components/admin/LoadingScreen';

// Types based on Prisma Schema
type Faculty = {
  faculty_id: number;
  name: string;
  position: string;
  email: string;
};

type Department = {
  department_id: number;
  name: string;
  faculty: Faculty[];
};

type Program = {
  program_id: number;
  name: string;
  description: string;
  department_id: number;
  department?: Department;
  forms?: {
    form_id: number;
    name: string;
    type: string;
    size: string;
    upload_date: string;
  }[];
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProgramId, setActiveProgramId] = useState<number | null>(null);
  const [activeProgramDetails, setActiveProgramDetails] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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

  // Fetch programs list + first program details together so nothing flashes
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const listRes = await apiClient.get('/programs');
        const fetchedPrograms = listRes.data.programs || listRes.data;
        setPrograms(fetchedPrograms);

        if (fetchedPrograms.length > 0) {
          const firstId = fetchedPrograms[0].program_id;
          const detailRes = await apiClient.get(`/programs/${firstId}`);
          setActiveProgramId(firstId);
          setActiveProgramDetails(detailRes.data.program || detailRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Fetch details when switching programs after initial load
  const selectProgram = async (id: number) => {
    if (id === activeProgramId) return;
    setActiveProgramId(id);
    setActiveProgramDetails(null);
    setIsCreating(false);
    setOpenMenuId(null);
    setIsLoadingDetails(true);
    try {
      const res = await apiClient.get(`/programs/${id}`);
      setActiveProgramDetails(res.data.program || res.data);
    } catch (error) {
      console.error("Failed to fetch program details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* Left Sidebar: Program List */}
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
        <div className="mt-4 flex flex-col" ref={menuRef}>
          {programs.map((prog) => (
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

              {/* Three-dot button — visible on hover or when menu is open */}
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

              {/* Dropdown */}
              {openMenuId === prog.program_id && (
                <div className="absolute right-2 top-full z-50 mt-0.5 w-32 border border-[var(--line)] bg-white shadow-md">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
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

      {/* Right Content Area */}
      <main className="flex-1 overflow-y-auto space-y-8 p-8">

        {isLoadingDetails ? <LoadingScreen /> : isCreating ? (
          <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
                Create New Graduate Program
              </h2>
            </div>

            <div className="mb-6 grid grid-cols-4 gap-6">
              <div className="col-span-3 flex flex-col gap-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
                    placeholder="Name of Program"
                  />
                  <input
                    type="text"
                    className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
                    placeholder="Department"
                  />
                </div>
                <textarea
                  className="flex-1 min-h-[140px] resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
                  placeholder="About Graduate Program..."
                />
              </div>

              <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center transition hover:border-[var(--up-maroon)]">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured Photo</span>
                <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
              <button
                onClick={() => setIsCreating(false)}
                className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">
                Save
              </button>
            </div>
          </section>
        ) : activeProgramDetails ? (
          <>
            {/* Block 1: Edit Program Information */}
            <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
                  Edit Program Information
                </h2>
              </div>

              <div className="mb-6 grid grid-cols-4 gap-6">
                <div className="col-span-3 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      defaultValue={activeProgramDetails.name}
                      className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
                      placeholder="Name of Program"
                    />
                    <input
                      type="text"
                      defaultValue={activeProgramDetails.department?.name || ''}
                      className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
                      placeholder="Department"
                    />
                  </div>
                  <textarea
                    defaultValue={activeProgramDetails.description}
                    className="flex-1 min-h-[140px] resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
                    placeholder="About Graduate Program..."
                  />
                </div>

                <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center transition hover:border-[var(--up-maroon)]">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured Photo</span>
                  <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
                </div>
              </div>

              <div className="mb-8">
                {/* Pass the activeProgramId to the builder so it can fetch the specific 
                  Courses, Study Plans, and Pools tied to this specific program in the database.
                */}
                <StudyPlanBuilder programId={activeProgramId} />
              </div>

              <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
                <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Cancel</button>
                <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Save</button>
              </div>
            </section>

            {/* Block 2: Edit Application Information */}
            <ApplicationSection
              programId={activeProgramId!}
              application={(activeProgramDetails as any).program_application}
            />

            {/* Block 3: Faculty Management */}
            <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
                  Faculty Management
                </h2>
              </div>

              <FacultyPool programId={activeProgramId!} programName={activeProgramDetails.name} />
            </section>
          </>
        ) : (
          <div className="flex h-[400px] items-center justify-center text-[var(--text-muted)]">
            Select a program from the left sidebar to edit.
          </div>
        )}
        {/* Block 3: Forms & Fees File Management */}
        {!isCreating && !isLoadingDetails && <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Forms & Fees File Management
            </h2>
          </div>

          <div className="mb-8 flex h-[250px] flex-col overflow-hidden border border-[var(--line)] bg-white">
            <div className="modern-scrollbar flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--page-bg)]">
              {activeProgramDetails?.forms && activeProgramDetails.forms.length > 0 ? (
                activeProgramDetails.forms.map((file: any) => (
                  <div
                    key={file.form_id}
                    className="flex items-center justify-between rounded border border-[var(--line)] bg-white p-4 shadow-sm transition hover:border-[var(--up-gold)] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Document Icon Box */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[var(--surface-muted)] font-bold text-[var(--up-maroon)] text-xs">
                        {file.type === "PDF" ? "PDF" : "DOC"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[var(--text-primary)]">{file.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Uploaded {new Date(file.upload_date).toLocaleDateString()} • {file.size}
                        </p>
                      </div>
                    </div>

                    {/* Select Checkbox (Visual Only) */}
                    <div className="h-4 w-4 rounded-sm border border-[var(--text-muted)]"></div>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                  No forms or files uploaded for this program yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
            <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
            <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
            <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Upload File</button>
          </div>
        </section>}
      </main>
    </div>
  );
}
