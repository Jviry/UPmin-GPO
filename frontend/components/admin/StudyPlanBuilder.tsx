'use client';

import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';

// --- Types & Catalog Data ---
type Course = {
  code: string;
  name: string;
  units: number;
};

// This is our permanent "Pool". Items never leave this list.
const COURSE_CATALOG: Course[] = [
  { code: 'CMSC 203', name: 'Advanced Algorithms', units: 3 },
  { code: 'CMSC 204', name: 'Machine Learning', units: 3 },
  { code: 'CMSC 205', name: 'Data Science', units: 3 },
  { code: 'CMSC 399', name: 'Graduate Seminar', units: 1 },
  { code: 'CMSC 400', name: 'Doctorate Dissertation', units: 3 },
];

const ELECTIVE_SLOTS = ['slot-1', 'slot-2', 'slot-3'];

// --- Helper Components ---

function DraggableCourse({ id, course }: { id: string; course: Course }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id, // We pass a specific ID depending on if it's in the pool or in a slot
    data: course,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded border border-[var(--line)] bg-white p-3 shadow-sm transition hover:border-[var(--up-gold)] active:cursor-grabbing ${
        isDragging ? 'opacity-40' : 'opacity-100'
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

function DroppableSlot({ slotId, course }: { slotId: string; course: Course | null }) {
  // The droppable zone has the ID 'slot-X'
  const { isOver, setNodeRef } = useDroppable({ id: slotId });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[70px] items-center justify-center rounded border-2 p-2 transition-colors ${
        isOver ? 'border-[var(--up-maroon)] bg-red-50/50' : 'border-dashed border-[var(--up-gold)] bg-yellow-50/30'
      }`}
    >
      {course ? (
        <div className="w-full">
           {/* The draggable item inside the slot has the ID 'item_slot-X' */}
          <DraggableCourse id={`item_${slotId}`} course={course} />
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
  // Making the pool droppable allows us to use it as a "Trash Can" to remove items from slots
  const { isOver, setNodeRef } = useDroppable({ id: 'pool' });
  
  return (
    <div 
      ref={setNodeRef} 
      className={`modern-scrollbar flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${
        isOver ? 'bg-red-50/30 border-inner border-red-200' : ''
      }`}
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {isOver ? "Drop to Remove" : "Electives & Seminars"}
      </div>
      {children}
    </div>
  );
}

// --- Main Component ---

export function StudyPlanBuilder() {
  // State maps slot IDs to cloned Course objects
  const [slots, setSlots] = useState<Record<string, Course | null>>({
    'slot-1': null,
    'slot-2': null,
    'slot-3': null,
  });
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveCourse(null);

    // Parse what we are dragging
    const activeId = String(active.id);
    const isFromPool = activeId.startsWith('pool_');
    const isFromSlot = activeId.startsWith('item_');

    // If dropped entirely outside a valid zone, just remove it if it came from a slot
    if (!over) {
      if (isFromSlot) {
        const sourceSlotId = activeId.replace('item_', '');
        setSlots((prev) => ({ ...prev, [sourceSlotId]: null }));
      }
      return;
    }

    const overId = String(over.id);

    // Scenario 1: Dropped into a Study Plan Slot
    if (overId.startsWith('slot-')) {
      if (isFromPool) {
        // Clone from pool into slot
        const courseCode = activeId.replace('pool_', '');
        const course = COURSE_CATALOG.find((c) => c.code === courseCode);
        if (course) {
          setSlots((prev) => ({ ...prev, [overId]: course }));
        }
      } else if (isFromSlot) {
        // Swap or move from one slot to another
        const sourceSlotId = activeId.replace('item_', '');
        setSlots((prev) => ({
          ...prev,
          [sourceSlotId]: prev[overId], // Put whatever was in the target back into the source
          [overId]: prev[sourceSlotId], // Put the dragged item into the target
        }));
      }
    } 
    // Scenario 2: Dropped back into the Pool (Acts as a delete)
    else if (overId === 'pool') {
      if (isFromSlot) {
        const sourceSlotId = activeId.replace('item_', '');
        setSlots((prev) => ({ ...prev, [sourceSlotId]: null }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-[var(--line)] bg-[var(--page-bg)] p-6">
      
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Study Plan Management
        </h3>
      </div>

      <DndContext 
        collisionDetection={closestCenter}
        onDragStart={(e) => {
          const course = e.active.data.current as Course;
          if (course) setActiveCourse(course);
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[500px] gap-6">
          
          {/* LEFT: Course Pool */}
          <div className="flex w-1/3 flex-col border border-[var(--line)] bg-[var(--surface-muted)] relative">
            <div className="border-b border-[var(--line)] bg-white p-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)]">
              Course Pool
            </div>
            
            <DroppablePool>
              {COURSE_CATALOG.map((course) => (
                <DraggableCourse 
                  key={`pool_${course.code}`} 
                  id={`pool_${course.code}`} 
                  course={course} 
                />
              ))}
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

              {/* Dynamic Drop Zones */}
              {ELECTIVE_SLOTS.map((slotId) => (
                <DroppableSlot key={slotId} slotId={slotId} course={slots[slotId]} />
              ))}

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