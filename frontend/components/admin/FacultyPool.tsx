'use client';

import { useState, useEffect } from 'react';
import { DndContext, pointerWithin, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { apiClient } from '@/lib/apiClient';
import { getFaculty, syncProgramFaculty } from '@/services/apiServices';

interface Faculty {
  faculty_id: number;
  name: string;
  email: string;
  position: string;
  credentials?: Array<{ degree: string }>;
}

interface FacultyPoolProps {
  programId: number;
  programName: string;
}

function DraggableFacultyItem({ id, faculty, source }: { id: string; faculty: Faculty; source: 'available' | 'assigned' }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { faculty, source },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded border border-[var(--line)] bg-white p-2.5 shadow-sm transition hover:border-[var(--up-maroon)] active:cursor-grabbing ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <p className="text-xs font-bold text-[var(--text-primary)]">{faculty.name}</p>
      <p className="mt-0.5 text-[0.65rem] text-[var(--text-secondary)] truncate">{faculty.position}</p>
    </div>
  );
}

function AssignedFacultyItem({ id, faculty, onRemove }: { id: string; faculty: Faculty; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { faculty, source: 'assigned' },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative flex cursor-grab items-center justify-between rounded border border-gray-200 bg-white p-2 shadow-sm transition active:cursor-grabbing ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div className="min-w-0">
        <p className="text-[0.65rem] font-bold text-gray-700 truncate">{faculty.name}</p>
        <p className="text-[0.55rem] text-gray-500 truncate">{faculty.position}</p>
      </div>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onRemove}
        className="ml-2 hidden group-hover:flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-xs"
      >
        ×
      </button>
    </div>
  );
}

function AssignedDropZone({ faculties, onRemove }: { faculties: Faculty[]; onRemove: (id: number) => void }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'assigned' });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded border-2 p-4 transition-colors min-h-[460px] ${
        isOver ? 'border-[var(--up-maroon)] bg-red-50/30' : 'border-[var(--line)] bg-white'
      }`}
    >
      <h3 className="mb-4 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--up-maroon)]">
        Assigned Faculty
        <span className="text-[var(--text-muted)] font-normal ml-2">({faculties.length})</span>
      </h3>
      <div className="space-y-2 overflow-y-auto h-[400px] modern-scrollbar pr-1">
        {faculties.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[0.65rem] font-semibold tracking-widest text-gray-400 uppercase text-center px-4">
            Drag faculty here to assign them
          </div>
        ) : (
          faculties.map((faculty) => (
            <AssignedFacultyItem
              key={faculty.faculty_id}
              id={`assigned-${faculty.faculty_id}`}
              faculty={faculty}
              onRemove={() => onRemove(faculty.faculty_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AvailableSidebar({ faculties }: { faculties: Faculty[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'available' });

  return (
    <div
      ref={setNodeRef}
      className={`w-64 shrink-0 flex flex-col rounded border-2 p-4 transition-colors ${
        isOver ? 'border-[var(--up-maroon)] bg-red-50/30' : 'border-[var(--line)] bg-[var(--surface-muted)]'
      }`}
    >
      <h3 className="mb-4 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-primary)]">
        Available Faculty
        <span className="text-[var(--text-muted)] font-normal ml-2">({faculties.length})</span>
      </h3>
      <div className="modern-scrollbar overflow-y-auto space-y-3 pr-1 h-[400px]">
        {faculties.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[0.6rem] font-semibold tracking-widest text-gray-400 uppercase text-center px-2">
            All faculty assigned
          </div>
        ) : (
          faculties.map((faculty) => (
            <DraggableFacultyItem
              key={faculty.faculty_id}
              id={`available-${faculty.faculty_id}`}
              faculty={faculty}
              source="available"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function FacultyPool({ programId, programName }: FacultyPoolProps) {
  const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);
  const [assignedFaculty, setAssignedFaculty] = useState<Faculty[]>([]);
  const [activeFaculty, setActiveFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    loadFacultyData();
  }, [programId]);

  const loadFacultyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const allFacultyData = await getFaculty();
      setAllFaculty(allFacultyData || []);

      try {
        const programRes = await apiClient.get(`/programs/${programId}`);
        const programData = programRes.data.program || programRes.data;

        const assigned =
          programData.faculties?.map((pf: any) => pf.faculty || pf) ||
          programData.program_faculties?.map((pf: any) => pf.faculty || pf) ||
          [];

        setAssignedFaculty(assigned);
      } catch (err) {
        console.error('Failed to load assigned faculty:', err);
        setAssignedFaculty([]);
      }

      setIsDirty(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load faculty');
      setAssignedFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const availableFaculty = allFaculty.filter(
    (f) => !assignedFaculty.some((a) => a.faculty_id === f.faculty_id)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveFaculty(null);

    if (!over) return;

    const source: 'available' | 'assigned' = active.data.current?.source;
    const target = over.id as string;
    const faculty: Faculty = active.data.current?.faculty;

    if (!faculty || source === target) return;

    if (target === 'assigned' && source === 'available') {
      setAssignedFaculty((prev) => [...prev, faculty]);
      setIsDirty(true);
    } else if (target === 'available' && source === 'assigned') {
      setAssignedFaculty((prev) => prev.filter((f) => f.faculty_id !== faculty.faculty_id));
      setIsDirty(true);
    }
  };

  const handleRemove = (facultyId: number) => {
    setAssignedFaculty((prev) => prev.filter((f) => f.faculty_id !== facultyId));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setError(null);
      const facultyIds = assignedFaculty.map((f) => f.faculty_id);
      await syncProgramFaculty(programId, facultyIds);
      setIsDirty(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save faculty');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-[var(--text-muted)]">Loading faculty...</div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
      )}

      <div className="bg-[var(--surface-muted)] px-6 py-4 border border-[var(--line)]">
        <p className="text-sm text-[var(--text-secondary)]">
          Drag faculty from <strong>Available Faculty</strong> into the assigned area to add them to{' '}
          <strong>{programName}</strong>. Drag back or click × to remove.
        </p>
      </div>

      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={(e) => setActiveFaculty(e.active.data.current?.faculty ?? null)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6">
          <AssignedDropZone faculties={assignedFaculty} onRemove={handleRemove} />
          <AvailableSidebar faculties={availableFaculty} />
        </div>

        <DragOverlay>
          {activeFaculty ? (
            <div className="opacity-90 rotate-2 scale-105 cursor-grabbing rounded border-2 border-[var(--up-maroon)] bg-white p-2.5 shadow-2xl w-52">
              <p className="text-xs font-bold text-[var(--up-maroon)]">{activeFaculty.name}</p>
              <p className="mt-0.5 text-[0.65rem] text-[var(--text-secondary)] truncate">{activeFaculty.position}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
        <button
          onClick={loadFacultyData}
          className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] transition ${
            isDirty
              ? 'bg-[var(--up-maroon)] text-white hover:bg-[#5c0709]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Faculty
        </button>
      </div>
    </div>
  );
}
