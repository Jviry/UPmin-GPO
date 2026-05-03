'use client';

import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';

// --- Types & Initial Data ---
type Course = {
  id: string;
  code: string;
  name: string;
  units: number;
  location: string; // 'pool' or a specific slot ID like 'slot-1'
};

const INITIAL_COURSES: Course[] = [
  { id: 'c-203', code: 'CMSC 203', name: 'Advanced Algorithms', units: 3, location: 'pool' },
  { id: 'c-204', code: 'CMSC 204', name: 'Machine Learning', units: 3, location: 'pool' },
  { id: 'c-205', code: 'CMSC 205', name: 'Data Science', units: 3, location: 'pool' },
];

const ELECTIVE_SLOTS = ['slot-1', 'slot-2']; // IDs for our drop zones

// --- Helper Components ---

function DraggableCourse({ course }: { course: Course }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: course.id,
    data: course,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded border border-[var(--line)] bg-white p-3 shadow-sm transition hover:border-[var(--up-gold)] active:cursor-grabbing ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="font-bold text-[var(--text-primary)]">{course.code}</p>
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.6rem] text-gray-600">{course.units}U</span>
      </div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">{course.name}</p>
    </div>
  );
}

function DroppableSlot({ id, course }: { id: string; course?: Course }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[70px] items-center justify-center rounded border-2 p-2 transition-colors ${
        isOver ? 'border-[var(--up-maroon)] bg-red-50/50' : 'border-dashed border-[var(--up-gold)] bg-yellow-50/30'
      }`}
    >
      {course ? (
        <div className="w-full">
           {/* If a course is in the slot, render it as draggable so it can be moved out */}
          <DraggableCourse course={course} />
        </div>
      ) : (
        <span className="text-sm font-semibold tracking-widest text-[var(--up-gold)]">
          + Drop Elective Here
        </span>
      )}
    </div>
  );
}

function DroppablePool({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'pool' });
  
  return (
    <div 
      ref={setNodeRef} 
      className={`modern-scrollbar flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${
        isOver ? 'bg-gray-100' : ''
      }`}
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Electives</div>
      {children}
    </div>
  );
}

// --- Main Component ---

export function StudyPlanBuilder() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // Handle the drag end event
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveCourse(null); // Clear overlay

    if (!over) return; // Dropped outside a valid zone

    const courseId = active.id;
    const newLocation = over.id; // 'pool', 'slot-1', or 'slot-2'

    setCourses((prev) => {
      // If dropping into a slot that already has a course, bump the existing course back to the pool
      const existingCourseInSlot = prev.find((c) => c.location === newLocation && newLocation !== 'pool');
      
      return prev.map((course) => {
        if (course.id === courseId) {
          return { ...course, location: newLocation }; // Move dragged course
        }
        if (existingCourseInSlot && course.id === existingCourseInSlot.id) {
          return { ...course, location: 'pool' }; // Bump existing course back to pool
        }
        return course;
      });
    });
  };

  const poolCourses = courses.filter((c) => c.location === 'pool');

  return (
    <div className="flex flex-col gap-4 border border-[var(--line)] bg-[var(--page-bg)] p-6">
      
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Study Plan Management
        </h3>
        <span className="rounded bg-[var(--up-maroon)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">
          Total Units: 15
        </span>
      </div>

      <DndContext 
        collisionDetection={closestCenter}
        onDragStart={(e) => {
          const course = courses.find(c => c.id === e.active.id);
          if (course) setActiveCourse(course);
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[500px] gap-6">
          
          {/* LEFT: Course Pool */}
          <div className="flex w-1/3 flex-col border border-[var(--line)] bg-[var(--surface-muted)]">
            <div className="border-b border-[var(--line)] bg-white p-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)]">
              Course Pool
            </div>
            
            {/* The Pool is a Droppable zone so you can drag items back into it */}
            <DroppablePool>
              {poolCourses.map((course) => (
                <DraggableCourse key={course.id} course={course} />
              ))}
              {poolCourses.length === 0 && (
                <div className="text-center text-xs text-gray-400 mt-4">Pool is empty</div>
              )}
            </DroppablePool>
          </div>

          {/* RIGHT: Study Guide */}
          <div className="flex flex-1 flex-col border border-[var(--line)] bg-white">
            <div className="border-b border-[var(--line)] bg-[var(--surface-muted)] p-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)]">
              Year 1 - First Semester
            </div>
            
            <div className="modern-scrollbar flex-1 space-y-4 overflow-y-auto bg-[var(--page-bg)] p-6">
              
              {/* Rigid Core Courses */}
              <div className="flex items-center rounded border border-gray-200 bg-gray-100 p-4 opacity-80 shadow-sm">
                <div className="mr-4 flex shrink-0 items-center justify-center rounded bg-gray-300 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-gray-600">CORE</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-700">CMSC 201</p>
                  <p className="text-xs text-gray-500">Theory of Computation</p>
                </div>
                <div className="text-xs font-bold text-gray-400">3 Units</div>
              </div>

              <div className="flex items-center rounded border border-gray-200 bg-gray-100 p-4 opacity-80 shadow-sm">
                <div className="mr-4 flex shrink-0 items-center justify-center rounded bg-gray-300 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-gray-600">CORE</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-700">CMSC 202</p>
                  <p className="text-xs text-gray-500">Advanced Computer Systems</p>
                </div>
                <div className="text-xs font-bold text-gray-400">3 Units</div>
              </div>

              {/* Dynamic Drop Zones for Electives */}
              {ELECTIVE_SLOTS.map((slotId) => {
                const courseInSlot = courses.find((c) => c.location === slotId);
                return <DroppableSlot key={slotId} id={slotId} course={courseInSlot} />;
              })}

            </div>
          </div>

        </div>

        {/* Floating overlay while dragging */}
        <DragOverlay>
          {activeCourse ? (
             <div className="opacity-90 rotate-2 scale-105 transition-transform cursor-grabbing rounded border-2 border-[var(--up-gold)] bg-white p-3 shadow-2xl">
               <div className="flex items-start justify-between">
                 <p className="font-bold text-[var(--up-maroon)]">{activeCourse.code}</p>
                 <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.6rem] text-gray-600">{activeCourse.units}U</span>
               </div>
               <p className="mt-1 text-xs text-[var(--text-secondary)]">{activeCourse.name}</p>
             </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}