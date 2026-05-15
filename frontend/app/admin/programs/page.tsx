'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { deleteProgram } from '@/services/apiServices';
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
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
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

      {/* Delete confirmation modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm border border-[var(--line)] bg-white p-8 shadow-lg">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Delete Program
            </h3>
            <p className="mb-6 text-sm text-[var(--text-secondary)]">
              Are you sure you want to delete <span className="font-semibold">{deleteTargetName}</span>? This action cannot be undone.
            </p>
            {deleteError && <p className="mb-4 text-xs text-red-600">{deleteError}</p>}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => { setDeleteTargetId(null); setDeleteError(null); }}
                disabled={isDeleting}
                className="border border-[var(--text-muted)] px-6 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
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
