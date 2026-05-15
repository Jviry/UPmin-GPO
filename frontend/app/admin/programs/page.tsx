'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { deleteProgram, verifyPassword } from '@/services/apiServices';
import LoadingScreen from '@/components/admin/LoadingScreen';
import FacultyPool from '@/components/admin/FacultyPool';
import { ProgramsSidebar } from '@/components/admin/ProgramsSidebar';
import { CreateProgramBlock } from '@/components/admin/CreateProgramBlock';
import { EditProgramInfoBlock } from '@/components/admin/EditProgramInfoBlock';
import { FormsFeesManagementBlock } from '@/components/admin/FormsFeesManagementBlock';
import { ApplicationSection } from '@/components/admin/ApplicationSection';
import { CourseManagementBlock } from '@/components/admin/CourseManagementBlock';

export type Program = {
  program_id: number;
  name: string;
  type: string;
  description: string;
  history: string;
  photo?: string | null;
  forms?: {
    form_id: number;
    name: string;
    type: string;
    size: string;
    upload_date: string;
  }[];
  program_application?: any;
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProgramId, setActiveProgramId] = useState<number | null>(null);
  const [activeProgramDetails, setActiveProgramDetails] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const fetchProgramDetails = async (id: number) => {
    const res = await apiClient.get(`/programs/${id}`);
    return res.data.program || res.data;
  };

  // Fetch programs list + first program details together so nothing flashes
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const listRes = await apiClient.get('/programs');
        const fetchedPrograms = listRes.data.programs || listRes.data;
        setPrograms(fetchedPrograms);

        if (fetchedPrograms.length > 0) {
          const firstId = fetchedPrograms[0].program_id;
          const details = await fetchProgramDetails(firstId);
          setActiveProgramId(firstId);
          setActiveProgramDetails(details);
        }
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const selectProgram = async (id: number) => {
    if (id === activeProgramId) return;
    setActiveProgramId(id);
    setActiveProgramDetails(null);
    setIsCreating(false);
    setIsLoadingDetails(true);
    try {
      const details = await fetchProgramDetails(id);
      setActiveProgramDetails(details);
    } catch (error) {
      console.error('Failed to fetch program details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCreated = async (newProgram: any) => {
    // Re-fetch list and select the newly created program
    try {
      const listRes = await apiClient.get('/programs');
      const fetchedPrograms = listRes.data.programs || listRes.data;
      setPrograms(fetchedPrograms);
      const details = await fetchProgramDetails(newProgram.program_id);
      setActiveProgramId(newProgram.program_id);
      setActiveProgramDetails(details);
    } catch (error) {
      console.error('Failed to refresh after create:', error);
    }
    setIsCreating(false);
  };

  const handleSaved = async (updated: any) => {
    // Refresh sidebar list name + active details
    try {
      const listRes = await apiClient.get('/programs');
      const fetchedPrograms = listRes.data.programs || listRes.data;
      setPrograms(fetchedPrograms);
      const details = await fetchProgramDetails(updated.program_id);
      setActiveProgramDetails(details);
    } catch (error) {
      console.error('Failed to refresh after save:', error);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteError(null);
    setDeletePassword('');
    setShowDeletePassword(false);
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password to confirm.');
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await verifyPassword(deletePassword);
      await deleteProgram(deleteTargetId);
      const remaining = programs.filter((p) => p.program_id !== deleteTargetId);
      setPrograms(remaining);

      if (activeProgramId === deleteTargetId) {
        if (remaining.length > 0) {
          const nextId = remaining[0].program_id;
          setActiveProgramId(nextId);
          setIsLoadingDetails(true);
          const details = await fetchProgramDetails(nextId);
          setActiveProgramDetails(details);
          setIsLoadingDetails(false);
        } else {
          setActiveProgramId(null);
          setActiveProgramDetails(null);
        }
      }
      setDeleteTargetId(null);
      setDeletePassword('');
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  const deleteTargetName = programs.find((p) => p.program_id === deleteTargetId)?.name ?? '';

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      <ProgramsSidebar
        programs={programs}
        activeProgramId={activeProgramId}
        isCreating={isCreating}
        selectProgram={selectProgram}
        setIsCreating={setIsCreating}
        onDelete={handleDeleteRequest}
      />

      <main className="flex-1 overflow-y-auto space-y-8 p-8">
        {isLoadingDetails ? (
          <LoadingScreen />
        ) : isCreating ? (
          <CreateProgramBlock onCancel={() => setIsCreating(false)} onCreated={handleCreated} />
        ) : activeProgramDetails ? (
          <>
            <EditProgramInfoBlock
              programId={activeProgramId!}
              program={activeProgramDetails}
              onSaved={handleSaved}
            />

            <CourseManagementBlock programId={activeProgramId!} />

            <ApplicationSection
              programId={activeProgramId!}
              application={(activeProgramDetails as any).program_application}
            />

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

        {!isCreating && !isLoadingDetails && activeProgramDetails && (
          <FormsFeesManagementBlock program={activeProgramDetails} />
        )}
      </main>

      {/* Delete confirmation modal with password verification */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm border border-[var(--line)] bg-white p-8 shadow-lg">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Delete Program
            </h3>
            <p className="mb-5 text-sm text-[var(--text-secondary)]">
              You are about to delete <span className="font-semibold">{deleteTargetName}</span>. This action cannot be undone. Enter your password to confirm.
            </p>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDeleteConfirm()}
                  placeholder="Enter your password"
                  disabled={isDeleting}
                  className="w-full border border-[var(--line)] bg-[var(--page-bg)] px-3 py-2 pr-10 text-sm focus:border-red-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  tabIndex={-1}
                >
                  {showDeletePassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {deleteError && <p className="mb-4 text-xs text-red-600">{deleteError}</p>}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => { setDeleteTargetId(null); setDeleteError(null); setDeletePassword(''); }}
                disabled={isDeleting}
                className="border border-[var(--text-muted)] px-6 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting || !deletePassword.trim()}
                className="border border-red-600 bg-red-600 px-6 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
