'use client';

import { useState, useEffect } from 'react';
import { StudyPlanBuilder } from '@/components/admin/StudyPlanBuilder';
import { apiClient } from '@/lib/apiClient';

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
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProgramId, setActiveProgramId] = useState<number | null>(null);
  const [activeProgramDetails, setActiveProgramDetails] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the list of programs for the sidebar
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await apiClient.get('/programs');
        const fetchedPrograms = res.data.programs || res.data;
        setPrograms(fetchedPrograms);
        
        // Auto-select the first program if none is selected
        if (fetchedPrograms.length > 0) {
          setActiveProgramId(fetchedPrograms[0].program_id);
        }
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // 2. Fetch the detailed data (like Faculty) when a program is selected
  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!activeProgramId) return;
      try {
        // Adjust this endpoint based on your backend routing setup. 
        // It should optimally return the program WITH its department and faculty included.
        const res = await apiClient.get(`/programs/${activeProgramId}`);
        setActiveProgramDetails(res.data.program || res.data);
      } catch (error) {
        console.error("Failed to fetch program details:", error);
      }
    };
    
    fetchProgramDetails();
  }, [activeProgramId]);

  if (isLoading) return <div className="p-8">Loading Programs...</div>;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      
      {/* Left Sidebar: Program List */}
      <aside className="w-64 shrink-0 border-r border-[var(--line)] bg-[var(--surface-muted)] py-8">
        <h3 className="px-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)]">
          Programs
        </h3>
        <div className="mt-4 flex flex-col">
          {programs.map((prog) => (
            <button 
              key={prog.program_id}
              onClick={() => setActiveProgramId(prog.program_id)}
              className={`border-l-4 px-6 py-3 text-left text-sm font-semibold shadow-sm transition-colors ${
                activeProgramId === prog.program_id 
                  ? 'border-[var(--up-gold)] bg-white text-[var(--text-primary)]' 
                  : 'border-transparent text-[var(--text-muted)] hover:bg-gray-100'
              }`}
            >
              {prog.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 space-y-8 p-8 max-w-[1000px]">
        
        {activeProgramDetails ? (
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

            {/* Block 2: Faculty Management */}
            <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
                  Faculty Management
                </h2>
              </div>

              <div className="mb-8 flex h-[350px] flex-col overflow-hidden border border-[var(--line)] bg-white">
                <div className="grid grid-cols-12 gap-4 border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-4">Position</div>
                  <div className="col-span-4">Email</div>
                </div>
                
                <div className="modern-scrollbar flex-1 overflow-y-auto">
                  {activeProgramDetails.department?.faculty && activeProgramDetails.department.faculty.length > 0 ? (
                    activeProgramDetails.department.faculty.map((member, index) => (
                      <div 
                        key={member.faculty_id} 
                        className={`grid grid-cols-12 gap-4 border-b border-[var(--line)] px-6 py-4 text-sm transition hover:bg-gray-50 cursor-pointer ${
                          index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'
                        }`}
                      >
                        <div className="col-span-4 font-semibold text-[var(--text-primary)]">{member.name}</div>
                        <div className="col-span-4 text-[var(--text-secondary)]">{member.position}</div>
                        <div className="col-span-4 text-[var(--text-secondary)]">{member.email}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No faculty members assigned to this department.</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
                <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
                <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
                <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Add</button>
              </div>
            </section>
          </>
        ) : (
          <div className="flex h-[400px] items-center justify-center text-[var(--text-muted)]">
            Select a program from the left sidebar to edit.
          </div>
        )}
      </main>
    </div>
  );
}