'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import LoadingScreen from '@/components/admin/LoadingScreen';
import FacultyPool from '@/components/admin/FacultyPool';
import { ProgramsSidebar } from '@/components/admin/ProgramsSidebar';
import { CreateProgramBlock } from '@/components/admin/CreateProgramBlock';
import { EditProgramInfoBlock } from '@/components/admin/EditProgramInfoBlock';
import { FormsFeesManagementBlock } from '@/components/admin/FormsFeesManagementBlock';
import { ApplicationSection } from '@/components/admin/ApplicationSection';

// Type based on Prisma Schema (Department completely removed)
export type Program = {
  program_id: number;
  name: string;
  description: string;
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
      
      <ProgramsSidebar 
        programs={programs} 
        activeProgramId={activeProgramId} 
        isCreating={isCreating} 
        selectProgram={selectProgram} 
        setIsCreating={setIsCreating} 
      />

      <main className="flex-1 overflow-y-auto space-y-8 p-8">
        {isLoadingDetails ? (
          <LoadingScreen />
        ) : isCreating ? (
          <CreateProgramBlock onCancel={() => setIsCreating(false)} />
        ) : activeProgramDetails ? (
          <>
            <EditProgramInfoBlock programId={activeProgramId!} program={activeProgramDetails} />
            
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

        {!isCreating && !isLoadingDetails && activeProgramDetails && (
          <FormsFeesManagementBlock program={activeProgramDetails} />
        )}
      </main>
    </div>
  );
}
