'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';

export type CourseType = 'core' | 'pool';

export type Course = {
  course_id?: number;
  code: string;
  name: string;
  units: number | null;
  type: CourseType;
  is_elective_slot?: boolean;
};

export type StudyPlanTrack = {
  id: string;
  name: string;
  years: number;
};

export type Pool = {
  id: string;
  name: string;
  courses: (Course & { instanceId: string })[];
};

// --- Helper Functions ---
export const generateSemesters = (years: number) => {
  const semesters = [];
  const yearLabels = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];

  for (let y = 0; y < years; y++) {
    const yearLabel = yearLabels[y] || `${y + 1}th`;
    semesters.push({ id: `y${y + 1}-s1`, label: `${yearLabel} Year, 1st Sem`, year: y + 1, semester: 1 });
    semesters.push({ id: `y${y + 1}-s2`, label: `${yearLabel} Year, 2nd Sem`, year: y + 1, semester: 2 });
  }
  return semesters;
};

// --- Sub-Components ---

export function DraggablePaletteCourse({ id, course }: { id: string; course: Course }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { course, isPaletteItem: true },
  });

  const isElective = course.is_elective_slot;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded border p-2.5 shadow-sm transition active:cursor-grabbing ${isElective
          ? 'border-dashed border-[var(--up-gold)] bg-amber-50/50 hover:bg-amber-50'
          : 'border-[var(--line)] bg-white hover:border-[var(--up-gold)]'
        } ${isDragging ? 'opacity-40' : 'opacity-100'
        }`}
    >
      <div className="flex items-start justify-between">
        <p className={`font-bold text-xs ${isElective ? 'text-[var(--up-gold)]' : 'text-[var(--text-primary)]'}`}>
          {course.code}
        </p>
        <span className="rounded bg-gray-100 px-1 py-0.5 text-[0.55rem] text-gray-600">
          {course.units !== null ? `${course.units}U` : '--'}
        </span>
      </div>
      <p className="mt-0.5 text-[0.65rem] text-[var(--text-secondary)] truncate">{course.name}</p>
    </div>
  );
}

export function DraggablePlacedCourse({ course, instanceId, bucketId, onRemove }: { course: Course; instanceId: string; bucketId: string; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: instanceId,
    data: { course, isPlacedItem: true, instanceId, sourceBucketId: bucketId },
  });

  const isElective = course.is_elective_slot;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative flex cursor-grab items-center justify-between rounded border p-2 shadow-sm transition active:cursor-grabbing ${isElective
          ? 'border-dashed border-amber-300 bg-amber-50'
          : 'border-gray-200 bg-white'
        } ${isDragging ? 'opacity-40' : 'opacity-100'
        }`}
    >
      <div>
        <p className={`text-[0.65rem] font-bold ${isElective ? 'text-amber-700' : 'text-gray-700'}`}>{course.code}</p>
        <p className="text-[0.55rem] text-gray-500 truncate w-28">{course.name}</p>
      </div>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(instanceId)}
        className="hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-xs"
      >
        ×
      </button>
    </div>
  );
}

export function DroppableBucket({ id, label, placedCourses, onRemove, bucketType, onDeleteBucket }: { id: string; label: string; placedCourses: (Course & { instanceId: string })[]; onRemove: (instanceId: string) => void, bucketType: 'semester' | 'pool', onDeleteBucket?: (id: string) => void }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[120px] rounded border-2 p-3 transition-colors ${isOver
          ? 'border-[var(--up-maroon)] bg-red-50/50'
          : 'border-[var(--line)] bg-[var(--surface-muted)]'
        }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <h4 className="flex-1 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--up-maroon)]">
          {label}
        </h4>
        {onDeleteBucket && (
          <button
            onClick={() => onDeleteBucket(id)}
            className="ml-2 text-red-400 transition hover:text-red-700"
            title="Delete Pool"
          >
            ×
          </button>
        )}
      </div>
      <div className="flex-1 space-y-2">
        {placedCourses.map((c) => (
          <DraggablePlacedCourse
            key={c.instanceId}
            course={c}
            instanceId={c.instanceId}
            bucketId={id}
            onRemove={onRemove}
          />
        ))}
        {placedCourses.length === 0 && (
          <div className="flex h-full items-center justify-center text-[0.6rem] font-semibold tracking-widest text-gray-400 text-center px-2">
            Drop {bucketType === 'semester' ? 'Core' : 'Pool'} Courses Here
          </div>
        )}
      </div>
    </div>
  );
}
